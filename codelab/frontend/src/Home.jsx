import { Link } from 'react-router-dom';
import './Home.css'; // Import the new stylesheet
import { Rocket, Code, Zap, BarChart } from 'lucide-react';

export default function Home() {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>
            <span className="hero-title">AI Code</span>
            <span className="hero-title-accent">Partner</span>
          </h1>
          <p className="hero-subtitle">
            Sharpen your skills with AI-powered coding challenges, real-time feedback, and intelligent suggestions.
          </p>
          <div className="hero-buttons">
            <Link to="/dashboard" className="btn-dashboard">
              <Rocket size={20} />
              Launch Dashboard
            </Link>
            <div className="btn-group">
              <Link to="/login" className="btn-login">Sign In</Link>
              <Link to="/signup" className="btn-signup">Join for Free</Link>
            </div>
          </div>
        </div>
        <div className="hero-graphic">
          <div className="code-window">
            <div className="code-window-header">
              <div className="dots">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
              </div>
              <div className="title">ProblemSolver.js</div>
            </div>
            <pre className="code-content">
              <code>
                <span className="keyword">function</span> <span className="function">solveChallenge</span>(<span className="param">input</span>) {'{'}<br />
                {'  '}<span className="comment">// AI-generated problem</span><br />
                {'  '}<span className="keyword">const</span> result = input.split(<span className="string">''</span>).reverse().join(<span className="string">''</span>);<br />
                {'  '}<span className="keyword">return</span> result;<br />
                {'}'}<br /><br />
                <span className="comment">// Test your solution</span><br />
                console.log(solveChallenge(<span className="string">"hello"</span>));
              </code>
            </pre>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Why Developers Love AI Code Partner</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="card-icon"><Code /></div>
            <h3>AI-Generated Challenges</h3>
            <p>Get personalized coding problems based on your skill level and preferred languages.</p>
          </div>
          <div className="feature-card">
            <div className="card-icon"><Zap /></div>
            <h3>AI based Scores & Suggestions</h3>
            <p>Submit your solutions in our integrated environment and get instant, intelligent feedback.</p>
          </div>
          <div className="feature-card">
            <div className="card-icon"><BarChart /></div>
            <h3>Progress Analytics</h3>
            <p>Track your improvement with detailed statistics and performance metrics over time.</p>
          </div>
        </div>
      </section>

      {/* Languages Section */}
      <section className="languages-section">
        <h2 className="section-title">Languages We Support</h2>
        <div className="language-bubbles">
          {['Python', 'JavaScript', 'Java', 'C++', 'C#','PHP','GO','SQL','SWIFT'].map((lang) => (
            <div key={lang} className="language-bubble">{lang}</div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Ready to Elevate Your Coding Skills?</h2>
        <p>Join thousands of developers improving daily with AI Code Partner.</p>
        <Link to="/signup" className="btn-cta">
          Start Coding Now — It's Free!
        </Link>
      </section>
    </div>
  );
}