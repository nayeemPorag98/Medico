# MEDICO Streamlit App Setup

This Streamlit application integrates the AI Medical Chatbot (talkDOC) into the MEDICO platform with a direct access button.

## Prerequisites

1. Python 3.8 or higher
2. Access to the chatbot backend files (located in `../../Chatbot/talkDOC/`)
3. API keys for:
   - GROQ_API_KEY (from Groq)
   - SERPER_API_KEY (from Serper.dev) - required by backend

## Installation

1. **Install Dependencies:**
   ```bash
   pip install -r requirements_streamlit.txt
   ```

2. **Set Up Environment Variables:**
   Create a `.env` file in the `MEDICO copy 2 (1)/MEDICO copy 2/` directory with:
   ```
   GROQ_API_KEY=your-groq-api-key
   SERPER_API_KEY=your-serper-api-key
   ```

3. **Ensure Chatbot Backend is Available:**
   The app expects the chatbot backend files to be in `../../Chatbot/talkDOC/` relative to this file.
   Make sure the following files exist:
   - `backend.py`
   - `faiss_medical_book/` directory (with FAISS index files)

## Running the App

1. **Navigate to the directory:**
   ```bash
   cd "MEDICO copy 2 (1)/MEDICO copy 2"
   ```

2. **Run Streamlit:**
   ```bash
   streamlit run medico_streamlit_app.py
   ```

3. **Access the App:**
   The app will open in your default browser at `http://localhost:8501`

## Features

- **Home Page:** Welcome page with service overview
- **AI Chatbot:** Direct access button to the medical chatbot
- **Multiple Input Methods:**
  - Image upload and analysis
  - Voice input with speech recognition
  - Text chat interface
- **Language Support:** Automatic detection and translation (English/Bangla)

## Usage

1. Click the **"🤖 Access AI Chatbot"** button in the sidebar or on the home page
2. Choose your preferred input method (Image, Voice, or Text)
3. Ask medical-related questions or upload medical images
4. Get AI-powered responses from the medical assistant

## Troubleshooting

- **Import Error:** Ensure the chatbot backend files are accessible and the path is correct
- **API Key Error:** Check that your `.env` file is in the correct location and contains valid API keys
- **FAISS Index Error:** Make sure the FAISS index has been created (run `memory.py` in the chatbot directory if needed)

