import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { Heart, TrendingUp, Clock, Download } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Community = () => {
  const [creations, setCreations] = useState([]);
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  const [activeTab, setActiveTab] = useState("recent");

  const fetchCreations = async () => {
    setLoading(true);
    try {
      let endpoint = "/api/user/get-publish-creations";
      if (activeTab === "popular") {
        endpoint = "/api/user/get-most-liked-creations";
      }

      const { data } = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });

      if (data.success) {
        setCreations(data.creations);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  const imageLikeToggle = async (id) => {
    try {
      const { data } = await axios.post(
        "/api/user/toggle-like-creations",
        { id },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );
      if (data.success) {
        toast.success(data.message);

        await fetchCreations();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleImageDownload = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const filename = "generated-image";
      a.download = `${filename}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Downloading image!");
    } catch (error) {
      toast.error("Failed to download image.");
      console.error("Download Error:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCreations();
    }
  }, [user, activeTab]);

  return (
    <div className="flex-1 h-full flex flex-col gap-4 p-6">
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab("recent")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg ${
            activeTab === "recent"
              ? "bg-primary text-white"
              : "bg-white text-slate-700 border"
          }`}
        >
          <Clock className="w-4 h-4" />
          Recent
        </button>
        <button
          onClick={() => setActiveTab("popular")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg ${
            activeTab === "popular"
              ? "bg-primary text-white"
              : "bg-white text-slate-700 border"
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Popular
        </button>
      </div>

      {loading ? (
        <div className="flex-1 flex justify-center items-center h-full">
          <span className="w-10 h-10 my-1 rounded-full border-3 border-primary border-t-transparent animate-spin"></span>
        </div>
      ) : (
        <div className="bg-white h-full rounded-xl overflow-y-scroll">
          {creations.map((creation, index) => (
            <div
              key={index}
              className="relative group inline-block
            pl-3 pt-3 w-full sm:max-w-1/2 lg:max-w-1/3"
            >
              <img
                src={creation.content}
                alt=""
                className="w-full h-full object-cover rounded-lg aspect-square"
              />
              <div
                className="absolute bottom-0 top-0 right-0 left-3 flex gap-2
              items-end justify-end group-hover:justify-between p-3
              group-hover:bg-gradient-to-b from-transparent to-black/80 text-white
              rounded-lg"
              >
                <p className="text-sm hidden group-hover:block">
                  {creation.prompt}
                </p>
                <div className="flex items-center gap-1 bg-black/30 rounded-full px-2 py-0.5">
                  <p>{creation.likes.length}</p>
                  <Heart
                    onClick={() => imageLikeToggle(creation.id)}
                    className={`min-w-5 h-5 hover:scale-110 cursor-pointer
                ${
                  creation.likes.includes(user.id)
                    ? "fill-red-500 text-red-600"
                    : "text-white"
                }`}
                  />
                </div>
                <button
                  onClick={() =>
                    handleImageDownload(creation.content)
                  }
                  title="Download"
                  className="hover:scale-110"
                >
                  <Download className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Community;
