from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import json
import os
import dotenv
import re
from googlesearch import search
import requests
from bs4 import BeautifulSoup
from PyPDF2 import PdfReader

# New LangChain RAG Imports
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains import create_retrieval_chain
from langchain_core.documents import Document

dotenv.load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Configure Google API key
api_key = os.getenv("GEMINI_API_KEY")
print(f"Using API key: {api_key[:5]}...")
genai.configure(api_key=api_key)

# Initialize Gemini models
question_ai = genai.GenerativeModel("gemini-2.0-flash")
summary_ai = genai.GenerativeModel("gemini-2.0-flash")
career_ai = genai.GenerativeModel("gemini-2.0-flash")

# ============================================
# LangChain RAG Setup
# ============================================

rag_chain = None

def setup_rag_chain():
    global rag_chain
    print("Setting up RAG chain...")
    try:
        # Load the PDF document
        loader = PyPDFLoader("Career-List.pdf")
        docs = loader.load()

        # Split documents into chunks
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        chunks = text_splitter.split_documents(docs)

        # Create embeddings and vector store
        # Old code (causes the error)
        # embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

        # Corrected code (Explicitly pass your API key)
        embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=api_key)
        vector_store = FAISS.from_documents(chunks, embeddings)
        
        # Create a retriever for searching the vector store
        retriever = vector_store.as_retriever()
        
        # Define the prompt for the AI
        prompt_template = ChatPromptTemplate.from_template("""
        Based on the following analysis of a person's profile:
        {input}
        
        Recommend 5 best-matching careers. Extract these recommendations ONLY from the provided context.
        If no relevant careers are found in the context, state that.
        
        Context: {context}
        
        Output your response as a JSON array in the exact format:
        [
            {{
                "title": "Career Title from PDF",
                "match": match_percentage,
                "description": "Why this career from the PDF matches the person's profile"
            }}
        ]
        
        Each match_percentage should be a guess between 75-100.
        """)
        
        # Build the RAG chain that connects the retriever to the LLM
        # llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0.3)
        llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0.3, google_api_key=api_key)
        document_chain = create_stuff_documents_chain(llm, prompt_template)
        rag_chain = create_retrieval_chain(retriever, document_chain)
        
        print("RAG chain setup complete.")
    except Exception as e:
        print(f"Error setting up RAG chain: {e}")
        rag_chain = None

# ============================================
# API Endpoints
# ============================================

def extract_json_from_text(text):
    """Extract JSON from text that might contain markdown or other content"""
    json_match = re.search(r'\{[\s\S]*\}', text)
    if json_match:
        try:
            return json.loads(json_match.group())
        except:
            return None
    return None

@app.route('/generate-question', methods=['POST'])
def generate_question():
    try:
        data = request.json
        previous_qa = data.get('previousQA', [])
        
        print("\n=== Generating New Question ===")
        print(f"Received {len(previous_qa)} previous Q&As:")
        
        qa_history = "\n".join([
            f"Question {i+1}: {qa['question']}\nAnswer: {qa['answer']}"
            for i, qa in enumerate(previous_qa)
        ])
        
        print("\nGenerating new question...")
        
        prompt = f"""Based on these previous responses:
{qa_history}
Generate ONE new career-focused multiple-choice question.
IMPORTANT: Your response must be ONLY a JSON object in this exact format:
{{
    "question": "Your question text here",
    "options": ["Option 1", "Option 2", "Option 3", "Option 4"]
}}
Requirements:
1. Question must be unique and different from previous ones
2. Build upon previous answers to explore deeper insights
3. Focus on career-relevant traits, skills, or preferences
4. Options must be distinct and career-relevant
5. Do not include any additional text or explanations
6. Return ONLY the JSON object"""

        response = question_ai.generate_content(prompt)
        response_text = response.text.strip()
        
        try:
            question_data = json.loads(response_text)
        except json.JSONDecodeError:
            question_data = extract_json_from_text(response_text)
            if not question_data:
                raise ValueError("Failed to generate valid question format")

        if not isinstance(question_data, dict) or \
           'question' not in question_data or \
           'options' not in question_data or \
           not isinstance(question_data['options'], list) or \
           len(question_data['options']) != 4:
            raise ValueError("Invalid question format")

        print("\nGenerated Question:")
        print(f"Question: {question_data['question']}")
        print(f"Options: {question_data['options']}")
        print("=== Generation Complete ===\n")

        return jsonify({"question": question_data})

    except Exception as e:
        print(f"\nError generating question: {str(e)}")
        error_message = str(e) if str(e) else "Failed to generate question"
        return jsonify({"error": error_message}), 500

