from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
from bson import ObjectId
from langchain_utils import generate_problem, generate_suggestions_foruser
import requests
from dotenv import load_dotenv
from pymongo import MongoClient
import os
from models import EmailRequest,Statistics,TestCase,ProblemRequest, Problem, CodeSubmission, User, UserIdRequest
from fastapi.middleware.cors import CORSMiddleware
import re
import json
import time

load_dotenv()
app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specify your frontend URL, e.g. ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---- MongoDB Setup ----
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
client = MongoClient(MONGO_URI)
db = client["codelab"]
problems_collection = db["problems"]
submissions_collection = db["submissions"]
users_collection = db["users"]
statistics_collection = db["statistics"]
languages_collection = db["languages"]




@app.get("/languages")
def get_languages():
    try:
        # Fetch all languages as a list of dicts, converting ObjectId to str
        languages = list(languages_collection.find())
        for lang in languages:
            lang["_id"] = str(lang["_id"])
        return languages
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/get-user-by-id")
def getUserById(userrequest: UserIdRequest):
    try:
        user = users_collection.find_one({'_id': ObjectId(userrequest.user_id)})
        if user:
            user["_id"] = str(user["_id"])
            return user
        raise HTTPException(status_code=404, detail="User not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/getuserbyemail")
def get_user_by_email(emailrequest: EmailRequest):
    try:
        user = users_collection.find_one({'email': emailrequest.email})
        if user:
            user["_id"] = str(user["_id"])
            myuser = User(**user)  # Convert to User model        
            return myuser
        raise HTTPException(status_code=404, detail="User not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
# ---- User Endpoints ----
@app.post("/generate-users")
def create_user(user: User):
    try:
        user_data = user.dict(by_alias=True)
        inserted = users_collection.insert_one(user_data)
        user_data["_id"] = str(inserted.inserted_id)
        return user_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/validate-user")
def validate_user(user: User):
    try:
        found_user = users_collection.find_one({
            "username": user.username,
            "password": user.password
        })

        if found_user:
            return {
                "message": "User validated successfully",
                "user_id": str(found_user["_id"])
            }
        else:
            raise HTTPException(status_code=404, detail="Invalid credentials")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def update_statistics(user_email: str, problem: Problem, passed: bool, language: str):
    """Update user statistics based on code submission results"""
    try:
        # Find stats by email
        stats = statistics_collection.find_one({"email": user_email})
        if not stats:
            raise HTTPException(status_code=404, detail="Statistics not found for user")
        
        difficulty = (problem.difficulty or "easy").lower()
        difficulty_key = {
            "easy": "easycount",
            "medium": "mediumcount",
            "hard": "difficultcount"  # Fixed: was "difficult"
        }.get(difficulty, "easycount")
        
        update_fields = {
            "$inc": {
                "total_submissions": 1,
            }
        }

        if passed:
            update_fields["$inc"]["problemsSolved"] = 1
            update_fields["$inc"][difficulty_key] = 1

        # Track language usage
        update_fields.setdefault("$inc", {}).setdefault(f"language_use.{language.upper()}", 1)

        statistics_collection.update_one(
            {"email": user_email},
            update_fields,
            upsert=True
        )

        # Recalculate accuracy and determine prominent language
        updated = statistics_collection.find_one({"email": user_email})
        if updated:
            total = updated.get("total_submissions", 1)
            solved = updated.get("problemsSolved", 0)
            accuracy = round((solved / total) * 100, 2)

            # Calculate prominent language
            language_usage = updated.get("language_use", {})
            prominent_language = "CPP"  # Default
            if language_usage:
                prominent_language = max(language_usage.keys(), key=lambda k: language_usage[k])

            # Update accuracy and prominent language (NO extra incrementing!)
            statistics_collection.update_one(
                {"email": user_email},
                {"$set": {
                    "accuracy": accuracy,
                    "prominentLanguage": prominent_language
                }}
            )
        
        return {"message": "Statistics updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating statistics: {str(e)}")

@app.post("/update-statistics")
def update_user_statistics(data: dict):
    """API endpoint to update user statistics"""
    try:
        user_email = data.get("user_email")
        problem_data = data.get("problem")
        passed = data.get("passed", False)
        language = data.get("language", "CPP")
        
        if not user_email or not problem_data:
            raise HTTPException(status_code=400, detail="Missing required fields")
        
        # Create Problem object from data
        problem = Problem(**problem_data)
        
        return update_statistics(user_email, problem, passed, language)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/create-statistics")
def create_statistics(emailrequest: EmailRequest):
    user = get_user_by_email(emailrequest)

    stats_data = Statistics(
        username=user.username,
        email=user.email,
        problemsSolved=0,
        mediumcount=0,
        easycount=0,
        difficultcount=0,
        accuracy=0.0,
        prominentLanguage="CPP"
    ).dict()
    # stats_data["email"] = user["email"] if user["email"] else None  # Link to user
    inserted = statistics_collection.insert_one(stats_data)
    return {"message": "Statistics created successfully", "stats_id": str(inserted.inserted_id)}

@app.post("/get-statistics")
def get_statistics(emailrequest: EmailRequest):
    try:
        stats = statistics_collection.find_one({"email": emailrequest.email})
        if not stats:
            raise HTTPException(status_code=404, detail="Statistics not found for this user")
        
        # Convert ObjectId to string for JSON serialization
        stats["_id"] = str(stats["_id"])
        statsobj = Statistics(
            username=stats.get("username", ""),
            email=stats.get("email", ""),
            problemsSolved=stats.get("problemsSolved", 0),
            mediumcount=stats.get("mediumcount", 0),
            easycount=stats.get("easycount", 0),
            difficultcount=stats.get("difficultcount", 0),
            accuracy=stats.get("accuracy", 0.0),
            prominentLanguage=stats.get("prominentLanguage", "CPP")
        )  # Convert to Statistics model
        
        return statsobj
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/get-enhanced-statistics")
def get_enhanced_statistics(emailrequest: EmailRequest):
    """
    Get comprehensive statistics with enhanced breakdowns
    """
    try:
        # Find user statistics by email
        stats = statistics_collection.find_one({"email": emailrequest.email})
        if not stats:
            # Return default stats structure if none exists
            return {
                "email": emailrequest.email,
                "total_submissions": 0,
                "problemsSolved": 0,
                "accuracy": 0.0,
                "prominentLanguage": "CPP",
                "easycount": 0,
                "mediumcount": 0,
                "difficultcount": 0,
                "language_use": {},
                "last_updated": time.time()
            }
        
        # Convert ObjectId to string for JSON serialization
        if "_id" in stats:
            stats["_id"] = str(stats["_id"])
        
        # Ensure all expected fields exist with defaults
        enhanced_stats = {
            "email": stats.get("email", emailrequest.email),
            "total_submissions": stats.get("total_submissions", 0),
            "problemsSolved": stats.get("problemsSolved", 0),
            "accuracy": stats.get("accuracy", 0.0),
            "prominentLanguage": stats.get("prominentLanguage", "CPP"),
            "easycount": stats.get("easycount", 0),
            "mediumcount": stats.get("mediumcount", 0),
            "difficultcount": stats.get("difficultcount", 0),
            "language_use": stats.get("language_use", {}),
            "last_updated": time.time()
        }
        
        return enhanced_stats
        
    except Exception as e:
        print(f"Error fetching enhanced statistics for {emailrequest.email}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching enhanced statistics: {str(e)}")

@app.post("/get-user-submissions")
def get_user_submissions(emailrequest: EmailRequest):
    """Get all submissions for a user by email"""
    try:
        # Get user by email first
        user = users_collection.find_one({"email": emailrequest.email})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        user_id = str(user["_id"])
        
        # Get all submissions for this user
        submissions = list(submissions_collection.find({"user_id": user_id}).sort("_id", -1))
        
        # Convert ObjectId to string and format response
        formatted_submissions = []
        for submission in submissions:
            # Extract date from ObjectId timestamp
            obj_id = submission["_id"]
            submission_date = obj_id.generation_time.isoformat() if hasattr(obj_id, 'generation_time') else None
            
            submission["_id"] = str(submission["_id"])
            formatted_submissions.append({
                "_id": submission["_id"],
                "problemTitle": submission.get("problemTitle", "Unknown Problem"),
                "language": submission.get("language", "Unknown"),
                "passed": submission.get("passed", False),
                "date": submission_date,
                "results": submission.get("results", [])
            })
        
        return {"submissions": formatted_submissions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
# ---- Generate Problem ----
@app.post("/generate-problem")
def get_problem(data: ProblemRequest):
    try:
        problem = generate_problem(data.language, data.difficulty, data.topic)
        problem_dict = problem.dict(by_alias=True)  # ✅ Convert to dict for MongoDB
        inserted = problems_collection.insert_one(problem_dict)
        prob = Problem(
            title = problem_dict.get("title",""),
            description=problem_dict.get("description",""),
            inputFormat = problem_dict.get("inputFormat",""),
            outputFormat = problem_dict.get("outputFormat",""),
            constraints = problem_dict.get("constraints",""),
            examples = problem_dict.get("examples",""),
            difficulty = problem_dict.get("difficulty",""), 
            tags = problem_dict.get("tags",""),
            topic = problem_dict.get("topic",""),
            testCases = problem_dict.get("testCases","")
        )
        problem_dict["_id"] = str(inserted.inserted_id)
        return problem_dict

        # problem_data = generate_problem(data.language, data.difficulty, data.topic)
        # if not isinstance(problem_data, dict):
        #     raise ValueError("generate_problem must return a dict")
        
        # # Remove the id field if it exists (since we'll generate a new ObjectId)
        # if "_id" in problem_data:
        #     del problem_data["_id"]
        # if "id" in problem_data:
        #     del problem_data["id"]
            
        # # Insert into database and get the generated ObjectId
        # inserted = problems_collection.insert_one(problem_data)
        # problem_data["_id"] = str(inserted.inserted_id)
        
        # print(f"Generated problem '{problem_data.get('title', 'Unknown')}' with {len(problem_data.get('testCases', []))} test cases")
        
        # return problem_data
    except Exception as e:
        print(f"Error in generate-problem endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))




@app.post("/submit-code")
def submit_code(submission: CodeSubmission):
    # PAIZA_URL = "https://api.paiza.io/runners/create"
    
    # headers = {
    #     "Content-Type": "application/json"
    # }

    language_map = {
        "CPP": "cpp",
        "JAVA": "java",
        "PYTHON": "python3",
        "JAVASCRIPT": "javascript",
        "C#": "csharp"
    }

    lang_name = language_map.get(submission.language.upper())
    if not lang_name:
        raise HTTPException(status_code=400, detail="Unsupported language")


    
    passed = False
    result = getsuggestions(submission)
    suggestion = result["suggestions"]
    print(result)
    print(type(result))
    score = suggestion.split("\n", 1)[0]
    # score =9
    if(int(score) >= 8):
        passed = True
        # Save failed submissions
    
    submission_record = {
                "user_id": submission.user_id,
                "language": submission.language,
                "code": submission.code,
                "input": submission.input,
                "problemTitle": submission.problem.title,
                "results": result,
                "passed": passed
        }
        
            
            # Update statistics for failed submission
    # if not passed:
    #     try:
    #         user = users_collection.find_one({'_id': ObjectId(submission.user_id)})
    #         if user and user.get('email'):
    #             update_statistics(user['email'], submission.problem, passed=False, language=submission.language)
    #     except Exception as e:
    #         print(f"Error updating statistics for failed submission: {e}")
            
            
           
            
    inserted = submissions_collection.insert_one(submission_record)
    submission_record["_id"] = str(inserted.inserted_id)


    return {"results": result, "passed": passed, "stats_updated": True}


@app.post("/getsuggestions")
def getsuggestions(submission: CodeSubmission):
    try:
        # Convert problem to a string representation for the suggestions function
        problem_text = f"Title: {submission.problem.title}\nDescription: {submission.problem.description}\nInput Format: {submission.problem.inputFormat}\nOutput Format: {submission.problem.outputFormat}"
        suggestions = generate_suggestions_foruser(submission.code, submission.language, problem_text)
        return {"suggestions": suggestions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

# ---- Info Endpoint for Frontend ----
@app.get("/info")
def get_info():
    port = os.getenv("PORT", "8000")
    return {"port": port}
