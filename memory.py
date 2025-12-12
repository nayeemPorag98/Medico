import os
from dotenv import load_dotenv
from langchain_community.vectorstores import FAISS
from langchain_core.embeddings import Embeddings
from sentence_transformers import SentenceTransformer
from langchain_text_splitters import RecursiveCharacterTextSplitter
from PyPDF2 import PdfReader

# -----------------------------
# ⿡ Load environment variables
# -----------------------------
load_dotenv()

PDF_PATH = os.path.join("data", "medical_book.pdf")

print("📥 Step 1: Loading Medical Book PDF...")
if not os.path.exists(PDF_PATH):
    raise FileNotFoundError(f"❌ PDF not found at: {PDF_PATH}")

reader = PdfReader(PDF_PATH)

# -----------------------------
# ⿢ Extract text from PDF
# -----------------------------
print("📖 Extracting text from PDF...")
raw_text = ""
for page in reader.pages:
    raw_text += page.extract_text() + "\n"

print(f"✅ Extracted {len(raw_text)} characters of text")

# -----------------------------
# ⿣ Split into chunks
# -----------------------------
print("✂ Splitting text into chunks...")
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200
)

texts = text_splitter.split_text(raw_text)
print(f"✅ Created {len(texts)} text chunks")

# -----------------------------
# ⿤ Embedding model wrapper
# -----------------------------
class SentenceTransformerEmbeddings(Embeddings):
    def __init__(self, model_name="all-MiniLM-L6-v2"):
        print(f"🧠 Loading embedding model → {model_name}")
        self.model = SentenceTransformer(model_name)
        print("✅ Embedding model loaded")

    def embed_documents(self, docs):
        print(f"🔄 Embedding {len(docs)} chunks...")
        return self.model.encode(
            docs,
            convert_to_numpy=True,
show_progress_bar=True
        ).tolist()

    def embed_query(self, text):
        return self.model.encode([text], convert_to_numpy=True)[0].tolist()

# -----------------------------
# ⿥ Initialize embedding
# -----------------------------
embedding = SentenceTransformerEmbeddings()

# -----------------------------
# ⿦ Create and save FAISS index
# -----------------------------
print("📦 Building FAISS vector store...")
vectorstore = FAISS.from_texts(texts, embedding=embedding)

SAVE_PATH = "faiss_medical_book"
vectorstore.save_local(SAVE_PATH)

print(f"💾 Saved FAISS index → {SAVE_PATH}")
print("🎉 All steps completed successfully!")
