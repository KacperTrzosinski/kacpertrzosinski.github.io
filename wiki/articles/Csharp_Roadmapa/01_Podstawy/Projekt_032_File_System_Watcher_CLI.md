## 32. Narzędzie CLI do Monitorowania Zmian w Folderze (File System Watcher CLI)

**Szczegółowy opis i cele edukacyjne:**
Monitorowanie aktywności systemu plików jest niezbędne w systemach automatyzacji (np. automatyczne przebudowywanie kodu po edycji pliku - Live Reload, systemy backupów, audyt bezpieczeństwa). Projekt polega na stworzeniu narzędzia wiersza poleceń, które śledzi wszystkie modyfikacje, tworzenie, usuwanie oraz zmiany nazw plików i folderów we wskazanym katalogu.
Cel edukacyjny to opanowanie obsługi asynchronicznych zdarzeń systemowych za pomocą klasy `System.IO.FileSystemWatcher`, poprawne radzenie sobie z problemem wielokrotnego wywoływania zdarzeń (debouncing system events) oraz bezpieczna współbieżność – zapis historii zmian w pliku dziennika bez blokowania wątku monitorującego.

**Wymagane funkcje:**
- **Śledzenie zmian w czasie rzeczywistym:** Wykorzystanie klasy `FileSystemWatcher` do przechwytywania zdarzeń `Created`, `Changed`, `Deleted` oraz `Renamed` (w tym rekurencyjne śledzenie podfolderów).
- **Filtrowanie zdarzeń:** Obsługa filtrów rozszerzeń (np. monitorowanie tylko plików `.config` lub `.json`) oraz ignorowanie określonych folderów (np. `.git` czy `bin/obj`).
- **Mechanizm debouncingu:** Grupowanie powtarzających się zdarzeń dla jednego pliku (często system operacyjny zgłasza kilka zdarzeń `Changed` przy pojedynczym zapisie pliku przez edytor) za pomocą krótkiego bufora czasowego.
- **Logowanie asynchroniczne z rotacją:** Zapis zdarzeń do pliku dziennika w formacie CSV z mechanizmem rotacji (np. nowy plik logu po przekroczeniu 5MB).

**Porady implementacyjne i dobre praktyki:**
Pamiętaj, że zdarzenia klasy `FileSystemWatcher` są wywoływane na wątkach z puli wątków systemowych (ThreadPool), a nie na głównym wątku aplikacji. Wszelkie operacje zapisu do wspólnych zasobów (jak plik logu lub lista w pamięci) muszą być odpowiednio synchronizowane (np. za pomocą `lock` lub użycia bezpiecznych struktur danych). Ustaw właściwość `NotifyFilter`, aby precyzyjnie określić, jakie zmiany Cię interesują (np. tylko nazwa pliku i data ostatniego zapisu), co zmniejszy obciążenie kolejki zdarzeń systemu operacyjnego i zapobiegnie błędowi przepełnienia bufora (`InternalBufferOverflowException`).
Wzorzec projektowy: *Observer (Obserwator)* realizowany systemowo, *Command* do zapisu zdarzeń.
