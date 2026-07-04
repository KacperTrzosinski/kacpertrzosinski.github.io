## 121. Szyna Zdarzeń MassTransit i RabbitMQ (MassTransit RabbitMQ Event Bus)

**Szczegółowy opis i cele edukacyjne:**
W architekturze mikroserwisowej synchroniczna komunikacja (HTTP/gRPC) prowadzi do sprzężenia czasowego (temporal coupling) – jeśli mikroserwis B leży, mikroserwis A nie może dokończyć transakcji. Nowoczesnym standardem jest asynchroniczna komunikacja oparta na zdarzeniach (Event-Driven Architecture) realizowana za pomocą brokera wiadomości (np. RabbitMQ) oraz biblioteki abstrakcji `MassTransit`.
Projekt polega na stworzeniu asynchronicznej szyny zdarzeń integrującej dwa mikroserwisy (np. OrderService i BillingService).
Cele edukacyjne to praca z brokerem RabbitMQ i biblioteką MassTransit, wdrażanie wzorca Publish-Subscribe, implementacja konsumentów wiadomości (`IConsumer<T>`), obsługa automatycznego ponawiania prób (Retry Policies), obsługa błędów za pomocą kolejek błędnych wiadomości (Dead Letter Queue - DLQ), oraz zapewnienie idempotentności przetwarzania wiadomości (Idempotency / Outbox pattern).

**Wymagane funkcje:**
- **Konfiguracja MassTransit z RabbitMQ:** Rejestracja szyny zdarzeń w kontenerze DI z konfiguracją połączeń do brokera RabbitMQ i definiowaniem punktów końcowych (Receive Endpoints).
- **Publikacja i konsumpcja zdarzeń:** Publikowanie zdarzeń integracyjnych (np. `OrderCreatedEvent`) z poziomu jednego serwisu i asynchroniczne odbieranie oraz przetwarzanie ich przez konsumentów w drugim serwisie.
- **Odporność na błędy (Retry & DLQ):** Konfiguracja polityki ponawiania prób w MassTransit (np. 3 próby z odstępem 5s) w przypadku rzucenia wyjątku przez konsumenta. Jeśli wszystkie próby zawiodą, MassTransit automatycznie przenosi wiadomość do kolejki typu `_error`.
- **Implementacja Inbox / Outbox Pattern:** Użycie MassTransit Outbox do zagwarantowania, że wiadomość zostanie opublikowana na brokerze tylko wtedy, gdy transakcja lokalnej bazy danych (np. zapis zamówienia) zakończy się pomyślnie.

**Porady implementacyjne i dobre praktyki:**
Do testowania lokalnego wykorzystaj obraz dockerowy RabbitMQ uruchomiony komendą `docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management`. Interfejs MassTransit ukrywa niskopoziomowe szczegóły tworzenia kanałów i kolejek w RabbitMQ, automatycznie konfigurując topologię na podstawie typów klas C# zdarzeń. Pamiętaj, aby klasy zdarzeń były czystymi rekordami (`public record OrderCreatedEvent(...)`) i znajdowały się we współdzielonej bibliotece klas (Shared Contracts Class Library), co ułatwi ich udostępnianie między mikroserwisami.
Wzorzec projektowy: *Publish-Subscribe*, *Transactional Outbox*, *Idempotent Consumer*.
