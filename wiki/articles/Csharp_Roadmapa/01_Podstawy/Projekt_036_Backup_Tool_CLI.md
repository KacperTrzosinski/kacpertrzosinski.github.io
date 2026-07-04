## 36. Narzędzie do Kopiowania Zapasowego z Filtrami (Backup Tool CLI)

**Szczegółowy opis i cele edukacyjne:**
Tworzenie kopii zapasowych to jeden z filarów bezpieczeństwa infrastruktury IT. Projekt polega na stworzeniu aplikacji CLI, która wykonuje kopie zapasowe wskazanego folderu do innego katalogu lub spakowanego archiwum ZIP. Narzędzie musi obsługiwać złożone reguły filtrowania oraz radzić sobie z plikami tymczasowo zablokowanymi przez system operacyjny.
Cele edukacyjne to nauka głębokiej rekurencji w systemie plików (`Directory.EnumerateFiles`), zaawansowanego filtrowania plików (na podstawie rozmiaru, daty modyfikacji lub masek rozszerzeń), walidacji spójności danych przy użyciu sum kontrolnych (MD5) oraz implementacji algorytmu ponawiania operacji (Retry logic) w przypadku wystąpienia przejściowych błędów I/O.

**Wymagane funkcje:**
- **Kopiowanie przyrostowe (Incremental Backup):** Kopiowane są wyłącznie pliki nowe lub te, których data ostatniej modyfikacji uległa zmianie w porównaniu z plikami w katalogu docelowym.
- **Złożone reguły filtracji:** Możliwość definiowania filtrów za pomocą parametrów CLI (np. `--min-size 10MB`, `--exclude *.tmp`, `--older-than 30d`).
- **Obsługa zablokowanych plików (Retry Engine):** Gdy plik jest zablokowany przez inny proces, system podejmuje $N$ prób ponownego skopiowania w odstępach $T$ milisekund przed zgłoszeniem błędu.
- **Weryfikacja sum kontrolnych:** Po zakończeniu kopiowania program porównuje hasze MD5 plików źródłowych i docelowych w celu potwierdzenia bezbłędnego transferu danych.

**Porady implementacyjne i dobre praktyki:**
Zamiast budować pełną listę plików w pamięci za pomocą `Directory.GetFiles` (co może zużyć dużo pamięci przy milionach plików), wykorzystaj metodę `Directory.EnumerateFiles`, która zwraca leniwą kolekcję `IEnumerable<string>`. Implementując logikę ponawiania prób zapisu zablokowanych plików, obsłuż specyficzny wyjątek `IOException` i wywołaj `Thread.Sleep` (lub `Task.Delay` w trybie asynchronicznym) z mechanizmem wykładniczego wydłużania czasu oczekiwania (Exponential Backoff). Do konfiguracji reguł filtrowania stwórz czytelny rekord `BackupConfiguration`.
Wzorzec projektowy: *Strategy (Strategia)* (do definiowania różnych polityk filtrowania i tworzenia kopii, np. Full vs Incremental).
