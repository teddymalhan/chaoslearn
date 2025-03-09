import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ReactPlayer from "react-player";

function Playlist() {
    const location = useLocation(); 
    const navigate = useNavigate();
    const videos = location.state?.videos || [];

    const [openSection, setOpenSection] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

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

    return (
        <>
            {/* Navigation Buttons */}
            <div className="flex justify-between mt-5 mx-5">
                {/* Back Button */}
                <button
                    onClick={() => navigate("/")}
                    className="bg-gray-800 text-white border-2 border-gray-500 rounded-lg hover:bg-gray-600 p-2 cursor-pointer"
                >
                    ⬅ Back
                </button>

                {/* View Playlist Button */}
                <button
                    onClick={() => setOpenSection(!openSection)}
                    className="bg-black text-white border-2 border-red-600 rounded-lg hover:bg-gray-800 p-2 cursor-pointer"
                >
                    {openSection ? "Hide Playlist" : "View Playlist"}
                </button>
            </div>

            {/* Main Video Player */}
            <motion.div
                animate={{ x: openSection ? -150 : 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center py-[7vh] gap-4 relative"
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
                className="fixed top-0 right-0 h-full w-75 bg-red-600 shadow-lg p-4 overflow-y-auto"
            >
                {/* Close Button */}
                <div className="flex justify-end">
                    <button onClick={() => setOpenSection(false)} className="text-white">✖</button>
                </div>

                {/* Video List */}
                {videos.length === 0 ? (
                    <p className="text-white text-center">No videos available</p>
                ) : (
                    videos.map((video, index) => (
                        <div
                            key={index}
                            className={`rounded-md bg-black p-2 my-3 text-white grid grid-cols-2 gap-4 cursor-pointer hover:bg-gray-700 transition ${
                                index === currentIndex ? "border-2 border-yellow-400" : ""
                            }`}
                            onClick={() => setCurrentIndex(index)}
                        >
                            {/* Video Thumbnail */}
                            <div className="flex items-center">
                                <img 
                                    src={`https://img.youtube.com/vi/${new URL(video.url).searchParams.get("v")}/0.jpg`}
                                    className="w-full object-cover rounded-md" 
                                    alt={video.title}
                                />
                            </div>

                            {/* Video Title & Channel */}
                            <div className="flex flex-col items-start">
                                <h2 className="text-xl font-bold text-[1em]">{video.title}</h2>
                                <p className="text-[0.7em] pt-2">{video.channel}</p>
                                {video.is_fun && <span className="text-sm bg-yellow-400 text-black px-2 py-1 rounded">Fun Video 🎉</span>}
                            </div>
                        </div>
                    ))
                )}
            </motion.div>
        </>
    );
}

export default Playlist;