import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import LottieLoader from "./LottieLoader";
import Playlist from "./Playlist";

// Utility function to replace the imported cn function
function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-white/[0.08]",
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -150,
        rotate: rotate - 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: rotate,
      }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={{
          y: [0, 15, 0],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{
          width,
          height,
        }}
        className="relative"
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            "bg-gradient-to-r to-transparent",
            gradient,
            "backdrop-blur-[2px] border-2 border-white/[0.15]",
            "shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]",
            "after:absolute after:inset-0 after:rounded-full",
            "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]"
          )}
        />
      </motion.div>
    </motion.div>
  );
}

function Welcomepage() {
  const navigate = useNavigate();
  // State variables
  const [studyTopic, setStudyTopic] = useState("");
  const [duration, setDuration] = useState("");
  const [sliderValue, setSliderValue] = useState(5);
  const [randomTheme, setRandomTheme] = useState("");
  const [loading, setLoading] = useState(false);
  const [lessonVideos, setLessonVideos] = useState([]);

  // Input handlers
  const handleTopicChange = (event) => setStudyTopic(event.target.value);
  const handleSliderChange = (event) => setSliderValue(Number(event.target.value));
  const handleThemeChange = (event) => setRandomTheme(event.target.value);
  const handleDurationClick = (selectedDuration) => setDuration(selectedDuration);

  // Function to fetch videos from Flask backend
  const handleCreateLesson = async () => {
    if (!studyTopic.trim() || !randomTheme.trim()) {
      alert("Please fill out all required fields before creating your lesson.");
      return;
    }

    const lessonData = {
      studyTopic,
      duration,
      sliderValue: sliderValue.toString(),
      randomTheme,
    };

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lessonData),
      });

      if (!response.ok) throw new Error("Failed to fetch videos");
      
      const data = await response.json();
      console.log("Fetched videos:", data);

      //setLessonVideos(data);
      navigate("/playlist", { state: { videos: data } });
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: 0.5 + i * 0.2,
        ease: [0.25, 0.4, 0.25, 1],
      },
    }),
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#030303] text-white">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#E50914]/[0.05] via-transparent to-indigo-500/[0.05] blur-3xl" />

      {/* Elegant shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <ElegantShape
          delay={0.3}
          width={600}
          height={140}
          rotate={12}
          gradient="from-[#E50914]/[0.15]"
          className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
        />

        <ElegantShape
          delay={0.5}
          width={500}
          height={120}
          rotate={-15}
          gradient="from-indigo-500/[0.15]"
          className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
        />

        <ElegantShape
          delay={0.4}
          width={300}
          height={80}
          rotate={-8}
          gradient="from-violet-500/[0.15]"
          className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
        />

        <ElegantShape
          delay={0.6}
          width={200}
          height={60}
          rotate={20}
          gradient="from-amber-500/[0.15]"
          className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
        />
      </div>

      {/* Loading Spinner Overlay */}
      {loading && <LottieLoader />}

      <div className="relative z-10 container mx-auto px-4 pt-16 pb-8 flex flex-col min-h-screen">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            custom={0}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            <h1 className="text-5xl md:text-8xl font-extrabold tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">Welcome to</span>
              <br />
              <span
                className={cn(
                  "bg-clip-text text-transparent bg-gradient-to-r from-[#E50914] to-red-400",
                  "font-pacifico" // Changed to CSS class
                )}
              >
                Chaos Learn
              </span>
            </h1>
          </motion.div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col space-y-12">
          {/* Study Topic Input */}
          <motion.div
            custom={1}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center space-y-4"
          >
            <p className="text-2xl md:text-4xl text-white/90 font-light">
              What do you want to study today?
            </p>
            <input
              type="text"
              placeholder="Enter a topic"
              value={studyTopic}
              onChange={handleTopicChange}
              className="p-3 w-72 md:w-96 border border-white/20 rounded-full bg-white/[0.03] text-white placeholder-white/40 focus:outline-none focus:border-[#E50914] transition-colors duration-200 text-xl backdrop-blur-sm"
            />
          </motion.div>

          {/* Duration Selection */}
          <motion.div
            custom={2}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center space-y-4"
          >
            <p className="text-2xl md:text-4xl text-white/90 font-light">Duration</p>
            <div className="flex flex-wrap justify-center gap-4">
              {["Short (15-30 min)", "Medium (30min - 1 hr)", "Long (1 hr - 2 hrs)"].map((label, index) => (
                <button
                  key={index}
                  onClick={() => handleDurationClick(index.toString())}
                  className={cn(
                    "px-6 py-3 border rounded-full transition-all duration-300 text-lg backdrop-blur-sm",
                    duration === index.toString()
                      ? "bg-[#E50914] text-white border-[#E50914] shadow-[0_0_15px_rgba(229,9,20,0.5)]"
                      : "bg-white/[0.03] text-white/80 border-white/20 hover:border-[#E50914]/50 hover:text-white"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Controls Section */}
          <motion.div
            custom={3}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col md:flex-row justify-center items-center gap-16 px-4"
          >
            {/* Slider Input */}
            <div className="flex flex-col items-center space-y-4">
              <p className="text-2xl md:text-3xl text-white/90 font-light">Random Level</p>
              <div className="relative w-64">
                <input 
                  type="range" 
                  className="w-full h-2 appearance-none bg-white/10 rounded-full outline-none accent-[#E50914]" 
                  min="1" 
                  max="10" 
                  step="1" 
                  value={sliderValue} 
                  onChange={handleSliderChange} 
                />
                <div className="absolute top-6 left-0 right-0 flex justify-between px-1">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <span key={num} className="text-xs text-white/50">
                      {num}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Theme Input */}
            <div className="flex flex-col items-center space-y-4">
              <p className="text-2xl md:text-3xl text-white/90 font-light">Random Theme</p>
              <input
                type="text"
                placeholder="Enter theme"
                value={randomTheme}
                onChange={handleThemeChange}
                className="p-3 w-72 border border-white/20 rounded-full bg-white/[0.03] text-white placeholder-white/40 focus:outline-none focus:border-[#E50914] transition-colors duration-200 text-xl backdrop-blur-sm"
              />
            </div>
          </motion.div>

          {/* Create Lesson Button */}
          <motion.div
            custom={4}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="flex justify-center mt-8"
          >
            <button 
              onClick={handleCreateLesson} 
              className="px-10 py-4 bg-gradient-to-r from-[#E50914] to-red-600 text-white font-bold rounded-full transition-all duration-300 text-xl shadow-lg hover:shadow-[0_0_25px_rgba(229,9,20,0.6)] transform hover:-translate-y-1"
            >
              Create My Lesson
            </button>
          </motion.div>
        </div>

        {/* Video Playlist */}
        {lessonVideos.length > 0 && (
          <div className="mt-12">
            <Playlist videos={lessonVideos} />
          </div>
        )}
      </div>

      {/* Bottom gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/80 pointer-events-none" />
    </div>
  );
}

export default Welcomepage;