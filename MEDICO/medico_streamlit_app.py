import os
import sys
import tempfile
import base64
import streamlit as st
import speech_recognition as sr
from pydub import AudioSegment
from langdetect import detect
from deep_translator import GoogleTranslator
from groq import Groq
from dotenv import load_dotenv

# Add the chatbot directory to the path to import backend
# Get the absolute path to the chatbot directory
current_dir = os.path.dirname(os.path.abspath(__file__))
workspace_root = os.path.abspath(os.path.join(current_dir, '../..'))
chatbot_path = os.path.join(workspace_root, 'Chatbot', 'talkDOC')

if os.path.exists(chatbot_path):
    sys.path.insert(0, chatbot_path)
    try:
        from backend import answer_query
    except ImportError as e:
        st.error(f"❌ Could not import chatbot backend: {e}")
        st.error(f"Please ensure the chatbot files are accessible at: {chatbot_path}")
        st.stop()
else:
    st.error(f"❌ Chatbot directory not found at: {chatbot_path}")
    st.error("Please ensure the Chatbot/talkDOC directory exists.")
    st.stop()

# =================== Load API Keys ===================
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    st.error("❌ Please set GROQ_API_KEY in your .env file.")
    st.stop()

# =================== Groq Client ===================
client = Groq(api_key=GROQ_API_KEY)

# =================== Model Names ===================
VISION_MODEL = "meta-llama/llama-4-scout-17b-16e-instruct"
CLASSIFIER_MODEL = "llama-3.1-8b-instant"

# =================== Helper Functions ===================

def is_medical_question(text: str) -> bool:
    """Checks if given text is related to medical or health topics."""
    prompt = f"""
    You are a strict classifier. Determine if the following content is related to
    health, medicine, diseases, symptoms, treatments, or healthcare.
    Reply only with YES or NO.

    Content: "{text}"
    """
    response = client.chat.completions.create(
        model=CLASSIFIER_MODEL,
        messages=[{"role": "user", "content": prompt}],
        max_tokens=5,
        temperature=0
    )
    result = response.choices[0].message.content.strip().upper()
    return result.startswith("YES")


def analyze_image_with_llama(image_file, question=None):
    """Uses meta-llama/llama-4-scout-17b-16e-instruct to describe an uploaded image."""
    prompt = question if question else "Describe this medical or skin image in detail."

    img_bytes = image_file.read()
    img_base64 = base64.b64encode(img_bytes).decode("utf-8")

    response = client.chat.completions.create(
        model=VISION_MODEL,
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {
                        "type": "image_url",
                        "image_url": {"url": f"data:image/jpeg;base64,{img_base64}"}
                    }
                ],
            }
        ],
        max_tokens=600,
        temperature=0.3,
    )

    return response.choices[0].message.content.strip()


# =================== Streamlit UI ===================
st.set_page_config(
    page_title="MEDICO - Medical Platform", 
    page_icon="🩺", 
    layout="wide",
    initial_sidebar_state="expanded"
)

# =================== Sidebar Navigation ===================
st.sidebar.title("🩺 MEDICO")
st.sidebar.markdown("---")

# Direct Access Button for Chatbot
if st.sidebar.button("🤖 Access AI Chatbot", use_container_width=True, type="primary"):
    st.session_state.show_chatbot = True
    st.session_state.show_home = False

if st.sidebar.button("🏠 Home", use_container_width=True):
    st.session_state.show_chatbot = False
    st.session_state.show_home = True

# Initialize session state
if "show_chatbot" not in st.session_state:
    st.session_state.show_chatbot = False
if "show_home" not in st.session_state:
    st.session_state.show_home = True

