import React from "react";
import {
  
  Text,
  Sparkles,
  ClipboardCopy,
  Download,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import Markdown from "react-markdown";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const TextSummarizer = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const { getToken } = useAuth();
  const MaxChars = 5000;
  const totalCount = input.length;
  const remainingChars = MaxChars - totalCount;
  const isOverLimit = remainingChars < 0;
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const prompt = `Summarize the following text in a few key paragraphs: ${input}`;
      const { data } = await axios.post(
        "/api/ai/generate-text-summarizer",
        { prompt },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );
      if (data.success) {
        setContent(data.content);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard!");
  };
  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = "generated article.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  const handleInputChange = (e) => {
    setInput(e.target.value);
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
          <Sparkles className="w-6 text-[#4A7AFF]" />
          <h1 className="text-xl font-semibold">AI Text Summarizer</h1>
        </div>
        <p className="mt-6 text-sm font-medium">Paste your text to summarize</p>
        <textarea
          onChange={handleInputChange}
          value={input}
          rows={10}
          type="text"
          className={`w-full p-2 px-3 mt-2 outline-none text-sm rounded
            border transition-all ${
              isOverLimit ? "border-red-500" : "border-gray-300" 
            }`}
          placeholder="Paste your long article, notes, or any text here..."
          required
        />
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-gray-500">
            {isOverLimit ? (
              <span className="text-red-600 font-bold flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                You are over the limit!
              </span>
            ) : (
              "Character limit:"
            )}
          </span>

          <p
            className={`text-xs font-medium ${
              isOverLimit ? "text-red-600" : "text-gray-500"
            }`}
          >
            Total: {totalCount} / Remaining: {remainingChars}
          </p>
        </div>
        <br />
        <button
          disabled={loading}
          className="w-full flex justify-center items-center gap-2
        bg-gradient-to-r from-[#226BFF] to-[#65ADFF] text-white px-4 py-2 mt-6 
        text-sm rounded-lg cursor-pointer"
        >
          {loading ? (
            <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
          ) : (
            <Text className="w-5" />
          )}
          Generate Summary
        </button>
      </form>
      {/* Right Side */}
      <div
        className="w-full max-w-lg p-4 bg-white rounded-lg
      flex flex-col border border-gray-200 min-h-96 max-h-[600px]"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Text className="w-5 h-5 text-[#4A7AFF]" />
            <h1 className="text-xl font-semibold">Generated Summary</h1>
          </div>
          {content && (
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="p-1.5 rounded-md hover:bg-gray-100 transition-all"
                title="Copy"
              >
                <ClipboardCopy className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={handleDownload}
                className="p-1.5 rounded-md hover:bg-gray-100 transition-all"
                title="Download"
              >
                <Download className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          )}
        </div>
        {!content ? (
          <div className="flex flex-1 justify-center items-center">
            <div className="text-sm text-gray-500 flex flex-col items-center gap-5">
              <Text className="w-9 h-9" />
              <p>
                Paste text above and click "Generate Summary" to get started
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-3 h-full overflow-y-scroll text-sm text-slate-600">
            <div className="reset-tw">
              <Markdown>{content}</Markdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TextSummarizer;
