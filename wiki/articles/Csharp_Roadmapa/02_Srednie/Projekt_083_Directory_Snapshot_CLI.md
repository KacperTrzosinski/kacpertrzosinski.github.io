## 83. Narzędzie CLI do Tworzenia Migawek Stanu Folderów (Directory Snapshot CLI)

**Szczegółowy opis i cele edukacyjne:**
Wykrywanie zmian w systemie plików (audyt integralności plików, systemy wykrywania włamań IDS - Intrusion Detection System) wymaga robienia tzw. migawek (snapshots) stanu katalogów i porównywania ich w czasie w celu zidentyfikowania, jakie pliki zostały dodane, zmodyfikowane, usunięte lub przeniesione.
Projekt polega na stworzeniu aplikacji CLI tworzącej ustrukturyzowane migawki folderów i zapisującej je w plikach stanu (JSON lub Binarnym) na dysku.
Cele edukacyjne to zaawansowana serializacja (optymalizacja zapisu dużych struktur danych do pliku), wyliczanie haszy SHA-256 dla plików w sposób asynchroniczny z wykorzystaniem puli wątków w celu przyspieszenia działania dla dużych katalogów, oraz implementacja wydajnego algorytmu wyznaczania różnic (diff) między dwoma migawkami.

**Wymagane funkcje:**
- **Tworzenie migawki (Snapshot Generation):** Rekurencyjne skanowanie folderów, odczytywanie rozmiaru pliku, daty modyfikacji oraz wyliczanie haszu SHA-256 dla każdego pliku, z zapisem metadanych do struktury JSON/Binary.
- **Równoległe haszowanie (Concurrency):** Uruchomienie wielu wątków w tle do jednoczesnego wyliczania sum kontrolnych plików, co drastycznie skraca czas tworzenia migawki dla dużych projektów.
- **Wyznaczanie różnic (Diffing Engine):** Porównanie migawki A i B i wyplucie szczegółowego zestawienia: Dodane pliki, Usunięte, Zmodyfikowane (różne hasze), Przeniesione (ten sam hasz i rozmiar, ale inna ścieżka).
- **Zintegrowany CLI Reporter:** Czytelny raport zmian oznaczony kolorami (np. zielony dla dodanych plików, czerwony dla usuniętych, żółty dla zmian).

**Porady implementacyjne i dobre praktyki:**
Podczas równoległego wyliczania haszy plików, aby uniknąć przeciążenia dysku (zjawisko I/O Thrashing - gdy zbyt wiele wątków jednocześnie próbuje czytać dane z różnych miejsc na dysku HDD/SSD, co obniża wydajność), ogranicz stopień współbieżności operacji dyskowych za pomocą `SemaphoreSlim` do małej liczby (np. 2 do 4 równoległych odczytów). Do mapowania struktury plików w migawce użyj słownika opartego o ścieżkę relatywną jako klucz `Dictionary<string, FileSnapshotMetadata>`, co ułatwi i przyspieszy porównywanie dwóch migawek.
Wzorzec projektowy: *Command (Polecenie)*, *Memento (Pamiątka)*.
