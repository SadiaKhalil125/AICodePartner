from pydantic import BaseModel, Field
from typing import List, Optional
from bson import ObjectId

# ---- ObjectId Support ----
class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate
    
    @classmethod
    def validate(cls, v, info):  # Updated for Pydantic v2
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, core_schema, handler):
        # This tells Pydantic to treat ObjectId as a string in OpenAPI/JSON schema
        return {"type": "string"}

# ---- Data Models ----
class TestCase(BaseModel):
    input: str
    expectedOutput: str

class ProblemRequest(BaseModel):
    language: str
    difficulty: str
    topic:str

class Problem(BaseModel):
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    title: str
    description: str
    inputFormat: str
    outputFormat: str
    constraints: Optional[str] = ""
    examples: List[str] = Field(description="List of Example -> input, expected output")
    difficulty: str = Field(default="easy")
    tags: List[str] = []
    topic: Optional[str] = None
    testCases: List[TestCase] = Field(description="list of 10 test cases objects for the given problem {input, expectedOutput}")

    class Config:
        json_encoders = {ObjectId: str}
        validate_by_name = True
        populate_by_name = True

class CodeSubmission(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    language: str
    code: str
    input: str
    problem: Problem
    user_id: str 
    class Config:
        validate_by_name = True
        json_encoders = {ObjectId: str}
        arbitrary_types_allowed = True

class User(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    username: str
    email: str
    password: str  # In production, hash this!

    class Config:
        validate_by_name = True
        json_encoders = {ObjectId: str}
        arbitrary_types_allowed = True

class Statistics(BaseModel):
    username: str  # Username of the user
    email:str
    problemsSolved: int  # Total number of problems solved
    mediumcount: int  # Number of medium difficulty problems solved
    easycount: int  # Number of easy difficulty problems solved
    difficultcount: int  # Number of difficult problems solved
    accuracy: float  # Accuracy percentage of the user
    prominentLanguage: str = ""  # Most used programming language


class EmailRequest(BaseModel):
    email: str

class UserIdRequest(BaseModel):
    user_id: str = Field(..., alias="user_id")

    class Config:
        validate_by_name = True
        json_encoders = {ObjectId: str}
        arbitrary_types_allowed = True