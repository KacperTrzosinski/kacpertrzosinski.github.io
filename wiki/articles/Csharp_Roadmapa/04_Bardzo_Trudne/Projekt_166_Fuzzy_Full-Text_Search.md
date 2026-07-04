## 166. Silnik Wyszukiwania Pełnotekstowego z Wyszukiwaniem Rozmytym (Fuzzy Full-Text Search)

**Szczegółowy opis i cele edukacyjne:**
Tradycyjne wyszukiwarki pełnotekstowe wymagają dokładnego dopasowania słów (po sprowadzeniu ich do formy bazowej). Jednak użytkownicy często popełniają literówki (np. wpisując "prgoramowanie" zamiast "programowanie"). Wyszukiwanie Rozmyte (Fuzzy Search) pozwala na wyszukiwanie słów o podobnej pisowni za pomocą metryk odległości edycyjnej tekstu, co drastycznie podnosi jakość i wygodę wyszukiwania.
Projekt polega na rozbudowaniu napisanego wcześniej silnika wyszukiwania pełnotekstowego o obsługę zapytań rozmytych z wykorzystaniem indeksowania n-gramowego (Trigrams) i filtrowania Levenshteina.
Cele edukacyjne to implementacja algorytmów obliczania odległości edycyjnej (Levenshtein Distance, Damerau-Levenshtein), indeksowanie n-gramowe słów (N-gram Indexing) w celu szybkiego wyszukiwania kandydatów do porównania w czasie $O(1)$, oraz dynamiczne łączenie wyników rozmytych z wagami algorytmu TF-IDF.

**Wymagane funkcje:**
- **Kompilator odległości edycyjnej:** Funkcja wyliczająca odległość Levenshteina (lub Damerau-Levenshteina obsługującą transpozycję sąsiednich znaków) określająca minimalną liczbę operacji (wstawienie, usunięcie, zamiana, zamiana miejscami znaków) potrzebnych do przekształcenia słowa A w słowo B.
- **Indeks Trójgramowy (Trigram Index):** Słownik przechowujący podziały wszystkich słów ze słownika bazy na 3-literowe kawałki (np. słowo "program" dzielone jest na: `^pr`, `pro`, `rog`, `ogr`, `gra`, `ram`, `am$`). Przy wyszukiwaniu zapytania "prgrom", silnik najpierw pobiera słowa o największej liczbie wspólnych trójgramów z indeksu, co pozwala uniknąć liczenia odległości Levenshteina dla milionów słów w bazie.
- **Wyszukiwanie z tolerancją literówek (Fuzzy Match):** Obsługa składni zapytań typu `programowanie~2` (oznacza: szukaj słowa "programowanie" z dopuszczalną odległością edycyjną do 2).
- **Rankingowanie ze współczynnikiem rozmycia:** Obniżanie wagi dokumentów, w których dopasowanie nastąpiło z literówką (im większa odległość edycyjna wyszukiwanego słowa od słowa w dokumencie, tym mniejszy wpływ na końcowy Relevance Score).

**Porady implementacyjne i dobre praktyki:**
Klasyczny algorytm Levenshteina wykorzystuje macierz dwuwymiarową o złożoności pamięciowej $O(min(M, N))$, co można zoptymalizować do wykorzystania tylko dwóch jednowymiarowych tablic (aktualnego i poprzedniego wiersza), drastycznie zmniejszając narzut alokacji na stercie (użyj `Span<int>` na stosie za pomocą `stackalloc`). Indeks trójgramów jest kluczowy dla zachowania wydajności – bez niego wyszukiwanie rozmyte (porównywanie każdego słowa z bazy) byłoby zbyt wolne do zastosowań produkcyjnych.
Wzorzec projektowy: *Fuzzy Search Pattern*, *Trie Tree*, *Strategy*.
