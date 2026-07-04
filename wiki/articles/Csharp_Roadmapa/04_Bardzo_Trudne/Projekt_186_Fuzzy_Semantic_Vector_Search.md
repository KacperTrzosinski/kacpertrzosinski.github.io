## 186. Hybrydowy Silnik Wyszukiwania Rozmytego i Wektorowego (Fuzzy Semantic Vector Search)

**Szczegółowy opis i cele edukacyjne:**
Wyszukiwanie semantyczne (Vector Search) doskonale rozumie kontekst zapytania, ale ma ogromny problem, gdy użytkownik wpisze zapytanie zawierające rażące błędy pisowni, nazwy własne z literówkami lub skróty (np. "iphnoe 15" zamiast "iphone 15"). Model generujący embeddingi wejściowe może nie rozpoznać zniekształconego słowa, przypisując mu całkowicie losowy lub niepoprawny wektor. Rozwiązaniem jest połączenie wyszukiwania rozmytego (Fuzzy Spellchecking) w locie ze sprawdzaniem semantycznym (Hybrid Search).
Projekt polega na rozbudowaniu wyszukiwarki semantycznej o zautomatyzowaną korektę literówek zapytania tekstowego przed wysłaniem go do modelu generującego wektor embeddingu oraz scaleniem z odwróconym indeksem.
Cele edukacyjne to integracja potoków korekty pisowni z wyszukiwaniem semantycznym, dynamiczne poprawianie słów kluczowych na bazie statystyk częstości występowania w indeksie, oraz optymalizacja czasu przetwarzania zapytania (Pipeline latency reduction).

**Wymagane funkcje:**
- **Automatyczny korektor zapytań (Query Auto-Spellcheck):** Przed wygenerowaniem wektora dla zapytania użytkownika, system analizuje słowa zapytania. Słowa nieznane (nieobecne w słowniku bazy) są automatycznie zamieniane na najbliższe poprawne słowa przy użyciu indeksu trójgramowego i odległości Damerau-Levenshteina.
- **Generowanie wektora dla poprawionego zapytania:** Silnik generuje dynamicznie wektor embeddingu dla poprawionej i oczyszczonej frazy, co gwarantuje wysoką jakość dopasowania semantycznego.
- **Hybrydowy ranking z uwzględnieniem korekt:** System łączy wyniki z wyszukiwarki wektorowej i leksykalnej (za pomocą RRF), obniżając rangę dopasowań, w których konieczna była silna korekta literówek (np. odległość edycyjna > 2).
- **Zintegrowany CLI Tester:** Konsolowe okno wyszukiwania, w którym użytkownik może celowo robić literówki, a system pokazuje oryginalne zapytanie, automatyczną korektę, oraz precyzyjne wyniki wyszukiwania hybrydowego.

**Porady implementacyjne i dobre praktyki:**
Do budowy słownika korekt wykorzystaj słowa wyodrębnione z indeksowanych dokumentów (Document Corpus) – dzięki temu baza zna specyficzne słownictwo i nazwy produktów występujące w Twoich plikach. Do szybkiego sprawdzania pisowni i wyszukiwania najbliższych dopasowań bez skanowania całego słownika wykorzystaj strukturę SymSpell (Symmetric Delete Spelling Correction). Wykorzystuje ona wstępnie wygenerowane usuwanie znaków z wyrazów, co pozwala na korektę literówek w czasie $O(1)$ niezależnie od rozmiaru słownika.
Wzorzec projektowy: *Pipeline*, *Symmetric Delete Spelling Correction*, *Composite*.
