import os
from dotenv import load_dotenv
from pinecone import Pinecone, ServerlessSpec
import torch
from transformers import AutoTokenizer, AutoModel
from pathlib import Path
from tqdm import tqdm  

# Lade Umgebungsvariablen
load_dotenv()

PINECONE_KEY = os.getenv("PINECONE_KEY")
pc = Pinecone(api_key=PINECONE_KEY)

# Upload verschiedener Vokabularwörter zu Pinecone (leichter und schwerer Modus)
#LEICHT
index_name = "semantix-easy"
#SCHWER
#index_name = "semantix"
dimension = 1024 

if index_name not in pc.list_indexes():
    pc.create_index(
        name=index_name,
        dimension=dimension, 
        metric="cosine", 
        spec=ServerlessSpec(
            cloud="aws",
            region="us-east-1"
        ) 
    )
    print(f"Pinecone-Index '{index_name}' erstellt.")

# Verbinde dich mit dem Index
index = pc.Index(index_name)

# Lade das Modell und den Tokenizer
model_name = "jinaai/jina-embeddings-v3"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModel.from_pretrained(model_name, trust_remote_code=True) 

device = torch.device("mps") if torch.backends.mps.is_available() else torch.device("cpu")
model.to(device)
model.eval()  

script_dir = Path(__file__).resolve().parent
#LEICHTE LISTE
input_file = script_dir.parent / 'data' / 'openthesaurus_processed_easymode.txt'
#SCHWERE LISTE
#input_file = script_dir.parent / 'data' / 'openthesaurus_processed.txt'

with open(input_file, 'r', encoding='utf-8') as f:
    words = [line.strip() for line in f if line.strip()]
print(f"Total words to process: {len(words)}")

# Batch-Größe für Embeddings und Pinecone Upsert
batch_size = 256
def get_embeddings(texts):
    """Generiert Embeddings für eine Liste von Texten."""
    inputs = tokenizer(texts, padding=True, truncation=True, return_tensors="pt", max_length=8192).to(device) 
    with torch.no_grad():
        outputs = model(**inputs)
        embeddings = outputs.last_hidden_state.mean(dim=1).cpu().numpy()
    return embeddings

# Generiere IDs für Pinecone
ids = [f"id_{i}" for i in range(len(words))]
for i in tqdm(range(0, len(words), batch_size), desc="Uploading embeddings"):
    batch_words = words[i:i+batch_size]
    batch_ids = ids[i:i+batch_size]
    embeddings = get_embeddings(batch_words)
    if embeddings.shape[1] != dimension:
        raise ValueError(f"Embedding-Dimension {embeddings.shape[1]} stimmt nicht mit erwarteter Dimension {dimension} überein.")
    vectors = [
        {
            "id": batch_ids[j],
            "values": embeddings[j].tolist(),
            "metadata": {"word": batch_words[j]}
        }
        for j in range(len(batch_words))
    ]
    index.upsert(vectors=vectors)
    print(f"Batch {i//batch_size + 1} von {len(words)//batch_size} hochgeladen.")

print("Alle Embeddings wurden erfolgreich zu Pinecone hochgeladen.")