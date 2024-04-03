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
