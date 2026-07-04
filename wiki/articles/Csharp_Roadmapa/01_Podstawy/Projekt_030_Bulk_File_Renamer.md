## 30. Masowy Zmieniacz Nazw Plików na Podstawie Metadanych (Bulk File Renamer)

**Szczegółowy opis i cele edukacyjne:**
Porządkowanie dużej liczby plików (np. zdjęć z aparatu, plików muzycznych lub logów) wymaga automatyzacji. Projekt polega na stworzeniu narzędzia CLI do masowej zmiany nazw plików w wybranym katalogu na podstawie zdefiniowanego szablonu i reguł.
Cele edukacyjne to bezpieczna manipulacja plikami na dysku (przestrzeń nazw `System.IO`), wykorzystanie wyrażeń regularnych (`Regex`) z grupami przechwytującymi (capturing groups) do wyodrębniania części oryginalnych nazw plików, odczytywanie podstawowych metadanych plików (np. data utworzenia pliku) oraz implementacja mechanizmu transakcyjności (Rollback) – jeśli w trakcie masowej zmiany nazwy 500 plików chociaż jedna operacja zakończy się błędem (np. brak uprawnień lub konflikt nazw), program powinien automatycznie przywrócić poprzednie nazwy wszystkich zmodyfikowanych już plików.

**Wymagane funkcje:**
- **Analiza struktury katalogów:** Wczytywanie plików o określonym rozszerzeniu lub pasujących do filtra Regex.
- **Dynamiczne szablony nazw:** Definiowanie formatu docelowego przy użyciu tokenów, np. `[YYYY-MM-DD]_{orig}_[index]`, gdzie program automatycznie wstrzykuje datę modyfikacji pliku, oryginalną nazwę oraz kolejny numer indeksu.
- **Tryb podglądu (Dry Run):** Prezentacja tabelaryczna planowanych zmian nazw plików przed ich faktycznym wykonaniem na dysku (w celu weryfikacji przez użytkownika).
- **Bezpieczny Rollback (Transakcyjność):** Rejestrowanie historii zmian nazw w pamięci na wypadek błędu i automatyczne przywrócenie stanu początkowego przy wystąpieniu wyjątku w trakcie fizycznego przenoszenia plików.

**Porady implementacyjne i dobre praktyki:**
Do fizycznej zmiany nazwy pliku wykorzystaj metodę `File.Move`. Aby bezpiecznie zaimplementować mechanizm wycofania transakcji, w pętli modyfikującej pliki zbieraj pary: `(string OldPath, string NewPath)` w strukturze typu `Stack` lub `List`. W bloku `catch` przechwytującym wyjątek, przejdź po tej kolekcji w kolejności LIFO (Last-In, First-Out) i wykonaj `File.Move` w kierunku odwrotnym. Upewnij się, że poprawnie obsługujesz sytuację, w której nowa nazwa pliku już istnieje na dysku – rzuć odpowiedni wyjątek zanim dokonasz jakichkolwiek modyfikacji (faza walidacji wstępnej).
Wzorzec projektowy: *Command (Polecenie)* (gdzie zmiana nazwy każdego pliku jest obiektem komendy, co umożliwia łatwy Undo/Rollback).
