import torch
from transformers import AutoTokenizer, AutoModel

# Load the model and tokenizer
model_name = "jinaai/jina-embeddings-v3"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModel.from_pretrained(model_name, trust_remote_code=True)  # Added trust_remote_code=True

# Move the model to MPS (if available)
device = torch.device("mps") if torch.backends.mps.is_available() else torch.device("cpu")
model.to(device)

# Encode a sample sentence
text = "This is a test sentence."
inputs = tokenizer(text, return_tensors="pt").to(device)

with torch.no_grad():
    outputs = model(**inputs)

# Print embedding size and result
print("Embedding shape:", outputs.last_hidden_state.shape)