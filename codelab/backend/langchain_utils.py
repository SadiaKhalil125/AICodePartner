from langchain_openai import ChatOpenAI
from langchain_huggingface import HuggingFaceEndpoint, ChatHuggingFace
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser, PydanticOutputParser
from dotenv import load_dotenv
from pydantic import BaseModel, Field
from typing import List, Optional

load_dotenv()
llm = HuggingFaceEndpoint(
    repo_id="meta-llama/Llama-3.3-70B-Instruct",
    # repo_id="deepseek-ai/DeepSeek-R1",
    task="text-generation",
    temperature=0.9
)
# model = ChatOpenAI(model="gpt-4" ,temperature=1.4)
model = ChatHuggingFace(llm=llm)

# --------------------------
# 🎯 Pydantic Models
# --------------------------

class TestCase(BaseModel):
    input: str
    expectedOutput: str

class TestCaseList(BaseModel):
    testCases: List[TestCase]

class Problem(BaseModel):
    title: str
    description: str
    inputFormat: str
    outputFormat: str
    constraints: Optional[str] = ""
    examples: List[str] = Field(description="List of example strings: 'input -> expected output'")
    difficulty: str = Field(default="Easy")
    tags: List[str] = []
    topic: Optional[str] = None
    testCases: List[TestCase] = Field(description="List of test case objects with input and expectedOutput")
def generate_problem(language: str, difficulty: str, topic: str):
    problem_parser = PydanticOutputParser(pydantic_object=Problem)
    test_case_parser = PydanticOutputParser(pydantic_object=TestCaseList)

    # Prompt 1 - Problem
    prompt1 = PromptTemplate(
    template="""
You are a coding problem generator.

Create a problem in JSON format with the following structure:

{format_instruction}

Fill it with appropriate values based on the topic: "{topic}", language: "{language}", difficulty: "{difficulty}".

IMPORTANT: In the inputFormat field, be very specific about the input format. If arrays are involved, clearly specify whether the size should be provided first or not.

Examples of good inputFormat descriptions:
- "Single line containing n integers separated by spaces"
- "First line contains n, second line contains n space-separated integers"
- "Single string without spaces"

Do NOT include explanations, markdown, or comments. Output only valid JSON.
""",
    input_variables=["topic", "language", "difficulty"],
    partial_variables={"format_instruction": problem_parser.get_format_instructions()}
)


    # Prompt 2 - Test cases
    prompt2 = PromptTemplate(
        template="""You are an expert problem setter.

Based on the following problem, generate 10 test case objects.

CRITICAL INSTRUCTIONS for test case inputs:
1. Follow the inputFormat EXACTLY as specified in the problem
2. If the problem involves arrays and the inputFormat mentions providing size first, include the size
3. If the inputFormat doesn't mention size, don't include it
4. Be consistent across ALL test cases - use the same format for every test case
5. For competitive programming style problems with arrays, typically include the size first

Follow this format strictly:

{format_instruction}

Problem:
{problem}

Return JSON in this format: {{ "testCases": [{{"input": "...", "expectedOutput": "..."}}] }}

IMPORTANT: All test case inputs must follow the EXACT same format based on the problem's inputFormat specification.
No markdown or explanations.""",
        input_variables=["problem"],
        partial_variables={"format_instruction": test_case_parser.get_format_instructions()}
    )

    chain1 = prompt1 | model | problem_parser
    problem = chain1.invoke({
        "language": language,
        "difficulty": difficulty,
        "topic": topic
    })

    chain2 = prompt2 | model | test_case_parser
    test_case_result = chain2.invoke({
        "problem": problem.model_dump_json()
    })

    # Attach test cases
    problem.testCases = test_case_result.testCases

    return problem



def generate_suggestions_foruser(user_code: str, language: str, problem) -> str:
    """
    You are a coding expert and you have to provide suggestions on user's code,
    Tell him the use cases where his code fails, tell him about adding edge cases,
    or hint him of optimal solutions, and many more


    But keep in mind if user's code is already optimal return only "Perfect" without any other text
    in response
    """
   
    
    # Convert problem to string representation
    problem_str = str(problem) if hasattr(problem, 'model_dump_json') else str(problem)
    print(f"   Problem string length: {len(problem_str)} characters")
    
    # Create a detailed prompt for the LLM
    prompt = PromptTemplate(
        template="""
        You are an expert programming assistant.You have to provide suggestions on user's code,
        Tell him the use cases where his code fails, tell him about adding edge cases,
        or hint him of optimal solutions, and many more
        
        Do not be strict just tell if edge cases or optimal approach is not there

        If manual code than using libraries, it is still perfect

        Return score in first line out of 10 (be brutal) then suggestions from the second line 
        e.g 
        8
        //You have scored (score)... suggestions

Problem Details:
{problem}

User's Code (function only):
```{language}
{user_code}
```

""",
        input_variables=['user_code', 'language', 'problem', 'test_cases']
    )

    chain = prompt | model | StrOutputParser()
  
    print(f"🚀 Invoking LLM chain...")
    try:
        result = chain.invoke({
            "user_code": user_code,
            "language": language,
            "problem": problem_str,
            # "test_cases": test_cases_str
        })
        print(f"✅ LLM chain completed successfully!")
        print(f"   Generated code length: {len(result)} characters")
        return result
    except Exception as e:
        print(f"❌ LLM chain failed: {type(e).__name__}: {str(e)}")
        raise e
