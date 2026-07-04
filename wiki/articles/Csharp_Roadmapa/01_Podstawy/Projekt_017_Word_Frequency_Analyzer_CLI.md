## 17. Analizator Częstotliwości Słów w Tekstach (Word Frequency Analyzer CLI)

**Szczegółowy opis i cele edukacyjne:**
Projekt polega na stworzeniu zaawansowanego programu konsolowego do analizy statystycznej tekstów literackich, artykułów lub logów. Aplikacja wczytuje plik tekstowy, oczyszcza go z interpunkcji, normalizuje (zamiana na małe litery, usuwanie znaków diakrytycznych) i wylicza statystyki: liczbę słów, najczęstsze słowa (z pominięciem tzw. "stop words" - spójników typu: i, w, na, a, the, a, itp.), a także analizuje n-gramy (sekwencje n słów obok siebie).
Cele edukacyjne to zaawansowana manipulacja słownikami (`Dictionary<string, int>`), grupowanie przy użyciu LINQ, wydajna tokenizacja znaków (np. za pomocą `StringSegment` lub `ReadOnlySpan<char>` w celu optymalizacji pamięciowej) oraz sortowanie kolekcji par klucz-wartość na podstawie wartości.

**Wymagane funkcje:**
- **Normalizacja i czyszczenie tekstu:** Oczyszczanie tekstu ze znaków specjalnych, liczb i interpunkcji, obsługa różnych wersji językowych (np. polskie znaki diakrytyczne).
- **Ignorowanie słów stopu (Stop Words Filter):** Wczytywanie zewnętrznej listy wykluczeń i ignorowanie ich podczas budowania rankingu popularności.
- **Analiza n-gramów:** Wyliczanie i prezentowanie najpopularniejszych dwuwyrazowych (bigramy) i trzywyrazowych (trigramy) związków frazeologicznych.
- **Wizualizacja chmury słów w CLI:** Tekstowa wizualizacja najpopularniejszych słów z przeskalowaniem ich do rozmiarów czcionki lub wskaźników graficznych na konsoli (np. wykres słupkowy ASCII).

**Porady implementacyjne i dobre praktyki:**
Aby optymalnie zliczać słowa, zaimplementuj słownik zignorowanych słów jako `HashSet<string>`, a nie `List<string>` – operacja `Contains` w zbiorze `HashSet` ma złożoność obliczeniową $O(1)$, podczas gdy w liście wynosi ona $O(N)$. Do wyszukiwania słów i eliminacji znaków interpunkcyjnych zamiast wolnego `string.Replace` napisz pętlę przechodzącą po znakach i budującą słowa za pomocą `StringBuilder` lub posłuż się klasą `StringReader`. Do końcowego sortowania wyników wykorzystaj LINQ: `.OrderByDescending(x => x.Value).Take(topCount)`.
Wzorzec projektowy: *Strategy (Strategia)* (dla różnych algorytmów oczyszczania/tokenizacji tekstu, np. Regex vs Manual Char Loop).
