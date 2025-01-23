import os
from dotenv import load_dotenv
from pinecone import Pinecone, ServerlessSpec

load_dotenv()

PINECONE_KEY = os.getenv("PINECONE_KEY")

pc = Pinecone(api_key=PINECONE_KEY)

index_name = "semantix"

pc.create_index(
    name=index_name,
    dimension=2, # Replace with your model dimensions
    metric="cosine", 
    spec=ServerlessSpec(
        cloud="aws",
        region="us-east-1"
    ) 
)