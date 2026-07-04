## 113. Tło Wysyłki Maili Szablonowych z Kolejką Zadań (Async Mailer Queue)

**Szczegółowy opis i cele edukacyjne:**
Wysyłanie wiadomości e-mail w trakcie obsługi żądania HTTP (np. rejestracji użytkownika) jest złą praktyką – serwer pocztowy może odpowiedzieć z dużym opóźnieniem, co spowolni czas odpowiedzi API dla klienta. Dodatkowo, w przypadku awarii serwera SMTP, wiadomość zostanie bezpowrotnie utracona.
Projekt polega na stworzeniu asynchronicznego systemu wysyłania e-mailów opartego o szablony HTML oraz bezpieczną, trwałą kolejkę zadań w tle (Background Worker).
Cele edukacyjne to implementacja asynchronicznych usług w tle (`IHostedService` / `BackgroundService`), dynamiczne renderowanie szablonów HTML z użyciem silników szablonów (Razor Engine, Fluid lub Scriban), oraz obsługa polityki ponawiania prób (Retry Policy) z wykładniczym czasem oczekiwania (Exponential Backoff) przy użyciu bazy danych do trwałego przechowywania zadań wysyłki.

**Wymagane funkcje:**
- **Dynamiczny silnik szablonów HTML:** Wczytywanie plików szablonów HTML i dynamiczne wstrzykiwanie danych użytkownika (bindowanie modelu, np. `{Username}`) przy użyciu biblioteki Scriban lub Fluid.
- **Kolejkowanie wiadomości (Job Queue):** Endpoint rejestracji dodaje rekord do tabeli `EmailQueue` w bazie danych i natychmiast zwraca odpowiedź do klienta.
- **Background Worker Daemon:** Usługa działająca w tle (dziedzicząca po `BackgroundService`), która cyklicznie odpytuje bazę o niewysłane maile, wysyła je asynchronicznie przez SMTP/SendGrid i oznacza jako wysłane.
- **Obsługa błędów i Exponential Backoff:** Jeśli wysyłka się nie powiedzie, usługa zwiększa licznik prób i wyznacza kolejny czas wysłania (np. za 1 min, potem 5 min, potem 25 min), a po przekroczeniu limitu (np. 5 prób) oznacza mail jako `Failed` z zapisem błędu diagnostycznego.

**Porady implementacyjne i dobre praktyki:**
Do tworzenia Background Workera wykorzystaj szablon klasy `BackgroundService` i zaimplementuj pętlę wykonawczą w metodzie `ExecuteAsync(CancellationToken stoppingToken)`. Ponieważ `BackgroundService` jest rejestrowany jako `Singleton`, nie wstrzykuj do niego bezpośrednio DbContext (który jest `Scoped`). Zamiast tego wstrzyknij `IServiceScopeFactory`, stwórz zakres ręcznie przy każdym obiegu pętli (`using var scope = _scopeFactory.CreateScope()`) i pobierz DbContext z tego zakresu. Zapobiegnie to problemom z współbieżnym dostępem do bazy.
Wzorzec projektowy: *Outbox Pattern*, *Queue-Based Load Leveling*, *Worker*.
