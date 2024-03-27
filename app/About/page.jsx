import React from "react";

const Page = () => {
  return (
    <div className="bg-white text-gray-800 min-h-screen py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-5xl font-bold text-center mb-10">
          Welcome to <span className="text-blue-600">SolveCircle</span>
        </h1>

        <section className="mb-10">
          <p className="text-lg">
            Hi! We are <strong>Dan and Dee</strong>, the UNC students behind
            SolveCircle. With a love for innovation, a passion for helping, and
            a need for a challenge, we have decided to create the solution to
            everyone&apos;s problems.
          </p>
          <p className="text-lg mt-4">
            With AI and the internet, it&apos;s almost like we have access to
            any information we could ever want to know... almost. With
            SolveCircle, we aimed to create the platform to fill in those nooks
            and crannies that were left behind. For your hyperspecific,
            time-sensitive, expert-requiring, and need-to-know questions!
          </p>
          <p className="text-lg mt-4">
            We want to be the platform that rewards merit! So get rewarded for
            your answers and reward others for their help!
          </p>
        </section>

        <section className="mb-10 p-5 bg-white rounded-lg shadow-md divide-y divide-gray-200 space-y-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Getting Started
          </h2>
          <p className="pt-4 text-gray-600">
            Need help navigating the brand new website? You&apos;ve come to the
            right place! You are our very special test user which means that
            only your email (and the others on the list) are eligible to sign
            up. This means that those of your friends who want to be added to
            the website must contact me at{" "}
            <a href="tel:9192726610" className="text-blue-500">
              919.272.6610
            </a>{" "}
            or email us at{" "}
            <a href="mailto:d@solvecircle.app" className="text-blue-500">
              d@solvecircle.app
            </a>
            .
          </p>
          <div className="pt-4">
            <h3 className="font-semibold text-xl text-gray-800">View Feed</h3>
            <p className="text-gray-600">
              Once you&apos;ve got into the home page, look for the dark blue
              button that says &quot;View Feed&quot;. This will allow you to
              view the feed of problems and solutions. You can also use the
              search bar at the top of the page to look for specific queries.
            </p>
            <p className="text-gray-600 mt-4">
              After you click &quot;View Feed&quot; and pull up the scrollable
              list of problems, you may notice that some of these problems have
              a blue border. That means that they were asked by an Admin user!
            </p>
            <p className="text-gray-600 mt-4">
              Though we don&apos;t yet have many users and a large interface, we
              guarantee that every problem will get at least one solution within
              2 days!
            </p>
            <p className="text-gray-600 mt-4">
              The buttons at the top of the feed page can allow you to organize
              your feed by the most recent problems, problems that are open
              (they don&apos;t have a selected solution yet), and problems
              offering the highest prize!
            </p>
          </div>
          <div className="pt-4">
            <h3 className="font-semibold text-xl text-gray-800">
              Post a Problem
            </h3>
            <p className="text-gray-600">
              To post a problem, notice the &quot;Post a Problem&quot; button
              near the top left of your feed page. Once you click that, you will
              be taken to the draft page. Here, you can add a title and body for
              your problem. Add tags if you feel that it would help your problem
              be more findable!
            </p>
          </div>
          <div className="pt-4">
            <h3 className="font-semibold text-xl text-gray-800">Prizes</h3>
            <p className="text-gray-600">
              You may have been wondering how the key/ prize system works. All
              of you have been given 1000 circle keys (the silver ones)! It
              costs 50 circle keys to post a problem, and on top of that initial
              fee, you can attach a reward for however many keys you would like.
              Right now, test users start with only circle keys, which hold
              value by allowing you to post more problems.
            </p>
            <p className="text-gray-600 mt-4">
              However, there will be some star keys (the gold ones) attached to
              a few Admin problems. Star keys translate to real money, 100 star
              keys is 1$. Providing the best solution to one of these problems
              will not only award you the in- website circle keys attached to
              the problem, but also the star keys. These star keys can be used
              just like circle keys, can be attached to your own problems to
              offer prizes, or can be cashed out at a later date (sometime after
              our hard launch).
            </p>
          </div>
          <div className="pt-4">
            <h3 className="font-semibold text-xl text-gray-800">
              Profile Page
            </h3>
            <p className="text-gray-600">
              You can see how many keys you have, as well as the problems and
              solutions you&apos;ve posted by clicking on your profile page.
              There, you can modify your username and bio, or view your
              problems, solutions, and keychain!
            </p>
          </div>
          <div className="pt-4">
            <h3 className="font-semibold text-xl text-gray-800">Vote</h3>
            <p className="text-gray-600">
              Even if it&apos;s not your problem, we recommend scrolling! Read
              the problems and solutions and upvote/downvote the content based
              on your own opinion.
            </p>
          </div>
        </section>

        <section className="mb-10 p-6 max-w-4xl mx-auto  rounded-lg shadow-lg text-gray-800">
          <h2 className="text-3xl font-bold mb-4">Thank You!</h2>
          <p className="text-lg mb-4">Thank you!</p>
          <p className="text-lg">
            We want to thank you so much for being a test user and we know we
            will appreciate the feedback you are able to give us in developing
            our product! Thank youuuuu!
          </p>
          <p className="text-lg mt-4">
            If you have any questions or concerns, please don&apos;t hesitate to
            reach out!
          </p>
        </section>
      </div>
    </div>
  );
};

export default Page;
