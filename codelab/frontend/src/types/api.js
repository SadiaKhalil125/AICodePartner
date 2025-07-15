// API Type definitions and schemas for consistent frontend-backend communication

// ===== Problem Related Types =====
export const ProblemSchema = {
  id: null,
  title: '',
  description: '',
  inputFormat: '',
  outputFormat: '',
  constraints: '',
  examples: [],
  difficulty: 'easy', // easy, medium, hard
  tags: [],
  topic: '',
  testCases: []
};

export const TestCaseSchema = {
  input: '',
  expectedOutput: ''
};

// ===== Code Submission Types =====
export const CodeSubmissionSchema = {
  language: '',
  code: '',
  input: '',
  problem: ProblemSchema,
  user_id: ''
};

// ===== API Response Types =====
export const TestResultSchema = {
  testCase: 0,
  input: '',
  expected: '',
  actual: '',
  passed: false
};

export const RunCodeResponseSchema = {
  results: [],
  passed: false,
  failed: null // test case number that failed
};

export const SubmitCodeResponseSchema = {
  results: [],
  passed: false,
  failed: null
};

export const SuggestionsResponseSchema = {
  suggestions: ''
};

// ===== User Related Types =====
export const UserSchema = {
  id: null,
  username: '',
  email: '',
  password: ''
};

export const StatisticsSchema = {
  username: '',
  email: '',
  problemsSolved: 0,
  mediumcount: 0,
  easycount: 0,
  difficultcount: 0,
  accuracy: 0.0,
  prominentLanguage: ''
};

// ===== Request Types =====
export const ProblemRequestSchema = {
  language: '',
  difficulty: '',
  topic: ''
};

export const EmailRequestSchema = {
  email: ''
};

export const UserIdRequestSchema = {
  user_id: ''
};

// ===== Helper Functions =====
export const validateTestCase = (testCase) => {
  return testCase && 
         typeof testCase.input !== 'undefined' && 
         typeof testCase.expectedOutput !== 'undefined';
};

export const validateProblem = (problem) => {
  return problem && 
         problem.title && 
         problem.description && 
         Array.isArray(problem.testCases) && 
         problem.testCases.length > 0 &&
         problem.testCases.every(validateTestCase);
};

export const validateCodeSubmission = (submission) => {
  return submission && 
         submission.language && 
         submission.code && 
         submission.user_id && 
         validateProblem(submission.problem);
};

// ===== Data Transformation Helpers =====
export const formatTestResult = (testResult) => {
  return {
    id: testResult.testCase || 0,
    input: typeof testResult.input === 'object' ? JSON.stringify(testResult.input) : (testResult.input || 'No input'),
    expected: typeof testResult.expected === 'object' ? JSON.stringify(testResult.expected) : String(testResult.expected || 'No expected output'),
    actual: typeof testResult.actual === 'object' ? JSON.stringify(testResult.actual) : String(testResult.actual || 'No output'),
    passed: Boolean(testResult.passed)
  };
};

export const formatTestCase = (testCase) => {
  return {
    input: typeof testCase.input === 'object' ? JSON.stringify(testCase.input) : (testCase.input || 'No input'),
    expectedOutput: typeof testCase.expectedOutput === 'object' ? JSON.stringify(testCase.expectedOutput) : String(testCase.expectedOutput || '')
  };
};

export const formatProblemData = (problem) => {
  return {
    ...problem,
    testCases: problem.testCases ? problem.testCases.map(formatTestCase) : [],
    examples: Array.isArray(problem.examples) ? problem.examples : [problem.examples].filter(Boolean)
  };
};

// ===== Constants =====
export const SUPPORTED_LANGUAGES = ['CPP', 'JAVA', 'PYTHON', 'JAVASCRIPT', 'C#'];
export const DIFFICULTY_LEVELS = ['easy', 'medium', 'hard'];
export const DIFFICULTY_COLORS = {
  easy: '#48bb78',
  medium: '#ed8936',
  hard: '#f56565'
};

// ===== API Endpoints =====
export const API_ENDPOINTS = {
  // Problem endpoints
  GENERATE_PROBLEM: '/generate-problem',
  
  // Code execution endpoints
  RUN_CODE: '/run-code',
  SUBMIT_CODE: '/submit-code',
  GET_SUGGESTIONS: '/getsuggestions',
  
  // User endpoints
  CREATE_USER: '/generate-users',
  VALIDATE_USER: '/validate-user',
  GET_USER_BY_ID: '/get-user-by-id',
  GET_USER_BY_EMAIL: '/getuserbyemail',
  
  // Statistics endpoints
  CREATE_STATISTICS: '/create-statistics',
  GET_STATISTICS: '/get-statistics',
  UPDATE_STATISTICS: '/update-statistics',
  
  // Submissions endpoints
  GET_USER_SUBMISSIONS: '/get-user-submissions',
  
  // Language endpoints
  GET_LANGUAGES: '/languages',
  
  // Info endpoints
  GET_INFO: '/info'
}; 