import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ReactPlayer from "react-player";
import Quiz from './Quiz'; // Import the Quiz component

// Utility function to replace the imported cn function
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Playlist() {
  const location = useLocation();
  const navigate = useNavigate();
  const videos = location.state?.videos || [];

  const [openSection, setOpenSection] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false); // State to control Quiz visibility

  // Set first video when videos are received
  useEffect(() => {
    if (videos.length > 0) {
      setCurrentIndex(0);
    }
  }, [videos]);

  // Function to go to the next video
  const handleNextVideo = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length);
  };

  // Function to send video URL to the backend and show the Quiz
  const sendVideoUrlToBackend = async () => {
    const currentVideoId = new URL(videos[currentIndex]?.url).searchParams.get("v");
    if (currentVideoId) {
      navigate(`/quiz/${currentVideoId}`); // Navigate to the quiz page with the youtubeId
    } else {
      alert("Invalid video URL. Cannot navigate to quiz.");
    }
  
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#030303] text-white">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#E50914]/[0.05] via-transparent to-indigo-500/[0.05] blur-3xl" />

      {/* Elegant shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: -150, rotate: 12 - 15 }}
          animate={{ opacity: 1, y: 0, rotate: 12 }}
          transition={{ duration: 2.4, delay: 0.3, ease: [0.23, 0.86, 0.39, 0.96] }}
          className="absolute left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
        >
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            style={{ width: 600, height: 140 }}
            className="relative"
          >
            <div
              className={cn(
                "absolute inset-0 rounded-full",
                "bg-gradient-to-r to-transparent from-[#E50914]/[0.15]",
                "backdrop-blur-[2px] border-2 border-white/[0.15]",
                "shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]",
                "after:absolute after:inset-0 after:rounded-full",
                "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]"
              )}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-5 mx-5 relative z-10">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="bg-[#E50914] text-white px-6 py-2 rounded-full hover:bg-red-700 transition-all duration-300 shadow-lg hover:shadow-[0_0_15px_rgba(229,9,20,0.5)]"
        >
          ⬅ Back to Home
        </button>

        {/* View Playlist Button */}
        <button
          onClick={() => setOpenSection(!openSection)}
          className="bg-[#E50914] text-white px-6 py-2 rounded-full hover:bg-red-700 transition-all duration-300 shadow-lg hover:shadow-[0_0_15px_rgba(229,9,20,0.5)]"
        >
          {openSection ? "Hide Playlist" : "View Playlist"}
        </button>
      </div>

      {/* Main Video Player */}
      <motion.div
        animate={{ x: openSection ? -150 : 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center py-[7vh] gap-4 relative z-10"
      >
        {videos.length > 0 ? (
          <ReactPlayer
            key={videos[currentIndex]?.url}
            url={videos[currentIndex]?.url}
            controls
            width="854px"
            height="480px"
            playing={true} // Autoplay enabled
            onEnded={handleNextVideo} // Play next video when current one ends
          />
        ) : (
          <p className="text-white">No video selected</p>
        )}

        {/* Next Video Floating Button */}
        <button
          onClick={handleNextVideo}
          className="absolute bottom-5 right-5 bg-[#E50914] text-white p-4 rounded-full shadow-lg text-2xl hover:bg-red-700 transition transform hover:scale-105"
        >
          ➡
        </button>
      </motion.div>

      {/* Playlist Sidebar */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: openSection ? 0 : "100%" }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 right-0 h-full w-75 bg-[#030303] shadow-lg p-4 overflow-y-auto z-20 border-l border-[#E50914]/50"
      >
        {/* Close Button */}
        <div className="flex justify-end">
          <button
            onClick={() => setOpenSection(false)}
            className="bg-[#E50914] text-white px-4 py-2 rounded-full hover:bg-red-700 transition-all duration-300 shadow-lg hover:shadow-[0_0_15px_rgba(229,9,20,0.5)]"
          >
            ✖ Close
          </button>
        </div>

        {/* Video List */}
        {videos.length === 0 ? (
          <p className="text-white text-center">No videos available</p>
        ) : (
          videos.map((video, index) => {
            const videoId = new URL(video.url).searchParams.get("v");
            const thumbnailUrl = videoId
              ? `https://img.youtube.com/vi/${videoId}/0.jpg`
              : null;

            return (
              <div
                key={index}
                className={`rounded-md bg-[#1a1a1a] p-2 my-3 text-white grid grid-cols-2 gap-4 cursor-pointer hover:bg-[#E50914]/20 transition ${
                  index === currentIndex ? "border-2 border-[#E50914]" : ""
                }`}
                onClick={() => setCurrentIndex(index)}
              >
                {/* Video Thumbnail */}
                <div className="flex items-center">
                  {thumbnailUrl ? (
                    <img
                      src={thumbnailUrl}
                      className="w-full object-cover rounded-md"
                      alt={video.title}
                    />
                  ) : (
                    <div className="w-full h-24 bg-[#E50914]/10 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm">Thumbnail not available</span>
                    </div>
                  )}
                </div>

                {/* Video Title & Channel */}
                <div className="flex flex-col items-start">
                  <h2 className="text-xl font-bold text-[1em]">{video.title}</h2>
                  <p className="text-[0.7em] pt-2">{video.channel}</p>
                  {video.is_fun && (
                    <span className="text-sm bg-yellow-400 text-black px-2 py-1 rounded">
                      Fun Video 🎉
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </motion.div>

      {/* Go to Quiz Button */}
      <div className="fixed bottom-5 left-5 z-10">
        <button
        onClick={sendVideoUrlToBackend}
        className="bg-[#E50914] text-white px-6 py-3 rounded-full hover:bg-red-700 transition-all duration-300 shadow-lg hover:shadow-[0_0_15px_rgba(229,9,20,0.5)]"
        style={{ zIndex: 1000 }} // Ensure the button is on top
        >🎯 Go to Quiz</button>
    </div>

      {/* Bottom gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/80 pointer-events-none" />

      {/* Quiz Modal */}
      {showQuiz && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-[#030303] p-6 rounded-lg shadow-lg max-w-md w-full relative border border-[#E50914]/50">
            <button
              className="absolute top-4 right-4 text-white hover:text-[#E50914]"
              onClick={() => setShowQuiz(false)}
            >
              ✖
            </button>

            <Quiz />
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default Playlist;