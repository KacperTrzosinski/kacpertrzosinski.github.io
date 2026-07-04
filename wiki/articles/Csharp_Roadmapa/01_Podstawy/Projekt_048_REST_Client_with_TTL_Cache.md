## 48. Klient REST w Konsoli z Cache i Wygasaniem TTL (REST Client with TTL Cache)

**Szczegółowy opis i cele edukacyjne:**
Pobieranie danych z sieci Web API przy użyciu protokołu HTTP to podstawa integracji systemów. Częste odpytywanie serwerów zewnętrznych o te same dane (np. kursy walut, dane pogodowe) generuje jednak niepotrzebny ruch sieciowy i może prowadzić do zablokowania naszej aplikacji (rate limiting).
Projekt polega na stworzeniu konsolowego klienta HTTP odpytującego publiczne REST API (np. JSONPlaceholder lub OpenWeatherMap), z wbudowaną lokalną warstwą buforowania (Caching Layer) zapisaną w pamięci RAM. Każdy wpis w cache ma zdefiniowany czas życia (TTL - Time to Live).
Cele edukacyjne to praca z klasą `HttpClient` (poprawne zarządzanie jej cyklem życia), asynchroniczne wysyłanie żądań HTTP (`async`/`await`), parsowanie odpowiedzi JSON oraz implementacja mechanizmu cache opartego na słownikach z automatycznym wygaszaniem przeterminowanych danych.

**Wymagane funkcje:**
- **Wydajne żądania HTTP:** Pobieranie danych z zewnętrznego serwisu przy użyciu jednej, współdzielonej instancji klasy `HttpClient`.
- **Warstwa buforowania w pamięci:** Wyszukiwanie wyników w lokalnym słowniku cache przed wysłaniem zapytania sieciowego.
- **Zarządzanie czasem życia (TTL):** Automatyczna walidacja czasu zapisu w cache. Jeśli dane są starsze niż np. 60 sekund, cache jest ignorowany i wysyłane jest nowe zapytanie do serwera API.
- **Polityka czyszczenia cache (Eviction Policy):** Okresowe usuwanie przeterminowanych wpisów ze słownika w tle za pomocą lekkiego zadania okresowego (`Task`).

**Porady implementacyjne i dobre praktyki:**
Nigdy nie twórz nowej instancji `HttpClient` wewnątrz bloku `using` dla każdego zapytania – prowadzi to do wyczerpania gniazd sieciowych systemu operacyjnego (Socket Exhaustion). Użyj jednego, statycznego obiektu `HttpClient` lub wykorzystaj wzorzec `IHttpClientFactory` (dostępny w bardziej rozbudowanych aplikacjach). Słownik cache zaimplementuj jako klasę `SimpleCache<TKey, TValue>`, gdzie wartością jest struktura `CacheEntry<TValue>` zawierająca pobrany obiekt oraz znacznik czasu `DateTime CreatedAt`. Obsługuj błędy sieciowe (np. brak połączenia, kody statusu HTTP 500/404) zwracając przyjazne komunikaty lub pobierając ostatnie poprawne, nawet przeterminowane dane z cache jako mechanizm fallback.
Wzorzec projektowy: *Proxy (Pełnomocnik)* (gdzie usługa cache pośredniczy w dostępie do klienta HTTP).
