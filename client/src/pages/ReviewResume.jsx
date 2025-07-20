import React from "react";
import { useState } from "react";
import {  FileText, Scissors, Sparkles } from "lucide-react";

const ReviewResume = () => {
  const [input, setInput] = useState("");
  const [object, setObject] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
  };
  return (
    <div
    className="h-full overflow-y-scroll  p-6 flex flex-wrap items-start
gap-4 text-slate-700"
  >
    {/* Left Side */}
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200"
    >
      <div className="flex items-center gap-3">
        <Sparkles className="w-6 text-[#00DA82]" />
        <h1 className="text-xl font-semibold">Resume Review</h1>
      </div>

      <p className="mt-6 text-sm font-medium">Upload Resume</p>
      <input
        onChange={(e) => setInput(e.target.files[0])}
        accept="application/pdf"
        type="file"
        className="w-full p-2 px-3 mt-2 outline-none text-sm rounded
border border-gray-300 text-gray-600"
        required
      />
      <p className="text-xs text-gray-500 mt-1 font-light">
        Supports PDF resume only
      </p>
    
      <button
        className="w-full flex justify-center items-center gap-2
    bg-gradient-to-r from-[#00DA83] to-[#009BB3] text-white px-4 py-2 mt-6 
    text-sm rounded-lg cursor-pointer"
      >
        <FileText className="w-5" />
        Review Resume
      </button>
    </form>
    {/* Right Side */}
    <div
      className="w-full max-w-lg p-4 bg-white rounded-lg
  flex flex-col border border-gray-200 min-h-96 max-h-[600px] "
    >
      <div className="flex items-center gap-3">
        <FileText className="w-5 h-5 text-[#00DA82]" />
        <h1 className="text-xl font-semibold">Analysis Result</h1>
      </div>
      <div className="flex flex-1 justify-center items-center">
        <div className="text-sm text-gray-500 flex flex-col items-center gap-5">
          <FileText className="w-9 h-9" />
          <p>Upload an image and click "Review Resume" to get started</p>
        </div>
      </div>
    </div>
  </div>
  );
};

export default ReviewResume;
