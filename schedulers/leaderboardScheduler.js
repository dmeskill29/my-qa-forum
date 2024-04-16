const cron = require('node-cron');
import { db } from "@/lib/db";

async function resetLeaderboards() {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const users = await db.user.findMany();

  const leaderboardEntries = users.flatMap((user) => [
    { userId: user.id, month: currentMonth, leaderboardId: 'smartCookie' },
    { userId: user.id, month: currentMonth, leaderboardId: 'fatCat' },
    { userId: user.id, month: currentMonth, leaderboardId: 'socialButterfly' },
    { userId: user.id, month: currentMonth, leaderboardId: 'problemChild' },
    { userId: user.id, month: currentMonth, leaderboardId: 'tryHard' },
  ]);

  await db.leaderboard.createMany({
    data: leaderboardEntries,
    skipDuplicates: true,
  });

  console.log('Leaderboards reset for the new month');
}


// Check if leaderboards have been initialized

async function main() {
  const existingLeaderboards = await db.leaderboard.findMany();
  if (existingLeaderboards.length === 0) {
    await resetLeaderboards();
  }
}

main();



// Schedule the resetLeaderboards function to run on the 1st day of every month at 00:00
cron.schedule('0 0 1 * *', async () => {
  await resetLeaderboards();
});