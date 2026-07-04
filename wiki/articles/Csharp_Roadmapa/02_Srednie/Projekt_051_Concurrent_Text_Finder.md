## 51. Współbieżna Wyszukiwarka Tekstowa (Concurrent Text Finder)

**Szczegółowy opis i cele edukacyjne:**
Projekt polega na stworzeniu narzędzia konsolowego, które przeszukuje tysiące plików tekstowych (np. kod źródłowy, pliki dziennika) w wybranym katalogu w poszukiwaniu określonej frazy lub wzorca Regex. Aby operacja była jak najszybsza, wyszukiwarka musi wykonywać skanowanie współbieżnie (na wielu wątkach).
Głównym celem edukacyjnym na poziomie średniozaawansowanym jest głębokie zrozumienie asynchroniczności oraz wielowątkowości w .NET z wykorzystaniem biblioteki TPL (Task Parallel Library). Student uczy się programować współbieżnie za pomocą klasy `Parallel` oraz asynchronicznych zadań (`Task`), a także opanowuje poprawne użycie współbieżnych kolekcji (`ConcurrentDictionary`, `ConcurrentBag`) do zbierania wyników wyszukiwania bez wyścigów (race conditions).

**Wymagane funkcje:**
- **Asynchroniczne skanowanie dysku:** Rekurencyjne pobieranie listy plików z monitorowaniem postępu, realizowane asynchronicznie, aby nie blokować interfejsu CLI.
- **Równoległe przetwarzanie plików (TPL):** Użycie `Parallel.ForEachAsync` (dostępne w .NET 6+) lub `Parallel.ForEach` do jednoczesnego skanowania zawartości wielu plików przez wątki z puli.
- **Bezpieczny zbiór wyników:** Zbieranie informacji o dopasowaniach (nazwa pliku, numer linii, treść linii) wewnątrz słownika `ConcurrentDictionary<string, List<TextMatch>>`.
- **Raport wydajności:** Wyświetlenie czasu wykonania operacji, liczby przeszukanych megabajtów na sekundę oraz liczby wątków zaangażowanych w zadanie.

**Porady implementacyjne i dobre praktyki:**
Unikaj naiwnego tworzenia pojedynczego obiektu `new Task(...)` dla każdego pliku, ponieważ przy setkach tysięcy małych plików narzut na zarządzanie zadaniami (task scheduling overhead) zrujnuje wydajność. Biblioteka TPL automatycznie dzieli pracę na odpowiednie porcje (chunks) dopasowane do liczby rdzeni procesora. Zadbaj o asynchroniczne czytanie plików za pomocą `File.ReadAllLinesAsync` lub strumieniowo. Wykorzystaj strukturę `CancellationTokenSource`, aby dać użytkownikowi możliwość natychmiastowego przerwania wyszukiwania (np. klawiszem Escape) w bezpieczny sposób.
Wzorzec projektowy: *Producer-Consumer (Producent-Konsument)*, *Async Pipeline*.
