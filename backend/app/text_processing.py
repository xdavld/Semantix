import re
import spacy
from pathlib import Path
from spellchecker import SpellChecker

dir = Path(__file__).resolve().parent
input_file = dir.parent / 'data' / 'openthesaurus_unedited.txt'
output_file = dir.parent / 'data' / 'openthesaurus_processed.txt'

# Initialisiere NLP und Spellchecker
nlp = spacy.load("de_core_news_sm")
spell = SpellChecker(language='de')

# Regex: Nur Buchstaben und Umlaute (keine Zahlen/Sonderzeichen)
word_pattern = re.compile(r'^[a-zäöüß]+$')  # Kleinbuchstaben enforced
pattern = re.compile(r'\(.*?\)')  # Entfernt Klammern

unique_words = set()

with open(input_file, 'r', encoding='utf-8') as f_in, open(output_file, 'w', encoding='utf-8') as f_out:
    for line in f_in:
        if line.startswith('#'):
            continue
        
        cleaned_line = pattern.sub('', line)  # Klammern entfernen
        words = cleaned_line.split(';')
        
        for word in words:
            word = word.strip().lower()  # Alles in Kleinbuchstaben
            if not word:
                continue
            
            # Tokenisiere und entferne Stoppwörter/Punktuation
            doc = nlp(word)
            tokens = [
                token.text
                for token in doc
                if not token.is_stop and not token.is_punct
            ]
            
            for token in tokens:
                token = token.strip().lower()  # Erzwinge Kleinbuchstaben
                # Validierung:
                # 1. Mindestlänge 3
                # 2. Nur Buchstaben
                # 3. Korrekte Rechtschreibung
                if (len(token) >= 3 
                    and word_pattern.match(token) 
                    and spell.known([token]) 
                    and token not in unique_words):
                    unique_words.add(token)
                    f_out.write(token + '\n')