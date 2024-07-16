import React from "react";

const Intro = ({ session }) => {
  return (
    <div className="space-y-4 mb-8">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white shadow-lg rounded-full p-6 flex flex-col items-center justify-center">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Find it!</h2>
            <p className="text-gray-600">Search for a problem.</p>
          </div>
          <div className="bg-white shadow-lg rounded-full p-6 flex flex-col items-center justify-center">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Post it!</h2>
            <p className="text-gray-600">Post a problem.</p>
          </div>
          <div className="bg-white shadow-lg rounded-full p-6 flex flex-col items-center justify-center">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Solve it!</h2>
            <p className="text-gray-600">Solve a problem.</p>
          </div>
        </div>
      </div>
      {session ? null : (
        <p className="text-sm text-gray-700 mb-4 bg-blue-100 p-4 rounded-lg shadow-md text-center">
          You need to be signed in to create a problem, solve a problem, search
          for a problem, or to view problems and profiles.
        </p>
      )}
    </div>
  );
};

export default Intro;
