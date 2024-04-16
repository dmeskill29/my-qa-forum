import React from "react";
import Leaderboard from "@/components/Leaderboard";

const page = () => {
  return (
    <div className="flex mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4  py-4  sm:w-full justify-center space-x-4 flex-col items-center">
      <Leaderboard />;
      <p className="text-center text-gray-500 text-sm w-1/2">
        There are 5 leaderboards. The first one is titled &quot;Smart
        Cookie&quot;. Those on the board have provided useful solutions to the
        circle and are in for a sweet treat. The second one is titled &quot;Fat
        Cat&quot;. Those on the board are generous gifters with high rewards on
        their problems and high brows on their faces. The third one is titled
        &quot;Social Butterfly&quot;. Those on the board have been interacted
        with a lot and are probably insects! The fourth one is titled
        &quot;Problem Child&quot;. Those on the board are a bit problematic and
        don&apos;t get enough attention at home. The last one is titled
        &quot;Try Hard&quot;. Those on the board may not be the brightest bulbs
        but at least they try hard, so here&apos;s their participation trophy!
      </p>
    </div>
  );
};

export default page;
