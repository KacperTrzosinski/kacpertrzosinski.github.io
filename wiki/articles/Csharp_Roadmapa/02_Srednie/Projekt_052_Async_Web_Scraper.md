## 52. Asynchroniczny Web Scraper z Limitowaniem Żądań (Async Web Scraper)

**Szczegółowy opis i cele edukacyjne:**
Pobieranie danych ze stron internetowych (Web Scraping) to powszechny sposób agregacji informacji. Scraper musi pobierać dane wydajnie (wielowątkowo), ale jednocześnie odpowiedzialnie – wysłanie tysięcy zapytań w ułamku sekundy do jednego serwera doprowadzi do zablokowania naszego adresu IP, a także może przeciążyć serwer docelowy (atak DoS).
Projekt polega na stworzeniu asynchronicznego web scrapera zbierającego np. dane o cenach produktów ze wskazanego e-sklepu.
Cele edukacyjne to opanowanie programowania asynchronicznego (`async`/`await`), limitowanie stopnia współbieżności zadań za pomocą klasy `SemaphoreSlim` (throttling), bezpieczne wykonywanie żądań HTTP przy użyciu `HttpClient`, oraz podstawowe przetwarzanie wyciągniętego kodu HTML za pomocą dopasowań Regex lub prostych reguł tekstowych.

**Wymagane funkcje:**
- **Asynchroniczny silnik pobierania:** Pobieranie wielu stron internetowych jednocześnie przy użyciu `HttpClient` i zarządzanie pulą wątków.
- **Throttling i limitowanie współbieżności:** Wykorzystanie `SemaphoreSlim` do ograniczenia liczby równolegle wykonywanych żądań (np. maksymalnie 3 zapytania w tym samym czasie).
- **Rekurencyjne przeszukiwanie linków (Web Crawler):** Automatyczne wyciąganie odnośników z pobranej strony i dodawanie ich do kolejki stron do odwiedzenia (z zabezpieczeniem przed duplikatami i zapętleniami za pomocą `ConcurrentDictionary`).
- **Przetwarzanie HTML i ekstrakcja danych:** Parsowanie tagów HTML w celu wyciągnięcia metadanych, cen i tytułów produktów, a następnie zapis zebranych wyników do pliku CSV lub JSON.

**Porady implementacyjne i dobre praktyki:**
Zaimplementuj kolekcję stron do przetworzenia jako słownik bezpieczny wątkowo w celu sprawdzania unikalności odwiedzonych adresów URL. Użyj klasy `SemaphoreSlim(maxConcurrency)` przed wywołaniem metody `await client.GetStringAsync(url)`. Metoda `Release()` semafora musi znajdować się w bloku `finally`, co gwarantuje zwolnienie miejsca w semaforze nawet jeśli zapytanie HTTP rzuci wyjątek (np. błąd sieciowy 500). Respektuj plik `robots.txt` – przed rozpoczęciem scrapowania pobierz ten plik i przeanalizuj reguły `Disallow`.
Wzorzec projektowy: *Worker Pool*, *Queue* (do przechowywania linków do odwiedzenia).
