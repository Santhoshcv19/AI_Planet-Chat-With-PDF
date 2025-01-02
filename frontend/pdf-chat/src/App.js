import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import axios from 'axios';
import logo from './images/logo1.jpg';

const TypingAnimation = () => (
  <div className="flex space-x-2 p-2">
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
  </div>
);

const App = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState({ id: 1, filename: 'demo.pdf' });
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get(
        "https://b681-34-148-230-12.ngrok-free.app/documents/",
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        }
      );
      setDocuments(response.data);
      if (response.data.length > 0 && !selectedDoc) {
        setSelectedDoc(response.data[0]);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await axios.post(
          "https://b681-34-148-230-12.ngrok-free.app/upload/",
          formData
        );
        alert("File uploaded successfully!");
        await fetchDocuments();
      } catch (error) {
        console.error("Error uploading file:", error);
        alert("Failed to upload file.");
      }
    }
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    
    if (!question.trim() || !selectedDoc) return;

    setMessages(prev => [...prev, {
      type: 'user',
      content: question
    }]);
    
    setQuestion('');
    setIsTyping(true);

    try {
      const response = await axios.post(
        "https://b681-34-148-230-12.ngrok-free.app/question/",
        {
          document_id: selectedDoc.id,
          question: question,
        }
      );
      
      setMessages(prev => [...prev, {
        type: 'ai',
        content: response.data.answer
      }]);
    } catch (error) {
      console.error("Error processing question:", error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="flex items-center p-4 border-b">
        <div className="flex-shrink-0">
          <img src={logo} alt="Planet Logo" className="h-8" onError={(e) => {
      console.error('Image failed to load');
      console.log('Image src:', e.target.src);
    }}/>
        </div>
        <div className="flex items-center ml-auto relative">
          {/* PDF Selection Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center px-4 py-2 border rounded-md hover:bg-gray-50"
            >
              <img src="/images/pdf-icon.png" alt="PDF Icon" className="h-5 w-5 mr-2" />
              <span className="text-gray-600">
                {selectedDoc ? selectedDoc.filename : 'Select a document'}
              </span>
            </button>
            
            {isDropdownOpen && documents.length > 0 && (
              <div className="absolute top-full mt-1 w-64 bg-white border rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                {documents.map((doc) => (
                  <button
                    key={doc.id}
                    className={`w-full px-4 py-2 text-left hover:bg-gray-50 ${
                      selectedDoc && selectedDoc.id === doc.id ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => {
                      setSelectedDoc(doc);
                      setIsDropdownOpen(false);
                      setMessages([]);
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <span>{doc.filename}</span>
                      <span className="text-gray-400 text-sm">ID: {doc.id}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Upload Button */}
          <label className="ml-4 px-4 py-2 text-gray-600 rounded-md border cursor-pointer hover:bg-gray-50">
            Upload PDF
            <input
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            {selectedDoc ? 
              `Selected document: ${selectedDoc.filename} (ID: ${selectedDoc.id}). Ask a question about this document.` : 
              'Please select a document to begin.'}
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <div key={index} className={`flex mb-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-start max-w-3xl ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === 'user' ? 'bg-purple-100 text-purple-600 ml-2' : 'bg-green-100 text-green-600 mr-2'
                  }`}>
                    {message.type === 'user' ? 'S' : 'AI'}
                  </div>
                  <div className={`px-4 py-2 rounded-lg ${
                    message.type === 'user' ? 'bg-purple-100' : 'bg-gray-100'
                  }`}>
                    {message.content}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex mb-4">
                <div className="flex items-start max-w-3xl">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-green-100 text-green-600 mr-2">
                    AI
                  </div>
                  <div className="px-4 py-2 rounded-lg bg-gray-100">
                    <TypingAnimation />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t p-4">
        <form onSubmit={handleQuestionSubmit} className="flex items-center">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Send a message..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!selectedDoc || isTyping}
          />
          <button
            type="submit"
            className="ml-2 p-2 rounded-lg hover:bg-gray-100"
            disabled={!selectedDoc || isTyping}
          >
            <Send className="w-5 h-5 text-gray-600" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;