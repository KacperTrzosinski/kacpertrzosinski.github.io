## 149. CLI do Wyznaczania Różnic i Patchowania B-Drzew (B-Tree Diff Sync CLI)

**Szczegółowy opis i cele edukacyjne:**
Wydajne synchronizowanie dużych struktur danych (np. baz danych zindeksowanych B-Drzewem na dysku) bez przesyłania całego pliku wymaga wyznaczania różnic (delta updates) na poziomie samych stron indeksu. Wykrywanie, które gałęzie i węzły drzewa uległy zmianie i generowanie dla nich minimalnych poprawek (Patches), to zaawansowany problem optymalizacyjny.
Projekt polega na stworzeniu narzędzia CLI analizującego i synchronizującego dwa pliki indeksów B-Drzewa.
Cele edukacyjne to reprezentacja i serializacja struktur drzewiastych na dysku, wyliczanie haszy sum kontrolnych (Merkle Tree-like verification) dla poszczególnych węzłów drzewa w celu błyskawicznego lokalizowania zmian w czasie $O(\log N)$, oraz generowanie i nakładanie poprawek binarnych (Binary Patches) w sposób transakcyjny.

**Wymagane funkcje:**
- **Zapis indeksu B-Drzewa na dysku (Page Serialization):** Serializacja węzłów drzewa do bloków o stałym rozmiarze (np. strony 4KB) zapisywanych w pliku binarnym.
- **Hierarchiczne sumy kontrolne (B-Tree Hashing):** Każdy węzeł przechowuje sumę kontrolną (hasz SHA-256) wyliczoną na podstawie swoich kluczy oraz haszy swoich dzieci (struktura podobna do drzewa Merkle). Zmiana jednego rekordu na dole drzewa propaguje zmianę haszy w górę aż do korzenia (Root).
- **Algorytm detekcji różnic (Diff Engine):** Porównanie dwóch drzew A i B zaczynając od korzenia. Jeśli hasze korzeni są identyczne, drzewa są równe. Jeśli nie, program rekurencyjnie schodzi tylko do tych dzieci, których hasze się różnią, lokalizując zmienione węzły w czasie logarytmicznym.
- **Generowanie i aplikowanie patcha (Sync CLI):** Eksport zmodyfikowanych stron indeksu do pliku poprawki (`.patch`) i asynchroniczne zaaplikowanie go do drzewa docelowego z gwarancją transakcyjności (Rollback przy błędzie integralności).

**Porady implementacyjne i dobre praktyki:**
Struktura pliku indeksu powinna być podzielona na nagłówek (Header) i ponumerowane strony (Pages). Wykorzystaj typ `ReadOnlySpan<byte>` do parsowania surowych bajtów stron w pamięci. Przy porównywaniu dwóch B-Drzew, algorytm diff powinien zwrócić listę operacji typu: `ReplacePage(pageId, newBytes)`, `DeletePage(pageId)` czy `AddPage(pageId, bytes)`. Zaimplementuj nakładanie patcha wewnątrz bloku transakcyjnego – przed modyfikacją stron utwórz kopię zapasową zmienianych bloków (Undo Log), co pozwoli na pełne wycofanie zmian, jeśli plik patcha okaże się uszkodzony.
Wzorzec projektowy: *Memento*, *Command*, *Merkle Tree Validation*.
