from pathlib import Path
import spacy
from wordfreq import zipf_frequency

dir = Path(__file__).resolve().parent
processed_file = dir.parent / 'data' / 'openthesaurus_processed.txt'
top_nouns_file = dir.parent / 'data' / 'openthesaurus_processed_easymode.txt'

nlp = spacy.load("de_core_news_sm")

# Verarbeitete Wörter einlesen
with open(processed_file, 'r', encoding='utf-8') as f:
    words = [line.strip() for line in f]

# Extrahiere Substantive und ihre Häufigkeit
noun_freq = {}
for word in words:
    capitalized = word.capitalize()
    doc = nlp(capitalized)
    
    # Akzeptiere nur eindeutige Nomen (ein Token, POS-Tag "NOUN")
    if len(doc) == 1 and doc[0].pos_ == 'NOUN':
        freq = zipf_frequency(capitalized, 'de')
        noun_freq[word] = freq  # Speichere das Original (Kleinschreibung)

# Sortiere nach Häufigkeit (absteigend)
sorted_nouns = sorted(noun_freq.items(), key=lambda x: x[1], reverse=True)

# Wähle die Top N (z. B. 500)
top_n = 500
top_nouns = [noun for noun, freq in sorted_nouns[:top_n] if freq > 1.0]  # Filtere seltene Wörter

# Schreibe die Top-Substantive in die Datei (kleingeschrieben)
with open(top_nouns_file, 'w', encoding='utf-8') as f:
    for noun in top_nouns:
        f.write(noun + '\n')