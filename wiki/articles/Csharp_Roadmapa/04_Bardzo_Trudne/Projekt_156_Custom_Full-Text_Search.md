## 156. Silnik Wyszukiwania Pełnotekstowego z Odwróconym Indeksem (Custom Full-Text Search)

**Szczegółowy opis i cele edukacyjne:**
Wyszukiwanie informacji w bazie danych za pomocą operatora `LIKE '%tekst%'` staje się nieefektywne przy milionach wierszy, ponieważ wymusza skanowanie całej tabeli (Full Table Scan). Profesjonalne systemy wyszukiwania pełnotekstowego (np. Elasticsearch, Lucene) opierają się na strukturze Odwróconego Indeksu (Inverted Index), który mapuje poszczególne słowa bezpośrednio na listy dokumentów, w których te słowa występują.
Projekt polega na stworzeniu od podstaw własnego silnika wyszukiwania pełnotekstowego w pamięci z możliwością trwałego zapisu na dysku.
Cele edukacyjne to leksykalna tokenizacja tekstu, usuwanie słów pospolitych (Stop-words), normalizacja i sprowadzanie słów do formy bazowej (Stemming), implementacja odwróconego indeksu, oraz ocena trafności dokumentów przy użyciu algorytmu matematycznego TF-IDF (Term Frequency-Inverse Document Frequency) lub BM25.

**Wymagane funkcje:**
- **Analizator tekstu (Text Pipeline):** Proces przetwarzający surowy dokument tekstowy:
  - *Tokenizacja*: Rozbicie tekstu na poszczególne słowa (Tokens) z usunięciem znaków interpunkcyjnych.
  - *Stop-words removal*: Usunięcie słów niemających znaczenia semantycznego (np. "i", "w", "na", "the", "a").
  - *Stemming*: Uproszczenie słów (np. "bieganie", "biegać", "pobiegł" stają się wspólnym rdzeniem "bieg").
- **Silnik Odwróconego Indeksu (Inverted Index):** Słownik, w którym kluczem jest przetworzone słowo (Term), a wartością lista par `(DocumentId, TermFrequency)`, zoptymalizowany pod kątem szybkiego przeszukiwania.
- **Wyszukiwanie boolowskie (Boolean Queries):** Obsługa zapytań z operatorami logicznymi: `AND`, `OR` oraz `NOT` (np. szukaj dokumentów zawierających słowa "C#" AND "programowanie" BUT NOT "Java").
- **Rankingowanie wyników (TF-IDF / BM25):** Wyliczanie trafności (Relevance Score) dla każdego dopasowanego dokumentu i zwracanie wyników posortowanych od najbardziej dopasowanych.

**Porady implementacyjne i dobre praktyki:**
Do zaimplementowania stemmingu (dla języka angielskiego) wykorzystaj powszechnie znany, klasyczny algorytm Porter Stemmer. Reprezentację odwróconego indeksu w pamięci zorganizuj jako `Dictionary<string, List<Posting>>`, gdzie `Posting` to struktura przechowująca ID dokumentu oraz pozycje słowa w dokumencie (przydatne do wyszukiwania frazowego). Podczas wyliczania rankingu TF-IDF, wartość TF (Term Frequency) mierzy jak często słowo występuje w danym dokumencie, a IDF (Inverse Document Frequency) zmniejsza wagę słów popularnych w całej bazie dokumentów, zwiększając znaczenie słów unikalnych.
Wzorzec projektowy: *Inverted Index*, *Strategy (Strategia)* (dla podmieniania analizatorów językowych), *Flyweight*.
