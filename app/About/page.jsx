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

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
          <p className="text-lg">
            Need help navigating the brand new website? You&apos;ve come to the
            right place! You are our very special test user which means that
            only your email (and the others on the list) are eligible to sign
            up. This means that those of your friends who want to be added to
            the website must contact us at{" "}
            <a href="tel:9192726610" className="text-blue-500">
              919.272.6610
            </a>{" "}
            or email us at{" "}
            <a href="mailto:d@solvecircle.app" className="text-blue-500">
              d@solvecircle.app
            </a>
            .
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Features</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              View Feed - Look for the dark blue button that says &quot;View
              Feed&quot;.
            </li>
            <li>
              Post a Problem - Notice the &quot;Post a Problem&quot; button near
              the top left of your feed page.
            </li>
            <li>
              Prizes - You may have been wondering how the key/prize system
              works.
            </li>
            <li>Profile Page - View your problems, solutions, and keychain!</li>
            <li>
              Closing a Problem - Monitor the solutions you get and close your
              problem once satisfied.
            </li>
            <li>
              Vote - Read the problems and solutions and upvote/downvote based
              on your opinion.
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Thank You!</h2>
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

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Rules</h2>
          <p className="text-lg">
            By using this website, you agree to our Terms and Conditions. You
            also acknowledge that a user can be removed or suspended from the
            website for any reason.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Page;
