## 64. Narzędzie CLI do Dwukierunkowej Synchronizacji Folderów (Folder Synchronizer CLI)

**Szczegółowy opis i cele edukacyjne:**
Synchronizacja danych między dwoma lokalizacjami (np. dyskiem lokalnym a sieciowym) w trybie dwukierunkowym (Two-way Synchronization) to trudny problem, ze względu na konieczność wykrywania konfliktów (np. zmiana tego samego pliku w obu miejscach od czasu ostatniej synchronizacji).
Projekt polega na stworzeniu narzędzia CLI synchronizującego katalog źródłowy A z katalogiem docelowym B w taki sposób, aby obie lokalizacje zawierały identyczne pliki.
Cele edukacyjne to zaawansowana praca z systemem plików, wykrywanie zmian na podstawie znaczników czasu (Last Write Time) oraz sum kontrolnych (MD5), wykrywanie usunięć plików za pomocą pliku stanu (Metadata DB / Database state file) oraz implementacja strategii rozwiązywania konfliktów (Conflict Resolution).

**Wymagane funkcje:**
- **Analiza różnic (Diffing Engine):** Porównywanie drzew plików A i B, tworzenie listy operacji: Kopiuj A->B, Kopiuj B->A, Usuń w A, Usuń w B, Konflikt.
- **Baza stanu (State DB):** Zapisywanie informacji o stanie plików podczas ostatniej poprawnej synchronizacji w pliku `.syncstate` (SQLite lub JSON) w celu odróżnienia modyfikacji pliku od jego usunięcia.
- **Rozwiązywanie konfliktów:** Wybór strategii rozwiązywania konfliktów (np. `--strategy master-a` nadpisuje zmiany plikiem z A, `--strategy newest` wybiera plik o nowszej dacie modyfikacji, `--strategy prompt` pyta użytkownika w konsoli).
- **Bezpieczne wykonywanie operacji:** Tworzenie kopii zapasowych (backup) plików przed ich nadpisaniem w celu zminimalizowania ryzyka utraty danych w przypadku błędu.

**Porady implementacyjne i dobre praktyki:**
Wykrywanie zmian wyłącznie po rozmiarze i dacie zapisu bywa zawodne. Zawsze wyliczaj hasz MD5/SHA-256 dla plików, które mają identyczny rozmiar, ale różnią się datami, aby sprawdzić, czy ich zawartość faktycznie uległa zmianie. Plik `.syncstate` musi przechowywać mapę ścieżek relatywnych, rozmiarów, dat zapisu oraz haszy z poprzedniego uruchomienia. Bez tej bazy stanu nie będziesz w stanie odróżnić sytuacji, w której plik został usunięty w katalogu A (powinien zostać usunięty również w B), od sytuacji, w której plik jest nowy w B (powinien zostać skopiowany do A).
Wzorzec projektowy: *Command (Polecenie)*, *Strategy (Strategia)*.
