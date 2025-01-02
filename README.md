# PDF Question Answering System

A full-stack application that enables users to upload PDF documents and ask questions about their content using RAG (Retrieval Augmented Generation) with Google's Gemini model.

## Features

- PDF document upload and management
- Document-based question answering using RAG
- Real-time chat interface
- Vector similarity search using FAISS
- Integration with Google's Gemini model
- Responsive web interface built with React
- FastAPI backend with SQLite database

## Tech Stack

### Backend
- FastAPI
- SQLAlchemy
- LangChain
- FAISS Vector Store
- Google Vertex AI (Gemini)
- HuggingFace Embeddings
- PyPDF Loader

### Frontend
- React
- Axios
- Tailwind CSS
- Lucide Icons

## Installation

1. Clone the repository:
```bash
git clone [[repository-url]](https://github.com/Santhoshcv19/AI_Planet-Chat-With-PDF.git)
cd AI_Planet-Chat-With-PDF
```

2. Install backend dependencies:
```bash
pip install fastapi uvicorn sqlalchemy langchain google-cloud-aiplatform pyngrok nest-asyncio
```

3. Install frontend dependencies:
```bash
cd frontend/pdf-chat
npm install
```

4. Set up Google Cloud credentials:
- Create a service account and download the JSON key
- Place the key in the project root as `YOUR_SERVICE_KEY.JSON`
- Update the project ID in `main.py`

## Usage

1. Start the backend server:
```bash
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

2. When the server starts, it will generate a ngrok URL. Copy this URL.

3. Update the frontend API configuration:
   - Open `src/App.js`
   - Replace the existing ngrok URL in these functions:
     - `fetchDocuments`
     - `handleFileUpload`
     - `handleQuestionSubmit`
   - Example: Replace `https://b681-34-148-230-12.ngrok-free.app` with your new ngrok URL

4. Start the frontend development server:
```bash
cd frontend/pdf-chat
npm start
```

5. Access the application through your local development server (typically http://localhost:3000)


## Architecture

The system uses a RAG (Retrieval Augmented Generation) architecture:
1. PDF documents are processed and split into chunks
2. Text chunks are embedded using HuggingFace embeddings
3. Embeddings are stored in a FAISS vector store
4. User questions trigger similarity search in the vector store
5. Retrieved context is sent to Gemini model for answer generation

## Future Work

1. **Enterprise Scaling with Pinecone**
   - Replace FAISS with Pinecone vector database for:
     - Distributed vector search across multiple servers
     - Handling millions of documents efficiently
     - Real-time index updates
     - Better scalability in production environments

2. **Enhanced Document Processing**
   - Support for multiple file formats (DOCX, TXT, etc.)
   - OCR integration for scanned documents
   - Table and image extraction capabilities
   - Document metadata indexing

3. **Advanced RAG Features**
   - Hybrid search combining sparse and dense retrievers
   - Multi-modal RAG for images and text
   - Query reformulation for better context retrieval
   - Answer validation and fact-checking

4. **Security Enhancements**
   - Document-level access control
   - Encryption at rest and in transit
   - Audit logging for compliance
   - User authentication and authorization

5. **Performance Optimizations**
   - Caching frequently asked questions
   - Batch processing for document uploads
   - Async document processing
   - Query result pagination

6. **UI/UX Improvements**
   - Document preview functionality
   - Advanced search filters
   - Answer citations and sources
   - Export conversation history
   - Mobile-responsive design improvements
