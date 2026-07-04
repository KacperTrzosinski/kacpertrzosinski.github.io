## 111. Bramka Płatności API z Integracją Stripe / PayPal (Payment Gateway API)

**Szczegółowy opis i cele edukacyjne:**
Obsługa transakcji płatniczych to krytyczny element każdego systemu e-commerce. Wymaga on wysokiego poziomu bezpieczeństwa, poprawnego zarządzania błędami oraz niezawodnego asynchronicznego odbierania statusów płatności z zewnętrznych systemów za pomocą webhooków.
Projekt polega na stworzeniu serwisu integrującego się z bramką płatności Stripe (lub PayPal) z użyciem oficjalnego SDK lub zapytań HTTP.
Cele edukacyjne to bezpieczne nawiązywanie połączeń HTTP przy użyciu `IHttpClientFactory` z odpowiednią obsługą błędów (Transient fault handling) przy użyciu biblioteki Polly (retry, circuit breaker), kryptograficzna weryfikacja podpisów cyfrowych w przychodzących webhookach Stripe oraz zarządzanie procesem transakcyjnym (checkout session lifecycle).

**Wymagane funkcje:**
- **Inicjalizacja sesji płatności (Checkout Sessions):** Endpoint generujący token lub URL sesji płatniczej Stripe na podstawie przesłanego koszyka zakupowego, przekierowujący klienta do płatności.
- **Bezpieczny odbiorca Webhooków (Webhook Listener):** Endpoint HTTP POST odbierający powiadomienia o statusach transakcji (`payment_intent.succeeded`, `payment_intent.failed`) od Stripe.
- **Weryfikacja podpisów cyfrowych:** Rygorystyczna kryptograficzna walidacja nagłówka `Stripe-Signature` przy użyciu klucza tajnego webhooka (Webhook Signing Secret), zapobiegająca atakom typu replay i podrabianiu powiadomień.
- **Odporność na błędy sieciowe (Polly policies):** Integracja z biblioteką Polly w konfiguracji HTTP klienta, realizująca ponawianie zapytań z wykładniczym czasem oczekiwania (Exponential Backoff with Jitter) w przypadku tymczasowych błędów API Stripe.

**Porady implementacyjne i dobre praktyki:**
Nigdy nie przechowuj surowych danych kart płatniczych w bazie danych – zawsze polegaj na tokenizacji po stronie Stripe (zgodność z PCI-DSS). Webhooki mogą zostać dostarczone nie po kolei lub wielokrotnie. Zaimplementuj mechanizm idempotentności (Idempotency Key): przed przetworzeniem płatności sprawdź w bazie danych (np. za pomocą transakcji SQL lub blokady rozproszonej), czy płatność o identyfikatorze `PaymentIntentId` nie została już oznaczona jako zrealizowana, co zapobiegnie podwójnemu wysłaniu towaru do klienta.
Wzorzec projektowy: *Adapter (Adapter)*, *Strategy (Strategia)*, *Idempotent Consumer*.
