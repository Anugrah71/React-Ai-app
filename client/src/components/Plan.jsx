import React, { useEffect } from "react";
import { PricingTable } from "@clerk/clerk-react";
import AOS from "aos";
import "aos/dist/aos.css";

const Plan = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
    });
  }, []);
  return (
    <div className="max-w-2xl mx-auto z-20 my-30">
      <div className="text-center">
        <h2 className="text-slate-700 text-[42px]">Choose Your Plan</h2>
        <p className="text-gray-500 max-w-lg mx-auto">
          It for free and scale up as you grow. Find the perfect plan for your
          content creation needs.
        </p>
      </div>
      <div data-aos="flip-down" className="mt-14 max-sm:mx-8">
        <PricingTable  />
      </div>
    </div>
  );
};

export default Plan;
