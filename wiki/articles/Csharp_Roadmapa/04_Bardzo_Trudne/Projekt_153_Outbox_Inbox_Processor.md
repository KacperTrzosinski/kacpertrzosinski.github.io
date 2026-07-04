## 153. Skalowalna Wymiana Danych ze Wzorcem Outbox/Inbox (Outbox Inbox Processor)

**Szczegółowy opis i cele edukacyjne:**
W architekturze zorientowanej na zdarzenia (EDA) częstym problemem jest utrata spójności między zapisem w bazie danych a wysłaniem zdarzenia do brokera wiadomości (np. zapisujemy zamówienie w SQL, ale przed wysłaniem zdarzenia `OrderCreated` do RabbitMQ pada sieć lub broker). Aby zapewnić gwarancję dostarczenia wiadomości przynajmniej raz (At-Least-Once Delivery), stosuje się wzorce Transactional Outbox (dla nadawcy) oraz Transactional Inbox (dla odbiorcy, chroniący przed duplikatami wiadomości).
Projekt polega na stworzeniu wydajnego, asynchronicznego procesora Outbox/Inbox integrującego aplikację ASP.NET Core z bazą SQL.
Cele edukacyjne to wdrożenie wzorca Outbox/Inbox od podstaw, zapewnienie pełnej spójności transakcyjnej (Dual-write problem mitigation), konfiguracja asynchronicznych wątków działających w tle (Background Services), oraz eliminacja duplikatów wiadomości (Idempotency check).

**Wymagane funkcje:**
- **Transactional Outbox Engine:** Podczas zapisu biznesowego (np. dodanie nowego klienta) w tej samej transakcji bazy danych zapisywany jest wiersz w tabeli `OutboxMessages` (zawierający zserializowaną wiadomość). Gwarantuje to, że jeśli baza danych odrzuci transakcję, wiadomość nie zostanie opublikowana.
- **Background Outbox Publisher (Publisher Worker):** Usługa działająca w tle (`IHostedService` / `BackgroundService`), która cyklicznie (np. co 500ms) odpytuje tabelę `OutboxMessages` w poszukiwaniu niewysłanych wiadomości, publikuje je na brokerze (np. RabbitMQ/MassTransit) i oznacza jako wysłane.
- **Transactional Inbox Engine (Duplicate Detector):** Mikroserwis odbierający wiadomość zapisuje jej unikalny identyfikator (`MessageId`) w tabeli `InboxMessages` w ramach transakcji przetwarzania tej wiadomości. Jeśli wiadomość o danym ID znajduje się już w tabeli, przetwarzanie jest natychmiast przerywane (ochrona przed duplikatami).
- **Zoptymalizowany mechanizm blokowania (Row Locking):** Użycie blokad w zapytaniach SQL (np. `SELECT FOR UPDATE` lub `UPDLOCK`) przez Background Worker w celu uniknięcia jednoczesnego przetwarzania tych samych rekordów Outbox przez wiele instancji serwera.

**Porady implementacyjne i dobre praktyki:**
Przy projektowaniu tabeli Outbox wykorzystaj techniki zapobiegające blokowaniu bazy. Zamiast usuwać rekordy z tabeli zaraz po wysłaniu, oznaczaj je flagą `ProcessedAtUtc`. Następnie stwórz dodatkowy proces usuwający (Cleanup Job) stare, przetworzone rekordy raz na dobę. Do optymalizacji odpytywania tabeli Outbox przez Background Worker wykorzystaj biblioteki typu `Quartz.NET` lub zaawansowane mechanizmy powiadomień w bazie danych (np. `LISTEN/NOTIFY` w PostgreSQL), co eliminuje narzut ciągłego odpytywania bazy (Polling).
Wzorzec projektowy: *Transactional Outbox*, *Transactional Inbox*, *Idempotent Consumer*.
