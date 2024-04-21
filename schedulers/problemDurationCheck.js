import { Resend } from "resend";
import { db } from "@/lib/db";

let processedProblems = new Set(); // Set to store processed problem IDs

let isProcessing = false;

async function checkProblemDurations() {
  if (isProcessing) {
    return;
  }

  isProcessing = true;

  try {
    const currentDate = new Date();

    // Find problems that have exceeded their duration
    const problems = await db.problem.findMany({
      where: {
        open: true,
      },
      include: {
        solutions: true,
      },
    });

    const expiredProblems = problems.filter(problem => {
      const durationInMinutes = problem.duration * 24 * 60; // Convert duration in days to minutes
      const createdAt = new Date(problem.createdAt);
      const expirationDate = new Date(createdAt.getTime() + durationInMinutes * 60000);
      const currentDate = new Date();
      if (currentDate > expirationDate && !processedProblems.has(problem.id)) {
        return true;
      }
    });

    // Process the expired problems
    for (const problem of expiredProblems) {
      if (!problem.solutions || problem?.solutions?.length === 0) {
        // Skip problems without solutions
        continue;
      }

      let topSolution;

      if (problem.topSolution) {
        // Fetch the existing top solution
        topSolution = await db.solution.findUnique({
          where: { id: problem.topSolution },
        });
      } else {
        // Find the solution with the most upvotes
        const bestSolution = problem.solutions.reduce((best, current) => {
          if (current.voteSum > 0 && current.voteSum > best.voteSum) {
            return current;
          } else {
            return best;
          }
        }, { voteSum: 0 });

        if (bestSolution && bestSolution.voteSum > 0) {
          await db.problem.update({
            where: { id: problem.id },
            data: { topSolution: bestSolution.id },
          });

          const smartCookieIncrement = await db.leaderboard.update({
            where: {
              userId_month_leaderboardId: {
                userId: bestSolution.authorId,
                month: new Date().toISOString().slice(0, 7),
                leaderboardId: "smartCookie",
              },
            },
            data: {
              score: {
                increment: 1,
              },
            },
          });

          topSolution = bestSolution;
        }
      }

      if (topSolution) {
        // Send notifications to the poster and the solution author
        const poster = await db.user.findUnique({
          where: { id: problem.authorId },
        });

        const solver = await db.user.findUnique({
          where: { id: topSolution.authorId },
        });

        const resend = new Resend(process.env.RESEND_EMAIL_SECRET);

        if (poster.emailNotified) {
          try {
            await resend.emails.send({
              from: process.env.EMAIL_FROM,
              to: poster.email,
              subject: "Your Problem Has Been Solved!",
              html: `
                <p>Congratulations! Your problem has been solved. Check it out!</p>
                <p>Click <a href="https://solvecircle.app/problem/${problem.id}" target="_blank">here</a> to view the solution.</p>
              `,
            });
          } catch (error) {
            console.error('Failed to send email to poster:', error);
          }
        }

        if (solver.emailNotified) {
          try {
            await resend.emails.send({
              from: process.env.EMAIL_FROM,
              to: solver.email,
              subject: "You've Won a Prize!",
              html: `
                <p>Congratulations! You've won a prize for solving a problem. Check it out!</p>
                <p>Click <a href="https://solvecircle.app/problem/${problem.id}" target="_blank">here</a> to view your prize.</p>
              `,
            });
          } catch (error) {
            console.error('Failed to send email to solver:', error);
          }
        }

        // Update the solver's keychain
        await db.keyChain.update({
          where: { id: solver.keychainId },
          data: {
            circleKeys: {
              increment: problem.prizeInCircleKeys,
            },
            starKeys: {
              increment: problem.prizeInStarKeys,
            },
          },
        });
      }

      // Update problem status
      await db.problem.update({
        where: { id: problem.id },
        data: { open: false },
      });

      // Add the problem ID to the set of processed problems
      processedProblems.add(problem.id);
    }
  } catch (error) {
    console.error('Failed to check problem durations:', error);
  } finally {
    // ...
  }
}

// Schedule the cron job to run every hour
setInterval(checkProblemDurations, 3600000);