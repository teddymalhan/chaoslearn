<p align="center">
<img width="128" height="128" src="public/chaoslearn-icon.svg" alt="ChaosLearn - AI-powered video-based learning platform">
</p>

<p align="center">
<strong>Transform your learning with AI-curated video playlists and interactive quizzes</strong>
</p>

<p align="center">
<a href="#features">Features</a> |
<a href="#quick-start">Quick Start</a> |
<a href="#how-it-works">How It Works</a> |
<a href="#documentation">Documentation</a>
</p>

---

# ChaosLearn
> Making self-learning engaging, interactive, and fun through AI-powered video curation

An AI-powered learning platform that automatically generates structured lesson plans, curates educational videos from YouTube, and creates interactive quizzes to optimize your learning experience.

- **Smart Video Curation**: AI finds the best educational content for any topic
- **Engaging Learning Flow**: Mix educational videos with fun content to boost retention
- **Interactive Quizzes**: Auto-generated quizzes reinforce key concepts
- **Personalized Experience**: Every study session is unique and tailored to your needs

Research shows that video-based learning improves retention by 65% compared to text-based learning. With ChaosLearn, you get a personalized study experience that blends education with entertainment to optimize retention and engagement! 🎥📚

## Features

- **AI Lesson Planning**: GPT-4o generates structured lesson plans with YouTube-searchable keywords
- **Smart Video Curation**: Automatically fetches relevant educational videos using yt_dlp
- **Fun Mode Integration**: Interleave educational content with entertaining videos for better engagement
- **Interactive Quizzes**: Auto-generated quizzes based on video content to test comprehension
- **Seamless Playlist Navigation**: Click-to-play videos in a smooth, organized playlist
- **Responsive Design**: Modern UI with smooth animations using Framer Motion
- **Real-time Video Playback**: Integrated React Player for seamless video streaming

## Quick Start

### Prerequisites
- Python 3.8+
- Node.js 18.17+
- OpenAI API key

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/teddymalhan/chaoslearn.git
cd chaoslearn

# Install Python dependencies
pip install -r requirements.txt

# Set up your OpenAI API key
export OPENAI_API_KEY="your-api-key-here"

# Start the Flask backend
python run.py
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd Frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to access the learning platform.

## How It Works

### 1. AI Lesson Planning
- Enter any topic you want to learn about
- GPT-4o generates a structured lesson plan with 10 unique, YouTube-searchable keywords
- Each keyword focuses on different concepts, applications, or technical details

### 2. Smart Video Curation
- yt_dlp searches YouTube for relevant educational videos
- Videos are automatically organized into a logical learning sequence
- Quality filtering ensures you get the best educational content

### 3. Fun Mode Integration
- Adjust the frequency of fun videos (e.g., every 3rd video)
- Maintains engagement while keeping the focus on learning
- Balances education with entertainment for optimal retention

### 4. Interactive Quizzes
- AI generates quiz questions based on video subtitles
- Tests comprehension after watching videos
- Reinforces key takeaways and concepts

## Tech Stack

### Backend
- **Flask**: Web framework for API management
- **OpenAI API (GPT-4o-mini)**: Generates lesson plans and quizzes
- **yt_dlp**: Fetches YouTube videos and metadata
- **Flask-CORS**: Enables cross-origin communication

### Frontend
- **React (Vite + Tailwind CSS)**: Modern, responsive UI
- **Framer Motion**: Smooth animations and transitions
- **React Player**: Video playback functionality
- **React Router**: Page navigation between components

## Project Structure

```
chaoslearn/
├── Frontend/                 # React frontend application
│   ├── src/
│   │   ├── App.jsx          # Main app component with routing
│   │   ├── Welcome.jsx      # Landing page component
│   │   ├── Playlist.jsx     # Video playlist component
│   │   ├── Quiz.jsx         # Quiz component
│   │   └── LottieLoader.jsx # Loading animation
│   ├── package.json
│   └── vite.config.js
├── flaskr/                   # Flask backend application
│   ├── __init__.py          # App factory and helper functions
│   ├── routes.py            # API endpoints
│   └── views.py             # Additional views
├── app.py                   # Flask app entry point
├── run.py                   # Development server runner
├── requirements.txt         # Python dependencies
└── public/
    └── chaoslearn-icon.svg  # Project logo
```

## API Endpoints

- `POST /process` - Generate lesson plan and fetch videos
- `POST /quiz` - Generate quiz questions from video content
- `GET /` - Health check endpoint

## Challenges & Solutions

### Backend-Frontend Integration
- **Challenge**: CORS issues when fetching data
- **Solution**: Implemented Flask-CORS for proper cross-origin communication

### YouTube Search Optimization
- **Challenge**: Finding high-quality educational videos
- **Solution**: Refined search queries and implemented quality filtering

### Quiz Generation
- **Challenge**: Creating meaningful quiz questions
- **Solution**: Optimized GPT-4o prompts for better question generation

## Accomplishments

✅ **Structured Learning Flow**: Logical sequence of topics ensures comprehensive coverage  
✅ **Engagement-Boosting Fun Mode**: Perfect balance of education and entertainment  
✅ **AI-Generated Quizzes**: Tests comprehension and reinforces learning  
✅ **Dynamic Video Fetching**: No hardcoded content - every session is unique  
✅ **Modern UI/UX**: Responsive design with smooth animations  

## What's Next

- **Multilingual Support**: Expand learning across multiple languages
- **Interactive Features**: Add discussion prompts and AI-generated summaries
- **Voice Commands**: Speech-to-text integration for hands-free navigation
- **Quiz Customization**: Adjustable difficulty levels based on user preference
- **Progress Tracking**: Save learning progress and create personalized study plans
- **Social Features**: Share playlists and compete with friends

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- **Issues**: Report bugs and request features via [GitHub Issues](https://github.com/teddymalhan/chaoslearn/issues)
- **Discussions**: Join community discussions in [GitHub Discussions](https://github.com/teddymalhan/chaoslearn/discussions)

## Acknowledgments

- Built for educational purposes to demonstrate AI-powered learning solutions
- Inspired by research on video-based learning effectiveness
- Special thanks to the open-source community for the amazing tools and libraries

---

<p align="center">
Made with ❤️ for learners everywhere
</p>
