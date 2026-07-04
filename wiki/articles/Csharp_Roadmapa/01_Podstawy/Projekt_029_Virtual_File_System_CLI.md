## 29. Symulator Wirtualnego Systemu Plików (Virtual File System CLI)

**Szczegółowy opis i cele edukacyjne:**
Systemy plików (takie jak NTFS czy ext4) organizują dane w hierarchiczne struktury katalogów i plików. Zrozumienie sposobu, w jaki systemy operacyjne reprezentują te struktury, jest kluczowe dla każdego inżyniera oprogramowania.
W tym projekcie stworzysz wirtualny system plików (VFS) działający w całości w pamięci RAM. Użytkownik wchodzi w interakcję z systemem za pomocą konsoli z zestawem komend unixowych (np. `ls`, `cd`, `mkdir`, `touch`, `rm`, `pwd`).
Cele edukacyjne to praca z drzewiastymi strukturami danych (hierarchia katalogów), rekurencyjne przeszukiwanie i usuwanie węzłów drzewa, zarządzanie ścieżkami relatywnymi i absolutnymi, oraz bezpieczna obsługa wyjątków.

**Wymagane funkcje:**
- **Hierarchia węzłów (Directory & File):** Węzeł bazowy `VNode` oraz klasy pochodne `VDirectory` (zawierająca kolekcję dzieci) i `VFile` (zawierająca tablicę bajtów jako treść).
- **Obsługa ścieżek:** Mechanizm parsujący i nawigujący po ścieżkach systemowych, np. `cd ../usr/bin` lub `cd /var/log`, z poprawnym rozstrzyganiem katalogów specjalnych `.` oraz `..`.
- **Zarządzanie stanem (Current Working Directory):** Śledzenie aktualnej pozycji użytkownika w drzewie katalogów i dynamiczne generowanie promptu konsoli.
- **Komendy manipulacji strukturą:** Dodawanie, usuwanie (również rekurencyjne z flagą `-r`), zmiana nazwy (`mv`) oraz kopiowanie (`cp`) plików i folderów.

**Porady implementacyjne i dobre praktyki:**
Przechowuj katalogi wewnątrz `VDirectory` za pomocą słownika `Dictionary<string, VNode>`, gdzie kluczem jest nazwa pliku/folderu – ułatwi to wyszukiwanie i zapobiegnie powstawaniu duplikatów o tej samej nazwie w obrębie jednego folderu. Przy usuwaniu rekurencyjnym zadbaj o poprawne zwalnianie referencji, aby Garbage Collector mógł bez przeszkód wyczyścić pamięć. Zabezpiecz system przed zapętleniami i próbami usunięcia katalogów nadrzędnych. Napisz testy weryfikujące poprawność parsowania ścieżek relatywnych zawierających wiele skoków w górę struktury (np. `../../dir/../`).
Wzorzec projektowy: *Composite (Kompozyt)* (do reprezentowania zagnieżdżonej struktury plików i katalogów).
