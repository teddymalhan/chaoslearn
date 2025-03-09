import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import LottieLoader from "./LottieLoader";

function Welcomepage() {
  const navigate = useNavigate(); // Navigation hook

  // State variables
  const [studyTopic, setStudyTopic] = useState("");
  const [duration, setDuration] = useState("");
  const [sliderValue, setSliderValue] = useState(5);
  const [randomTheme, setRandomTheme] = useState("");
  const [loading, setLoading] = useState(false);

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

    setLoading(true); // Show loading animation

    try {
      const response = await fetch("http://127.0.0.1:5000/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lessonData),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch videos");
      }

      const data = await response.json();
      console.log("Fetched videos:", data);

      // Navigate to the Playlist page and pass fetched videos
      navigate("/playlist", { state: { videos: data } });
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col text-white">
      {/* Loading Spinner Overlay */}
      {loading && <LottieLoader />}

      {/* Heading */}
      <div className="flex-1 flex items-center justify-center p-2">
        <h1 className="text-8xl font-extrabold text-[#E50914]">Welcome to Chaos Learn</h1>
      </div>

      {/* Study Topic & Duration */}
      <div className="flex-1 flex flex-col items-center justify-center p-2">
        <div className="flex flex-col items-center space-y-8">
          {/* Study Topic */}
          <div className="flex flex-col items-center space-y-2">
            <p className="text-4xl">What do you want to study today?</p>
            <input
              type="text"
              placeholder="Enter a topic"
              value={studyTopic}
              onChange={handleTopicChange}
              className="p-3 w-150 border border-gray-400 rounded bg-transparent text-white placeholder-gray-500 focus:outline-none focus:border-[#E50914] transition-colors duration-200 text-2xl"
            />
          </div>

          {/* Duration Selection */}
          <div className="flex flex-col items-center space-y-2">
            <p className="text-4xl">Duration</p>
            <div className="flex space-x-4">
              {["Short (15-30 min)", "Medium (30min - 1 hr)", "Long (1 hr - 2 hrs)"].map((label, index) => (
                <button
                  key={index}
                  onClick={() => handleDurationClick(index.toString())}
                  className={`px-6 py-3 border rounded border-[#E50914] transition-colors duration-200 text-2xl ${
                    duration === index.toString()
                      ? "bg-white text-[#E50914]"
                      : "bg-transparent text-[#E50914] hover:bg-gray-500 hover:text-white"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Random Level & Random Theme */}
      <div className="flex-1 flex flex-wrap items-center justify-center gap-50 p-2">
        {/* Random Level */}
        <div className="flex flex-col items-center">
          <p className="text-4xl font-semibold mb-2">Random Level</p>
          <input type="range" className="w-48 accent-[#E50914]" min="1" max="10" step="1" value={sliderValue} onChange={handleSliderChange} />
          <div className="flex justify-between w-48 text-sm mt-2">
            {[...Array(5)].map((_, i) => (
              <span key={i}>{i + 1}</span>
            ))}
          </div>
        </div>

        {/* Random Theme */}
        <div className="flex flex-col items-center">
          <p className="text-4xl font-semibold mb-2">Random Theme</p>
          <input
            type="text"
            placeholder="Enter theme"
            value={randomTheme}
            onChange={handleThemeChange}
            className="border border-gray-400 p-3 w-80 bg-transparent text-white placeholder-gray-500 focus:outline-none focus:border-[#E50914] transition-colors duration-200 text-2xl"
          />
        </div>
      </div>

      {/* Create My Lesson Button */}
      <div className="flex-1 flex items-center justify-center p-2">
        <button onClick={handleCreateLesson} className="px-8 py-4 bg-[#E50914] text-white font-bold rounded transition-colors duration-200 text-2xl hover:bg-red-600">
          Create My Lesson
        </button>
      </div>
    </div>
  );
}

export default Welcomepage;