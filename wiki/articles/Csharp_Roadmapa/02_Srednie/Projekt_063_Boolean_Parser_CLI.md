## 63. Parser Wyrażeń Logicznych i Generator Tabel Prawdy (Boolean Parser CLI)

**Szczegółowy opis i cele edukacyjne:**
Weryfikacja układów logicznych oraz optymalizacja zapytań bazodanowych wymaga analizy wyrażeń boolowskich (np. `(A AND B) OR (NOT C AND A)`). Projekt polega na stworzeniu parsera wyrażeń logicznych, który analizuje wprowadzony tekst, buduje drzewo składniowe (AST) i generuje pełną tabelę prawdy (Truth Table) dla wszystkich możliwych kombinacji wartości zmiennych wejściowych.
Cele edukacyjne to implementacja klasycznego parsera zstępującego (Recursive Descent Parser), reprezentacja gramatyki bezkontekstowej dla operatorów logicznych (`AND`, `OR`, `NOT`, `IMPLIES`, `EQUIVALENT`), dynamiczne generowanie tabel prawdy (generowanie kombinacji bitowych za pomocą operacji przesunięć bitowych) oraz czytelne formatowanie tabelaryczne w CLI.

**Wymagane funkcje:**
- **Analiza składniowa (Lexer & Parser):** Przekształcenie ciągu tekstowego (np. `p => q`) na tokeny i budowa drzewa AST z zachowaniem priorytetów operatorów (NOT > AND > OR > IMPLIES).
- **Detekcja zmiennych:** Automatyczne wyszukiwanie wszystkich unikalnych nazw zmiennych (np. A, B, C) występujących w wyrażeniu.
- **Generowanie kombinacji wejściowych:** Tworzenie macierzy prawdy zawierającej $2^N$ wierszy, gdzie $N$ to liczba unikalnych zmiennych.
- **Ewaluacja i renderowanie tabeli:** Obliczanie wartości wyrażenia dla każdego wiersza i wypisanie tabeli w konsoli z zaznaczeniem tautologii (wyrażeń zawsze prawdziwych) i sprzeczności.

**Porady implementacyjne i dobre praktyki:**
Do wygenerowania wszystkich kombinacji wejściowych o rozmiarze $2^N$ użyj pętli od $0$ do $2^N - 1$ i odczytuj poszczególne bity liczby jako wartości logiczne `true`/`false` dla zmiennych, np. `bool val = (i & (1 << j)) != 0`. Zapobiega to pisaniu głębokich, zagnieżdżonych pętli for. Parser zstępujący powinien obsługiwać błędy składniowe (np. brakujący nawias zamykający) i zgłaszać precyzyjne wyjątki `BooleanParseException`. Do ewaluacji drzewa AST wykorzystaj wzorzec Wizytatora (Visitor).
Wzorzec projektowy: *Interpreter*, *Visitor (Wizytator)*, *Composite (Kompozyt)*.