@app.route('/analyze-answers', methods=['POST'])
def analyze_answers():
    try:
        data = request.json
        all_answers = data.get('answers', [])

        # Step 1: Generate detailed analysis with the first AI
        analysis_prompt = f"""Analyze these career-related responses:
        {json.dumps(all_answers, indent=2)}
        
        Provide a detailed analysis of the person's:
        1. Key strengths
        2. Work preferences
        3. Personality traits
        4. Skill inclinations
        5. Career goals
        6. Education and training
        7. Work experience
        8. Hobbies and interests
        9. Values and priorities
        10. Personal development
        11. Career aspirations
        12. Life goals
        13. Work-life balance
        14. Stress tolerance
        15. Adaptability
        16. Leadership potential
        17. Teamwork skills
        18. Communication skills
        19. Conflict resolution
        20. Problem-solving
        21. Decision-making
        22. Creativity
        23. Innovation
        24. Time management
        25. Work-related stress
        26. Work-related anxiety
        27. Work-related depression
        28. Work-related burnout
        29. Work-related motivation
        30. Work-related satisfaction
        """
        analysis_response = summary_ai.generate_content(analysis_prompt)
        detailed_analysis = analysis_response.text

        # Step 2: Use the RAG chain for PDF-based career recommendations
        pdf_careers = []
        if rag_chain:
            print("Using RAG chain for PDF-based careers...")
            rag_response = rag_chain.invoke({"input": detailed_analysis})
            rag_careers_text = rag_response['answer'].strip()
            
            try:
                cleaned_rag_response = rag_careers_text
                if cleaned_rag_response.startswith("```json"):
                    cleaned_rag_response = cleaned_rag_response[7:]
                if cleaned_rag_response.endswith("```"):
                    cleaned_rag_response = cleaned_rag_response[:-3]
                
                pdf_careers = json.loads(cleaned_rag_response)
            except json.JSONDecodeError as e:
                print(f"Failed to parse RAG response JSON: {e}")
                print(f"Raw response: {rag_careers_text}")
        else:
            print("RAG chain not available. Skipping PDF analysis.")

        # Step 3: Generate AI-based recommendations with the second AI
        career_prompt = f"""Based on this analysis:
        {detailed_analysis}
        
        Recommend 5 best-matching careers. Format as JSON array:
        [
            {{
                "title": "Career Title",
                "match": match_percentage,
                "description": "Why this career matches",
                "roadmap": [
                    "Entry Level: Required skills and certifications",
                    "Mid Level: Advanced skills and experience",
                    "Senior Level: Expert knowledge and leadership"
                ],
                "colleges": [
                    {{
                        "name": "College/University Name",
                        "program": "Relevant Program",
                        "duration": "Program Duration",
                        "location": "Location"
                    }}
                ]
            }}
        ]
        Include 3-4 top colleges/universities for each career.
        Each match_percentage should be between 75-100.
        """
        career_response = career_ai.generate_content(career_prompt)
        cleaned_text = career_response.text.strip()
        if cleaned_text.startswith("```json"):
            cleaned_text = cleaned_text[7:]
        if cleaned_text.endswith("```"):
            cleaned_text = cleaned_text[:-3]
        careers = json.loads(cleaned_text)

        return jsonify({
            "ai_generated_careers": careers,
            "pdf_based_careers": pdf_careers
        })

    except Exception as e:
        print(f"Error in analysis: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/test-api', methods=['GET'])
def test_api():
    try:
        response = question_ai.generate_content("Hello, are you working?")
        return jsonify({"status": "ok", "response": response.text})
    except Exception as e:
        print(f"API test error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/list-models', methods=['GET'])
def list_models():
    try:
        models = genai.list_models()
        available_models = [model.name for model in models]
        return jsonify({"available_models": available_models})
    except Exception as e:
        print(f"Error listing models: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/web-search', methods=['POST'])
def web_search():
    try:
        data = request.json
        careers = data.get('careers', [])

        search_terms = []
        for career in careers[:2]:
            search_terms.extend([
                career['title'],
                career.get('description', '').split('.')[0]
            ])

        search_query = f"alternative careers similar to {' '.join(search_terms)} career path requirements skills"

        search_results = []
        for result in search(search_query, num_results=5):
            try:
                response = requests.get(result, timeout=5)
                soup = BeautifulSoup(response.text, 'html.parser')
                
                title = soup.title.string if soup.title else "Career Option"
                description = soup.find('meta', {'name': 'description'})
                description = description['content'] if description else "No description available"

                relevance = calculate_relevance(
                    title + " " + description,
                    [career['title'] for career in careers]
                )

                if relevance > 70:
                    search_results.append({
                        'title': clean_title(title),
                        'description': clean_description(description),
                        'link': result,
                        'relevance': relevance
                    })
            except Exception as e:
                print(f"Error processing search result: {str(e)}")
                continue

        return jsonify({
            'results': sorted(search_results, key=lambda x: x['relevance'], reverse=True)
        })

    except Exception as e:
        print(f"Web search error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/search-web-careers', methods=['POST'])
def search_web_careers():
    try:
        data = request.json
        analysis = data.get('analysis', '')

        key_terms = extract_key_terms(analysis)
        
        search_query = f"career paths for people with skills in {key_terms} job requirements and description"

        careers_found = []
        
        for url in search(search_query, num_results=8):
            try:
                response = requests.get(url, timeout=5)
                soup = BeautifulSoup(response.text, 'html.parser')
                
                career_info = extract_career_info(soup, analysis)
                
                if career_info and career_info['matchScore'] > 60:
                    careers_found.append(career_info)
                    
            except Exception as e:
                print(f"Error processing result: {str(e)}")
                continue

        careers_found.sort(key=lambda x: x['matchScore'], reverse=True)
        return jsonify({'careers': careers_found[:5]})

    except Exception as e:
        print(f"Web career search error: {str(e)}")
        return jsonify({'error': str(e)}), 500

def calculate_relevance(text, career_titles):
    """Calculate relevance score based on keyword matching"""
    text = text.lower()
    score = 0
    
    keywords = set()
    for title in career_titles:
        keywords.update(title.lower().split())
        
    for keyword in keywords:
        if keyword in text:
            score += 20
            
    return min(98, max(70, score))

def clean_title(title):
    """Clean and format the title"""
    if not title:
        return "Career Option"
    return title[:100].strip()

def clean_description(description):
    """Clean and format the description"""
    if not description:
        return "No description available"
    return description[:200].strip() + "..."

def extract_key_terms(analysis):
    """Extract key terms from analysis text"""
    common_words = {'and', 'or', 'the', 'in', 'on', 'at', 'to', 'for', 'of', 'with'}
    words = analysis.lower().split()
    key_terms = [word for word in words if word not in common_words]
    return ' '.join(key_terms[:10])

def extract_career_info(soup, analysis):
    """Extract career information from webpage"""
    try:
        title = soup.find('h1')
        if not title:
            title = soup.find('title')
        title = title.text.strip() if title else "Career Option"
        
        description = soup.find('meta', {'name': 'description'})
        if description:
            description = description['content']
        else:
            description = soup.find('p')
            description = description.text if description else "No description available"
        
        skills = []
        skill_sections = soup.find_all(['ul', 'ol'], string=re.compile('skill', re.I))
        for section in skill_sections[:1]:
            skills.extend([li.text.strip() for li in section.find_all('li')][:5])
        
        match_score = calculate_match_score(title + " " + description, analysis)
        
        return {
            'title': clean_text(title, 100),
            'description': clean_text(description, 200),
            'keySkills': skills if skills else None,
            'matchScore': match_score,
            'sourceLink': soup.url
        }
    except Exception as e:
        print(f"Error extracting career info: {str(e)}")
        return None

def calculate_match_score(text, analysis):
    """Calculate match score between text and analysis"""
    text = text.lower()
    analysis = analysis.lower()
    
    analysis_terms = set(analysis.split())
    
    matches = sum(1 for term in analysis_terms if term in text)
    
    score = 60 + (matches * 35 / len(analysis_terms))
    return min(95, max(60, round(score)))

def clean_text(text, max_length):
    """Clean and truncate text"""
    text = re.sub(r'\s+', ' ', text).strip()
    if len(text) > max_length:
        text = text[:max_length] + "..."
    return text

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        message = data.get('message')
        chat_history = data.get('chatHistory', [])

        context = "\n".join([f"{msg['role']}: {msg['content']}" for msg in chat_history])
        
        prompt = f"""You are a helpful career guidance assistant. Continue this conversation:
        {context}
        user: {message}
        assistant:"""
        
        response = question_ai.generate_content(prompt)
        
        return jsonify({
            "status": "success",
            "response": response.text
        })
        
    except Exception as e:
        print(f"Chat error: {str(e)}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

if __name__ == '__main__':
    setup_rag_chain()
    try:
        print("Starting Flask server on port 5002...")
        app.run(debug=True, port=5002, host='0.0.0.0')
    except Exception as e:
        print(f"Error starting Flask server: {str(e)}")