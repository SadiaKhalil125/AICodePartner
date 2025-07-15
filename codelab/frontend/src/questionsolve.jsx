import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import axios from 'axios';
import './questionsolve.css';
import Problem from './models/problem';
import CodeSubmission from './models/codesubmission';
import { ArrowLeft, BrainCircuit, CheckCircle, XCircle } from 'lucide-react';
import Editor from '@monaco-editor/react'; // Import the Monaco Editor

const API_BASE_URL = 'http://127.0.0.1:8000';

// Helper to map your language names to Monaco's language identifiers
const mapLanguageToMonaco = (lang) => {
    switch (lang) {
        case 'CPP': return 'cpp';
        case 'JAVA': return 'java';
        case 'JAVASCRIPT': return 'javascript';
        case 'PYTHON': return 'python';
        case 'C#': return 'csharp';
        default: return 'plaintext';
    }
};

export default function QuestionSolve() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [code, setCode] = useState('');
    const [output, setOutput] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [testResults, setTestResults] = useState([]);
    const [activeTab, setActiveTab] = useState('description');
    const [suggestions, setSuggestions] = useState('');
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

    const { language, difficulty, topic, question } = location.state || {};

    useEffect(() => {
        if (!language || !difficulty || !topic || !question) {
            navigate('/dashboard');
        } else if (!user) {
            navigate('/login');
        } else {
            setCode(getDefaultTemplate(language));
        }
    }, [language, difficulty, question, topic, user, navigate]);

    const getDefaultTemplate = (lang) => {
        const templates = {
            'CPP': 'int solve(vector<int>& arr) {\n    // Your solution here\n    return 0;\n}',
            'JAVA': 'public int solve(int[] arr) {\n    // Your solution here\n    return 0;\n}',
            'JAVASCRIPT': 'function solve(arr) {\n    // Your solution here\n    return 0;\n}',
            'PYTHON': 'def solve(arr):\n    # Your solution here\n    return 0',
            'C#': 'public int Solve(int[] arr) {\n    // Your solution here\n    return 0;\n}'
        };
        return `// Just write your function - we'll handle the main() and I/O for you!\n\n${templates[lang] || '// Your code here'}`;
    };

    const handleSubmit = async () => {
        if (!code.trim()) {
            alert('Please write some code before submitting.');
            return;
        }

        const shouldSubmit = window.confirm('Are you sure you want to submit your final solution for this problem?');
        if (!shouldSubmit) return;

        setIsSubmitting(true);
        try {
            const problem = new Problem(null, question.title, question.description, question.inputFormat, question.outputFormat, question.constraints, question.examples, question.difficulty, question.tags, question.testCases, question.topic);
            const codeSubmission = new CodeSubmission(null, language, code, '', problem, user?.id);
            const response = await axios.post(`${API_BASE_URL}/submit-code`, codeSubmission);
            
            // Assuming `response.data.passed` is a boolean indicating overall success
            const passed = response.data.passed || (response.data.results && response.data.results.every(r => r.passed));

            if (response.data.results) {
                setTestResults(response.data.results);
                setActiveTab('results');
                await axios.post(`${API_BASE_URL}/update-statistics`, { user_email: user.email, problem: problem, passed: passed, language: language });
                alert('Your solution has been submitted successfully!');
                navigate('/dashboard');
            } else {
                alert('Code submitted but no test results were returned.');
            }
        } catch (error) {
            console.error('Error submitting code:', error);
            alert(`Error: ${error.response?.data?.detail || error.message || 'An unknown error occurred'}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGetSuggestions = async () => {
        if (!code.trim()) {
            alert('Please write some code to get suggestions.');
            return;
        }
        setIsLoadingSuggestions(true);
        try {
            const problem = new Problem(null, question.title, question.description, question.inputFormat, question.outputFormat, question.constraints, question.examples, question.difficulty, question.tags, question.testCases, question.topic);
            const codeSubmission = new CodeSubmission(null, language, code, '', problem, user?.id);
            const response = await axios.post(`${API_BASE_URL}/getsuggestions`, codeSubmission);
            setSuggestions(response.data.suggestions || 'No suggestions available.');
            setActiveTab('suggestions');
        } catch (error) {
            console.error('Error getting suggestions:', error);
            alert(`Error: ${error.response?.data?.detail || error.message || 'An unknown error occurred'}`);
        } finally {
            setIsLoadingSuggestions(false);
        }
    };

    const formatDisplayValue = (value) => {
        if (value === null || value === undefined) return 'N/A';
        if (typeof value === 'object') return JSON.stringify(value, null, 2);
        return String(value);
    };

    if (!question) {
        return <div className="loading-container">Loading Problem...</div>;
    }

    return (
        <div className="question-solve-container">
            <div className="question-solve-layout">
                {/* Left Panel */}
                <div className="problem-panel">
                    <div className="problem-panel-header">
                        <button className="back-btn" onClick={() => navigate('/dashboard')}>
                            <ArrowLeft size={18} /> Back to Dashboard
                        </button>
                        <h1 className="problem-title">{question.title || 'Programming Challenge'}</h1>
                        <div className="problem-meta">
                            <span className={`difficulty-badge difficulty-${difficulty}`}>{difficulty}</span>
                            <span className="topic-badge">{topic}</span>
                            <span className="language-badge">{language}</span>
                        </div>
                    </div>
                    <div className="tab-navigation">
                        {/* Tabs remain the same */}
                        <button className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`} onClick={() => setActiveTab('description')}>Description</button>
                        <button className={`tab-btn ${activeTab === 'testcases' ? 'active' : ''}`} onClick={() => setActiveTab('testcases')}>Test Cases</button>
                        {suggestions && <button className={`tab-btn ${activeTab === 'suggestions' ? 'active' : ''}`} onClick={() => setActiveTab('suggestions')}>AI Suggestions</button>}
                        {testResults.length > 0 && <button className={`tab-btn ${activeTab === 'results' ? 'active' : ''}`} onClick={() => setActiveTab('results')}>Results</button>}
                    </div>
                    <div className="tab-content">
                        {/* Tab content remains the same */}
                        {activeTab === 'description' && (
                            <div className="description-content">
                                <h3>Problem Statement</h3>
                                <p>{question.description}</p>
                                {question.inputFormat && <><h3>Input Format</h3><p>{question.inputFormat}</p></>}
                                {question.outputFormat && <><h3>Output Format</h3><p>{question.outputFormat}</p></>}
                                {question.constraints && <><h3>Constraints</h3><p>{question.constraints}</p></>}
                                <h3>Example</h3>
                                <div className="example-box">
                                    <pre>{formatDisplayValue(question.examples)}</pre>
                                </div>
                            </div>
                        )}
                        {activeTab === 'testcases' && (
                            <div className="testcases-content">
                                <h3>Public Test Cases</h3>
                                {Array.isArray(question.testCases) && question.testCases.length > 0 ? (
                                    <table className="testcases-table">
                                        <thead><tr><th>#</th><th>Input</th><th>Expected Output</th></tr></thead>
                                        <tbody>
                                            {question.testCases.map((tc, index) => (
                                                <tr key={index}><td>{index + 1}</td><td><pre>{formatDisplayValue(tc.input)}</pre></td><td><pre>{formatDisplayValue(tc.expectedOutput)}</pre></td></tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : <p>No public test cases available for this problem.</p>}
                            </div>
                        )}
                         {activeTab === 'suggestions' && (
                            <div className="suggestions-content">
                                <h3>AI Suggestions & Score</h3>
                                <div className="suggestions-box">
                                    <pre>{suggestions}</pre>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Panel - Code Editor */}
                <div className="editor-panel">
                    <div className="editor-wrapper">
                        <div className="editor-header">
                            <h3>Code Editor</h3>
                            <div className="editor-pro-tip">
                                <strong>💡 Pro Tip:</strong> Achieve a score of 8 or higher to pass the problem.
                            </div>
                        </div>
                        {/* Replace textarea with the Monaco Editor component */}
                        <div className="editor-container">
                            <Editor
                                height="100%"
                                language={mapLanguageToMonaco(language)}
                                value={code}
                                onChange={(newValue) => setCode(newValue || '')}
                                theme="vs-dark"
                                options={{
                                    minimap: { enabled: false },
                                    fontSize: 16,
                                    wordWrap: 'on',
                                    scrollBeyondLastLine: false,
                                    automaticLayout: true,
                                    tabSize: 4,
                                    insertSpaces: true,
                                }}
                            />
                        </div>
                        <div className="editor-footer">
                            <button className="suggestions-btn" onClick={handleGetSuggestions} disabled={isLoadingSuggestions || isSubmitting}>
                                <BrainCircuit size={16} />
                                {isLoadingSuggestions ? 'Analyzing...' : 'Get Score & Suggestions'}
                            </button>
                            <button className="submit-btn" onClick={handleSubmit} disabled={isSubmitting || isLoadingSuggestions}>
                                {isSubmitting ? 'Submitting...' : 'Submit Final Solution'}
                            </button>
                        </div>
                        {output && <div className="output-panel"><pre>{output}</pre></div>}
                    </div>
                </div>
            </div>
        </div>
    );
}






// import { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { useAuth } from './AuthContext';
// import axios from 'axios';
// import './questionsolve.css';
// import Problem from './models/problem';
// import CodeSubmission from './models/codesubmission';
// import { ArrowLeft, BrainCircuit, CheckCircle, XCircle } from 'lucide-react';

// const API_BASE_URL = 'http://127.0.0.1:8000';

// export default function QuestionSolve() {
//     const location = useLocation();
//     const navigate = useNavigate();
//     const { user } = useAuth();
//     const [code, setCode] = useState('');
//     const [output, setOutput] = useState('');
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [testResults, setTestResults] = useState([]);
//     const [activeTab, setActiveTab] = useState('description');
//     const [suggestions, setSuggestions] = useState('');
//     const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

//     const { language, difficulty, topic, question } = location.state || {};

//     useEffect(() => {
//         if (!language || !difficulty || !topic || !question) {
//             navigate('/dashboard');
//         } else if (!user) {
//             navigate('/login');
//         } else {
//             setCode(getDefaultTemplate(language));
//         }
//     }, [language, difficulty, question, topic, user, navigate]);

//     const getDefaultTemplate = (lang) => {
//         const templates = {
//             'CPP': 'int solve(vector<int>& arr) {\n    // Your solution here\n    return 0;\n}',
//             'JAVA': 'public int solve(int[] arr) {\n    // Your solution here\n    return 0;\n}',
//             'JAVASCRIPT': 'function solve(arr) {\n    // Your solution here\n    return 0;\n}',
//             'PYTHON': 'def solve(arr):\n    # Your solution here\n    return 0',
//             'C#': 'public int Solve(int[] arr) {\n    // Your solution here\n    return 0;\n}'
//         };
//         return `// Just write your function - we'll handle the main() and I/O for you!\n\n${templates[lang] || '// Your code here'}`;
//     };

//     const handleSubmit = async () => {
//         if (!code.trim()) {
//             alert('Please write some code before submitting.');
//             return;
//         }

//         const shouldSubmit = window.confirm('Are you sure you want to submit your final solution for this problem?');
//         if (!shouldSubmit) return;

//         setIsSubmitting(true);
//         try {
//             const problem = new Problem(null, question.title, question.description, question.inputFormat, question.outputFormat, question.constraints, question.examples, question.difficulty, question.tags, question.testCases, question.topic);
//             const codeSubmission = new CodeSubmission(null, language, code, '', problem, user?.id);
//             const response = await axios.post(`${API_BASE_URL}/submit-code`, codeSubmission);

//             if (response.data.results) {
//                 setTestResults(response.data.results);
//                 setActiveTab('results');
//                 await axios.post(`${API_BASE_URL}/update-statistics`, { user_email: user.email, problem: problem, passed: response.data.passed, language: language });
//                 alert('Your solution has been submitted successfully!');
//                 navigate('/dashboard');
//             } else {
//                 alert('Code submitted but no test results were returned.');
//             }
//         } catch (error) {
//             console.error('Error submitting code:', error);
//             alert(`Error: ${error.response?.data?.detail || error.message || 'An unknown error occurred'}`);
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     const handleGetSuggestions = async () => {
//         if (!code.trim()) {
//             alert('Please write some code to get suggestions.');
//             return;
//         }
//         setIsLoadingSuggestions(true);
//         try {
//             const problem = new Problem(null, question.title, question.description, question.inputFormat, question.outputFormat, question.constraints, question.examples, question.difficulty, question.tags, question.testCases, question.topic);
//             const codeSubmission = new CodeSubmission(null, language, code, '', problem, user?.id);
//             const response = await axios.post(`${API_BASE_URL}/getsuggestions`, codeSubmission);
//             setSuggestions(response.data.suggestions || 'No suggestions available.');
//             setActiveTab('suggestions');
//         } catch (error) {
//             console.error('Error getting suggestions:', error);
//             alert(`Error: ${error.response?.data?.detail || error.message || 'An unknown error occurred'}`);
//         } finally {
//             setIsLoadingSuggestions(false);
//         }
//     };

//     const formatDisplayValue = (value) => {
//         if (value === null || value === undefined) return 'N/A';
//         if (typeof value === 'object') return JSON.stringify(value, null, 2);
//         return String(value);
//     };

//     if (!question) {
//         return <div className="loading-container">Loading Problem...</div>;
//     }

//     return (
//         <div className="question-solve-container">
//             <div className="question-solve-layout">
//                 {/* Left Panel - Problem Description */}
//                 <div className="problem-panel">
//                     <div className="problem-panel-header">
//                         <button className="back-btn" onClick={() => navigate('/dashboard')}>
//                             <ArrowLeft size={18} /> Back to Dashboard
//                         </button>
//                         <h1 className="problem-title">{question.title || 'Programming Challenge'}</h1>
//                         <div className="problem-meta">
//                             <span className={`difficulty-badge difficulty-${difficulty}`}>{difficulty}</span>
//                             <span className="topic-badge">{topic}</span>
//                             <span className="language-badge">{language}</span>
//                         </div>
//                     </div>
//                     <div className="tab-navigation">
//                         <button className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`} onClick={() => setActiveTab('description')}>Description</button>
//                         <button className={`tab-btn ${activeTab === 'testcases' ? 'active' : ''}`} onClick={() => setActiveTab('testcases')}>Test Cases</button>
//                         {suggestions && <button className={`tab-btn ${activeTab === 'suggestions' ? 'active' : ''}`} onClick={() => setActiveTab('suggestions')}>AI Suggestions</button>}
//                         {testResults.length > 0 && <button className={`tab-btn ${activeTab === 'results' ? 'active' : ''}`} onClick={() => setActiveTab('results')}>Results</button>}
//                     </div>

//                     <div className="tab-content">
//                         {activeTab === 'description' && (
//                             <div className="description-content">
//                                 <h3>Problem Statement</h3>
//                                 <p>{question.description}</p>
//                                 {question.inputFormat && <><h3>Input Format</h3><p>{question.inputFormat}</p></>}
//                                 {question.outputFormat && <><h3>Output Format</h3><p>{question.outputFormat}</p></>}
//                                 {question.constraints && <><h3>Constraints</h3><p>{question.constraints}</p></>}
//                                 <h3>Example</h3>
//                                 <div className="example-box">
//                                     <pre>{formatDisplayValue(question.examples)}</pre>
//                                 </div>
//                             </div>
//                         )}
//                         {activeTab === 'testcases' && (
//                             <div className="testcases-content">
//                                 <h3>Public Test Cases</h3>
//                                 {Array.isArray(question.testCases) && question.testCases.length > 0 ? (
//                                     <table className="testcases-table">
//                                         <thead><tr><th>#</th><th>Input</th><th>Expected Output</th></tr></thead>
//                                         <tbody>
//                                             {question.testCases.map((tc, index) => (
//                                                 <tr key={index}><td>{index + 1}</td><td><pre>{formatDisplayValue(tc.input)}</pre></td><td><pre>{formatDisplayValue(tc.expectedOutput)}</pre></td></tr>
//                                             ))}
//                                         </tbody>
//                                     </table>
//                                 ) : <p>No public test cases available for this problem.</p>}
//                             </div>
//                         )}
//                         {activeTab === 'suggestions' && (
//                             <div className="suggestions-content">
//                                 <h3>AI Suggestions & Score</h3>
//                                 <div className="suggestions-box">
//                                     <pre>{suggestions}</pre>
//                                 </div>
//                             </div>
//                         )}
                        
//                     </div>
//                 </div>

//                 {/* Right Panel - Code Editor */}
//                 <div className="editor-panel">
//                     <div className="editor-wrapper">
//                         <div className="editor-header">
//                             <h3>Code Editor</h3>
//                             <div className="editor-pro-tip">
//                                 <strong>💡 Pro Tip:</strong> Achieve a score of 8 or higher to pass the problem.
//                             </div>
//                         </div>
//                         <textarea className="code-editor" value={code} onChange={(e) => setCode(e.target.value)} spellCheck="false" />
//                         <div className="editor-footer">
//                             <button className="suggestions-btn" onClick={handleGetSuggestions} disabled={isLoadingSuggestions || isSubmitting}>
//                                 <BrainCircuit size={16} />
//                                 {isLoadingSuggestions ? 'Analyzing...' : 'Get Score & Suggestions'}
//                             </button>
//                             <button className="submit-btn" onClick={handleSubmit} disabled={isSubmitting || isLoadingSuggestions}>
//                                 {isSubmitting ? 'Submitting...' : 'Submit Final Solution'}
//                             </button>
//                         </div>
//                         {output && <div className="output-panel"><pre>{output}</pre></div>}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }