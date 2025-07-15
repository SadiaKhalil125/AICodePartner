# 🚀 AI Code Partner

**AI Code Partner** is a modern, full-stack web application designed to help developers enhance their coding skills through AI-generated challenges, real-time feedback, and comprehensive performance analytics. This platform offers an interactive and dynamic learning experience, moving beyond static problem lists to provide tailored challenges on demand.

Full Video Demo:  https://www.loom.com/share/5ccee1bcc0274107871d02170b6bdb4b?sid=687a375f-ab34-4dd8-918f-87de5c7eb29c

<img width="1366" height="768" alt="Screenshot (1156)" src="https://github.com/user-attachments/assets/f7ca6eb6-9436-4c8a-a530-59d8d60b8a2d" />
<img width="1366" height="768" alt="Screenshot (1157)" src="https://github.com/user-attachments/assets/caec054d-97ce-47aa-8974-03516e9c1853" />
<img width="1366" height="768" alt="Screenshot (1158)" src="https://github.com/user-attachments/assets/57f8a304-c77b-4f38-aa08-1e9d792e4ebe" />
<img width="1366" height="768" alt="Screenshot (1161)" src="https://github.com/user-attachments/assets/ca22c268-4c12-4b80-9d8a-f49a4376229d" />
<img width="1366" height="768" alt="Screenshot (1162)" src="https://github.com/user-attachments/assets/d71a12ef-a1ed-4744-8c29-85c2cf4a2859" />
<img width="1366" height="768" alt="Screenshot (1164)" src="https://github.com/user-attachments/assets/7fc718f4-22c8-422d-8e25-57641f5d838b" />
<img width="1366" height="768" alt="Screenshot (1165)" src="https://github.com/user-attachments/assets/33c852d2-1d6d-47c2-89b8-698d23df872f" />
<img width="1366" height="768" alt="Screenshot (1166)" src="https://github.com/user-attachments/assets/8ddc9642-6805-4b86-8a2a-7801e3afb2cd" />
<img width="1366" height="768" alt="Screenshot (1167)" src="https://github.com/user-attachments/assets/1b1ab5d8-eea7-4651-9722-cce26c6eccec" />
<img width="1366" height="768" alt="Screenshot (1168)" src="https://github.com/user-attachments/assets/f151d0a4-ea3c-419d-8fb8-f52259e8c2dc" />
<img width="1366" height="768" alt="Screenshot (1169)" src="https://github.com/user-attachments/assets/ec34c627-d64a-4fe8-9bdc-27a668a1a260" />
<img width="1366" height="768" alt="Screenshot (1170)" src="https://github.com/user-attachments/assets/7c377601-149d-47c0-93fc-4676abdf78b0" />

## ✨ Key Features

- **Dynamic Problem Generation**: Leverages AI to create unique coding problems based on user-selected criteria, including **language**, **difficulty** (Easy, Medium, Hard), and **topic** (e.g., Arrays, Graphs, DP).
- **Professional Code Editor**: Integrates the **Monaco Editor** (the engine behind VS Code) for a rich, familiar coding experience with syntax highlighting and intelligent suggestions.
- **AI-Powered Feedback & Scoring**: Users can submit their code to an AI service that provides a score (out of 10) and constructive suggestions for improvement, helping them understand their mistakes and learn best practices.
- **Secure User Authentication**: A complete authentication system with JWT for user registration and login, ensuring all user data and submissions are secure.
- **Personalized User Dashboard**: A comprehensive dashboard that visualizes a user's progress, including statistics on problems solved, accuracy rates, and a breakdown by difficulty.
- **Submission History**: Users can view a complete history of their past submissions, including the problem, language, and pass/fail status.
- **Modern, Responsive UI**: A sleek and intuitive user interface built with React, ensuring a seamless experience across all devices, from desktops to mobile phones.

## 🛠️ Tech Stack

This project is a full-stack application built with a modern and robust technology stack:

- **Frontend**:
  - **React.js**: A declarative, component-based library for building user interfaces.
  - **React Router**: For client-side routing and navigation between pages.
  - **Axios**: For making HTTP requests to the backend API.
  - **Monaco Editor React**: To integrate the professional VS Code editor.
  - **Lucide React**: For a lightweight and beautiful icon set.

- **Backend**:
  - **FastAPI (Python)**: A high-performance, modern web framework for building APIs with Python 3.7+ based on standard Python type hints.
  - **Pydantic**: For data validation and settings management.
  - **JWT (JSON Web Tokens)**: For secure user authentication.

- **Database**:
  - **MongoDB**: A NoSQL, document-oriented database used for storing user data, problems, and submissions.

- **AI Integration**:
  - The backend is using Langchain to communicate with hugging face open source meta-llama/Llama-3.3-70B-Instruct model to generate problems and code suggestions.

## ⚙️ Setup and Installation

To run this project locally, you will need to have Node.js, Python, and MongoDB installed. Follow these steps:

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/AICodePartner.git
cd AICodePartner

Frontend Setup

cd frontend
npm install
npm start

Backend Setup

cd backend
python -m venv venv
source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
pip install -r requirements.txt
uvicorn main:app --reload```

The FastAPI server will be running on `http://localhost:8000`.

### 4. Environment Variables
MONGO_DETAILS="your_mongodb_connection_string"
SECRET_KEY="your_jwt_secret_key"
ALGORITHM="HS256"
AI_API_KEY="your_ai_service_api_key"


## 🚀 Usage

1.  **Sign Up / Login**: Create a new account or log in with existing credentials.
2.  **Dashboard**: After logging in, you'll be directed to your personal dashboard.
3.  **Generate a Problem**: Select your desired programming language, difficulty level, and topic. Click "Generate Problem" to receive a unique challenge.
4.  **Solve the Problem**: You will be redirected to the problem-solving page, where you can write your code in the professional Monaco Editor.
5.  **Get Feedback**: Click "Get Score & Suggestions" to have the AI analyze your code and provide feedback.
6.  **Submit Your Solution**: Once you are confident in your solution, submit it for final validation.
7.  **Track Your Progress**: Return to your dashboard at any time to see your updated statistics and view your submission history.