# =================== Main Content ===================
if st.session_state.show_chatbot:
    # Chatbot Interface
    st.title("🤖 AI Medical Chatbot - talkDOC")
    st.markdown("""
    <div style='background-color: #e3f2fd; padding: 20px; border-radius: 10px; margin-bottom: 20px;'>
        <h3 style='color: #1976d2; margin-top: 0;'>Welcome to MEDICO AI Assistant</h3>
        <p>Upload a <strong>medical or skin image</strong>, or ask using <strong>voice</strong> or <strong>text</strong>. 
        The chatbot can only respond to medical-related questions.</p>
    </div>
    """, unsafe_allow_html=True)
    
    # Create tabs for different input methods
    tab1, tab2, tab3 = st.tabs(["📸 Image Analysis", "🎙️ Voice Input", "💬 Text Chat"])
    
    # ----------- Image Upload Tab -----------
    with tab1:
        st.subheader("Upload Medical/Skin Image")
        image_file = st.file_uploader("📸 Upload medical/skin image:", type=["jpg", "jpeg", "png"], key="image_upload")
        image_question = st.text_input("Optional: Ask a question about this image:", key="image_question")
        
        if st.button("Analyze Image", key="analyze_btn", use_container_width=True):
            if not image_file:
                st.warning("⚠️ Please upload an image first.")
            else:
                with st.spinner("⏳ Analyzing image..."):
                    # Step 1: Vision model description
                    image_description = analyze_image_with_llama(image_file, image_question)
                    st.markdown(f"**Description:** {image_description}")
                    
                    # Step 2: Check if description is medical
                    if not is_medical_question(image_description):
                        st.markdown("⚠️ Sorry, I can only answer medical-related questions.")
                    else:
                        # Step 3: Send to backend for medical reasoning
                        detailed_answer = answer_query(image_description)
                        st.markdown(f"**Medical Assistant Response:** {detailed_answer}")
    
    # ----------- Voice Input Tab -----------
    with tab2:
        st.subheader("Voice Input")
        if "voice_file" not in st.session_state:
            st.session_state.voice_file = None
        
        audio_file = st.audio_input("🎙️ Record your health question:", key="audio_input")
        if audio_file is not None:
            st.session_state.voice_file = audio_file
            st.success("✅ Voice recorded. Press **Send Voice** to get an answer.")
        
        if st.button("Send Voice", key="send_voice_btn", use_container_width=True):
            if st.session_state.voice_file is None:
                st.warning("⚠️ Please record your question first.")
            else:
                try:
                    with st.spinner("⏳ Processing voice..."):
                        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp_wav:
                            tmp_wav.write(st.session_state.voice_file.getbuffer())
                            wav_path = tmp_wav.name
                        
                        # Convert to WAV if not already
                        if not wav_path.endswith(".wav"):
                            sound = AudioSegment.from_file(wav_path)
                            tmp_wav_conv = tempfile.NamedTemporaryFile(delete=False, suffix=".wav")
                            wav_path = tmp_wav_conv.name
                            sound.export(wav_path, format="wav")
                        
                        # Speech recognition
                        recognizer = sr.Recognizer()
                        with sr.AudioFile(wav_path) as source:
                            audio_data = recognizer.record(source)
                            user_text = recognizer.recognize_google(audio_data)
                        
                        # Language detection and translation
                        lang = detect(user_text)
                        user_text_en = GoogleTranslator(source="bn", target="en").translate(user_text) if lang == "bn" else user_text
                        
                        # Medical classification
                        if not is_medical_question(user_text_en):
                            ai_response = "Sorry, I can only answer medical-related questions."
                        else:
                            ai_response_en = answer_query(user_text_en)
                            ai_response = GoogleTranslator(source="en", target="bn").translate(ai_response_en) if lang == "bn" else ai_response_en
                        
                        st.markdown(f"**🗣️ You said:** {user_text}")
                        st.markdown(f"**🤖 AI Doctor:** {ai_response}")
                
                except Exception as e:
                    st.error(f"❌ Error: {str(e)}")
    
    # ----------- Text Input Tab -----------
    with tab3:
        st.subheader("Text Chat")
        user_text_input = st.text_input("💬 Or type your question here:", key="text_input", placeholder="Ask me anything about health, symptoms, or medical conditions...")
        
        if st.button("Send Text", key="send_text_btn", use_container_width=True):
            if not user_text_input.strip():
                st.warning("⚠️ Please type your question first.")
            else:
                try:
                    with st.spinner("⏳ Processing text..."):
                        lang = detect(user_text_input)
                        user_text_en = GoogleTranslator(source="bn", target="en").translate(user_text_input) if lang == "bn" else user_text_input
                        
                        if not is_medical_question(user_text_en):
                            ai_response = "Sorry, I can only answer medical-related questions."
                        else:
                            ai_response_en = answer_query(user_text_en)
                            ai_response = GoogleTranslator(source="en", target="bn").translate(ai_response_en) if lang == "bn" else ai_response_en
                        
                        st.markdown(f"**🗣️ You asked:** {user_text_input}")
                        st.markdown(f"**🤖 AI Doctor:** {ai_response}")
                
                except Exception as e:
                    st.error(f"❌ Error: {str(e)}")

else:
    # Home Page
    st.title("🩺 Welcome to MEDICO")
    st.markdown("""
    <div style='background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; border-radius: 15px; color: white; text-align: center; margin-bottom: 30px;'>
        <h1 style='color: white; margin-bottom: 20px;'>Your Complete Medical Solution</h1>
        <p style='font-size: 1.2em;'>Access healthcare services, consult doctors, and get AI-powered medical assistance</p>
    </div>
    """, unsafe_allow_html=True)
    
    # Main CTA Button for Chatbot
    col1, col2, col3 = st.columns([1, 2, 1])
    with col2:
        if st.button("🤖 Access AI Medical Chatbot", use_container_width=True, type="primary", key="main_chatbot_btn"):
            st.session_state.show_chatbot = True
            st.session_state.show_home = False
            st.rerun()
    
    st.markdown("---")
    
    # Services Grid
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("""
        <div style='padding: 20px; background-color: #f0f4f8; border-radius: 10px; margin-bottom: 20px;'>
            <h3>👨‍⚕️ Consult a Doctor</h3>
            <p>Book appointments with certified medical specialists</p>
        </div>
        """, unsafe_allow_html=True)
        
        st.markdown("""
        <div style='padding: 20px; background-color: #f0f4f8; border-radius: 10px; margin-bottom: 20px;'>
            <h3>💊 Order Medicines</h3>
            <p>Get your prescriptions delivered to your doorstep</p>
        </div>
        """, unsafe_allow_html=True)
    
    with col2:
        st.markdown("""
        <div style='padding: 20px; background-color: #f0f4f8; border-radius: 10px; margin-bottom: 20px;'>
            <h3>🔍 AI Symptom Checker</h3>
            <p>Get instant insights about your symptoms</p>
        </div>
        """, unsafe_allow_html=True)
        
        st.markdown("""
        <div style='padding: 20px; background-color: #f0f4f8; border-radius: 10px; margin-bottom: 20px;'>
            <h3>🚑 Emergency Ambulance</h3>
            <p>Quick access to emergency medical services</p>
        </div>
        """, unsafe_allow_html=True)

