import re
import spacy
from pathlib import Path

dir = Path(__file__).resolve().parent

input_file = dir.parent / 'data' / 'openthesaurus_unedited.txt'
output_file = dir.parent / 'data' / 'openthesaurus_processed.txt'

nlp = spacy.load("de_core_news_sm")

# Regulärer Ausdruck zum Entfernen von Klammern und Inhalt
pattern = re.compile(r'\(.*?\)')

with open(input_file, 'r', encoding='utf-8') as f_in, open(output_file, 'w', encoding='utf-8') as f_out:
    for line in f_in:
        # Überspringe Kommentarzeilen
        if line.startswith('#'):
            continue
        # Entferne Klammern und Inhalt
        cleaned_line = pattern.sub('', line)
        # Teile die Zeile anhand von Semikolons
        words = cleaned_line.split(';')
        for word in words:
            # Entferne führende und folgende Leerzeichen
            word = word.strip()
            if word:  # Stelle sicher, dass das Wort nicht leer ist
                doc = nlp(word)
                tokens = [token.text.strip() for token in doc if not token.is_stop and not token.is_punct]
                for token in tokens:
                    if token:  
                        f_out.write(token + '\n')