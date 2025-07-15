import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import Statistics from './models/statistics';
import Language from './models/Language';
import Problem from './models/problem';
import { useAuth } from "./AuthContext";
import axios from "axios";

export default function Dashboard() {
    const navigate = useNavigate();
    const [statistics, setStatistics] = useState({
        username: " ",
        email: " ",
        problemsSolved: 0,
        mediumcount: 0,
        easycount: 0,
        difficultcount: 0,
        accuracy: 0.0,
        prominentLanguage: '...'
    });

    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState('');
    const [selectedTopic, setSelectedTopic] = useState('');
    
    const { user } = useAuth();
    console.log("User in Dashboard:", user);

    useEffect(() => {
        const loadStats = async () => {
            if (!user || !user.email) return;
            try {
                const res = await axios.post("http://127.0.0.1:8000/get-statistics", {
                    email: user.email
                });
                const stats = new Statistics(
                    res.data.username,
                    res.data.email,
                    res.data.problemsSolved,
                    res.data.mediumcount,
                    res.data.easycount,
                    res.data.difficultcount,
                    res.data.accuracy,
                    res.data.prominentLanguage
                );
                setStatistics(stats);
            } catch (err) {
                console.error("Failed to load statistics:", err);
                setStatistics({
                    username: user.username,
                    email: user.email,
                    problemsSolved: 0,
                    mediumcount: 0,
                    easycount: 0,
                    difficultcount: 0,
                    accuracy: 0,
                    prominentLanguage: 'N/A'
                }); // Set default/empty stats on error
            }
        };
        loadStats();
    }, [user]);

    const optionsLanguage = [
        new Language('CPP', '', ''),
        new Language('JAVA', '', ''),
        new Language('JAVASCRIPT', '', ''),
        new Language('PYTHON', '', ''),
        new Language('C#', '', '')
    ];
    const difficultyLevel = ['easy', 'medium', 'hard'];
    const topics = [
        'array', 'string', 'linkedlist', 'stack', 'queue', 'dp', 'graph', 'bst', 'two pointers', 'sliding window', 'recursion'
    ];

    async function handleGenerate() {
        if (selectedLanguage && selectedDifficulty && selectedTopic) {
            try {
                const question = await axios.post("http://127.0.0.1:8000/generate-problem", {
                    language: selectedLanguage.toLowerCase(),
                    difficulty: selectedDifficulty,
                    topic: selectedTopic
                });
                const prob = new Problem(
                    question.data.id,
                    question.data.title,
                    question.data.description,
                    question.data.inputFormat,
                    question.data.outputFormat,
                    question.data.constraints,
                    question.data.examples,
                    question.data.difficulty,
                    question.data.tags,
                    question.data.testCases,
                    question.data.topic
                );
                navigate('/questionsolve', {
                    state: {
                        language: selectedLanguage,
                        difficulty: selectedDifficulty,
                        topic: selectedTopic,
                        question: prob
                    }
                });
            } catch (err) {
                console.error("Failed to generate problem:", err);
                alert("Sorry, we couldn't generate a problem at this time. Please try again later.");
            }
        } else {
            alert('Please select a language, difficulty, and topic.');
        }
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Welcome, {statistics.username}!</h1>
                <p>Select your challenge or review your progress below.</p>
            </div>
            <div className="dashboard-content">
                {/* Options Section */}
                <div className="options-section">
                    <div className="options-card">
                        <h2 className="card-title">Generate New Problem</h2>

                        <div className="selection-group">
                            <label className="selection-label">1. Choose a Language</label>
                            <div className="options-grid">
                                {optionsLanguage.map((language) => (
                                    <button
                                        key={language.name}
                                        className={`option-btn ${selectedLanguage === language.name ? 'selected' : ''}`}
                                        onClick={() => setSelectedLanguage(language.name)}
                                    >
                                        {language.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="selection-group">
                            <label className="selection-label">2. Select Difficulty</label>
                            <div className="options-grid">
                                {difficultyLevel.map((difficulty) => (
                                    <button
                                        key={difficulty}
                                        className={`option-btn difficulty-${difficulty} ${selectedDifficulty === difficulty ? 'selected' : ''}`}
                                        onClick={() => setSelectedDifficulty(difficulty)}
                                    >
                                        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="selection-group">
                            <label className="selection-label">3. Pick a Topic</label>
                            <div className="options-grid topics-grid">
                                {topics.map((topic) => (
                                    <button
                                        key={topic}
                                        className={`option-btn topic-btn ${selectedTopic === topic ? 'selected' : ''}`}
                                        onClick={() => setSelectedTopic(topic)}
                                    >
                                        {topic.charAt(0).toUpperCase() + topic.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="generate-section">
                            <button
                                className="generate-btn"
                                onClick={handleGenerate}
                                disabled={!selectedLanguage || !selectedDifficulty || !selectedTopic}
                            >
                                Generate Problem
                            </button>
                        </div>
                    </div>
                </div>

                {/* Statistics Section */}
                <div className="statistics-section">
                    <div className="stats-card">
                        <h2 className="card-title">Your Statistics</h2>
                        <div className="user-info">
                            <div className="prominent-language">
                                <span>Prominent Language:</span>
                                <strong>{statistics.prominentLanguage}</strong>
                            </div>
                        </div>
                        
                        <div className="problems-solved">
                            <div className="stat-item">
                                <span className="number">{statistics.problemsSolved}</span>
                                <span className="text">Solved</span>
                            </div>
                            <div className="stat-item">
                                <span className="number">{statistics.accuracy?.toFixed(1) || 0}%</span>
                                <span className="text">Accuracy</span>
                            </div>
                        </div>
                        
                        <div className="difficulty-breakdown">
                            <h3>Difficulty Breakdown</h3>
                            <div className="difficulty-stats">
                                <div className="difficulty-item easy">
                                    <span className="difficulty-label">Easy</span>
                                    <span className="difficulty-count">{statistics.easycount}</span>
                                </div>
                                <div className="difficulty-item medium">
                                    <span className="difficulty-label">Medium</span>
                                    <span className="difficulty-count">{statistics.mediumcount}</span>
                                </div>
                                <div className="difficulty-item hard">
                                    <span className="difficulty-label">Hard</span>
                                    <span className="difficulty-count">{statistics.difficultcount}</span>
                                </div>
                            </div>
                        </div>
                        <button 
                                className="submissions-btn" 
                                onClick={() => navigate('/submissionslist')}
                            >
                                View My Submissions
                            </button>
                    </div>
                </div>
            </div>
        </div>
    );
}