import React, { useEffect, useState } from "react";
import { Gem, Sparkle } from "lucide-react";
import { Protect } from "@clerk/clerk-react";
import CreationItem from "../components/CreationItem";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Dashboard = () => {
  const [creation, setCreation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedValue, setSelectedValue] = useState("Recent");

  const { getToken } = useAuth();

  const getDashboardData = async () => {
    try {
      const { data } = await axios.get("/api/user/get-user-creations", {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });
      if (data.success) {
        setCreation(data.creations);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  const filteredCreations = creation.filter((item) => {
    if (selectedValue === "Recent") return true;
    return item.type === selectedValue;
  });

  useEffect(() => {
    getDashboardData();
  }, []);

  return (
    <div className="h-full overflow-y-scroll p-6">
      <div className="flex justify-start gap-4 flex-wrap">
        {/* Total Creations */}
        <div
          className="flex justify-between items-center w-72 p-4 px-8 bg-white
        rounded-xl border border-gray-200 "
        >
          <div className="text-slate-600">
            <p className="text-sm font-medium">Total Creations</p>
            <h2 className="text-xl font-semibold">
              {console.log(creation.length)}
              {creation.length}
            </h2>
          </div>
          <div
            className="bg-gradient-to-br from-[#3588F2] to-[#0BB0D7]
           w-10 h-10 rounded-lg text-white flex items-center justify-center"
          >
            <Sparkle className="w-5 text-white" />
          </div>
        </div>
        {/* Active plan */}
        <div
          className="flex justify-between items-center w-72 p-4 px-8 bg-white
        rounded-xl border border-gray-200 "
        >
          <div className="text-slate-600">
            <p className="text-sm font-medium">Active Plan</p>
            <h2 className="text-xl font-semibold">
              <Protect plan="premium" fallback="Free">
                Premium
              </Protect>
            </h2>
          </div>
          <div
            className="bg-gradient-to-br from-[#FF61C5] to-[#9E53EE]
           w-10 h-10 rounded-lg text-white flex items-center justify-center"
          >
            <Gem className="w-5 text-white" />
          </div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between items-center mt-6 mb-4">
          <p className="font-medium text-slate-700">{selectedValue === "Recent" ? "Recent Creations" : `Recent ${selectedValue}s`}</p>

          <select
            value={selectedValue}
            onChange={(e) => setSelectedValue(e.target.value)}
            className="px-3 py-2 pr-8 border border-gray-200 rounded-lg text-sm 
                text-slate-600 outline-none bg-white focus:border-primary/50 cursor-pointer"
          >
            <option value="Recent">Recent</option>
            <option value="article">Article</option>
            <option value="summary">Summary</option>
            <option value="image">Image</option>
            <option value="Resume-review">Resume-review</option>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-3/4">
            <div className="w-10 h-10 my-1 rounded-full border-3 border-primary border-t-transparent animate-spin"></div>
          </div>
        ) : (
          <div className="">
            {filteredCreations.map((item) => (
              <CreationItem key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
