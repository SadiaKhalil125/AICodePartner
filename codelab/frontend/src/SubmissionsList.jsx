import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { useNavigate } from 'react-router-dom';
import './SubmissionsList.css'; // Import the new stylesheet
import { ArrowLeft, CheckCircle, XCircle, List, BarChart2, Clock, Code } from 'lucide-react';

const API_BASE_URL = 'http://127.0.0.1:8000';

const SubmissionsList = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!user.email) {
      setError("User email not found");
      setLoading(false);
      return;
    }

    axios
      .post(`${API_BASE_URL}/get-user-submissions`, { email: user.email })
      .then((res) => {
        setSubmissions(res.data.submissions || []);
      })
      .catch((err) => {
        console.error('Error fetching submissions:', err);
        setError("Failed to fetch submissions. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user, navigate]);

  const summaryStats = React.useMemo(() => {
    if (submissions.length === 0) return null;
    const passedCount = submissions.filter(s => s.passed).length;
    const languageCounts = submissions.reduce((acc, sub) => {
      acc[sub.language] = (acc[sub.language] || 0) + 1;
      return acc;
    }, {});
    const mostUsedLang = Object.keys(languageCounts).reduce((a, b) => 
      languageCounts[a] > languageCounts[b] ? a : b, 'N/A'
    );
    return {
      total: submissions.length,
      passed: passedCount,
      failed: submissions.length - passedCount,
      successRate: Math.round((passedCount / submissions.length) * 100),
      mostUsedLang: mostUsedLang,
    };
  }, [submissions]);

  if (loading) return <div className="page-status-container">Loading your submissions...</div>;
  if (error) return <div className="page-status-container error">{error}</div>;

  return (
    <div className="submissions-page-container">
      <div className="submissions-list-container">
        <div className="submissions-header">
          <button className="back-button" onClick={() => navigate('/dashboard')}>
            <ArrowLeft size={18} /> Back to Dashboard
          </button>
          <h2 className="submissions-title">My Submissions</h2>
        </div>
        
        {submissions.length === 0 ? (
          <div className="no-submissions-message">
            <h3>No Submissions Yet!</h3>
            <p>Start solving problems on your dashboard to see your progress here.</p>
          </div>
        ) : (
          <>
            <div className="table-wrapper">
              <table className="submissions-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Problem</th>
                    <th>Language</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((sub, idx) => (
                    <tr key={sub._id || idx}>
                      <td data-label="#">{idx + 1}</td>
                      <td data-label="Problem" className="problem-title-cell">{sub.problemTitle}</td>
                      <td data-label="Language">
                        <span className="language-badge">{sub.language}</span>
                      </td>
                      <td data-label="Status">
                        {sub.passed ? (
                          <span className="status-badge status-passed"><CheckCircle size={14} /> Passed</span>
                        ) : (
                          <span className="status-badge status-failed"><XCircle size={14} /> Failed</span>
                        )}
                      </td>
                      <td data-label="Date">
                        {sub.date ? new Date(sub.date).toLocaleString() : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {summaryStats && (
                <div className="summary-stats-container">
                    <h3 className="summary-title">Performance Summary</h3>
                    <div className="stats-grid">
                        <div className="stat-item"><List size={20} /><div><strong>Total Submissions</strong><span>{summaryStats.total}</span></div></div>
                        <div className="stat-item"><CheckCircle size={20} /><div><strong>Passed</strong><span>{summaryStats.passed}</span></div></div>
                        <div className="stat-item"><XCircle size={20} /><div><strong>Failed</strong><span>{summaryStats.failed}</span></div></div>
                        <div className="stat-item"><BarChart2 size={20} /><div><strong>Success Rate</strong><span>{summaryStats.successRate}%</span></div></div>
                        <div className="stat-item"><Code size={20} /><div><strong>Top Language</strong><span>{summaryStats.mostUsedLang}</span></div></div>
                    </div>
                </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SubmissionsList;