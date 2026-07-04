## 123. Zbieranie Metryk Aplikacji Prometheus & Grafana (Prometheus Grafana Metrics)

**Szczegółowy opis i cele edukacyjne:**
Utrzymywanie systemów produkcyjnych wymaga stałego śledzenia ich kondycji (Observability). Oprócz logów i rozproszonego śledzenia (tracing), kluczowe są metryki ilościowe (np. liczba obsłużonych żądań na sekundę, średni czas odpowiedzi API, obciążenie procesora, liczba aktywnych wątków oraz alokacje pamięci RAM).
Projekt polega na zaimplementowaniu zbierania metryk w usłudze Web API przy użyciu biblioteki `prometheus-net` oraz wizualizacji danych na dedykowanym dashboardzie w narzędziu `Grafana`.
Cele edukacyjne to zrozumienie modelu danych Prometheus (Time Series, Labels), tworzenie i eksponowanie endpointu `/metrics` w formacie tekstowym odpytywanym przez Prometheusa (Pull model), oraz definiowanie własnych metryk biznesowych (Counter, Gauge, Histogram).

**Wymagane funkcje:**
- **Endpoint eksportu metryk:** Integracja middleware `prometheus-net` w celu automatycznego wystawienia endpointu `/metrics` zbierającego metryki systemowe (GC memory usage, Thread Pool threads, Process CPU load).
- **Metryki żądań HTTP (Built-in HTTP instrumentation):** Automatyczny pomiar czasu trwania żądań HTTP i zliczanie kodów statusu odpowiedzi (np. liczba błędów 5xx).
- **Autorskie metryki biznesowe (Custom Metrics):** Zaimplementowanie:
  - `Counter` (np. liczba zarejestrowanych użytkowników, liczba sprzedanych produktów).
  - `Gauge` (np. liczba aktualnie zalogowanych użytkowników w czasie rzeczywistym).
  - `Histogram` (np. pomiar czasu przetwarzania płatności z podziałem na percentyle).
- **Zintegrowany plik konfiguracyjny Docker Compose:** Przygotowanie infrastruktury składającej się z aplikacji .NET, kontenera Prometheus (odpytującego aplikację) oraz kontenera Grafana (prezentującego wykresy).

**Porady implementacyjne i dobre praktyki:**
Unikaj dodawania zbyt wielu dynamicznych wartości jako etykiet (Labels) w metrykach Prometheusa – zjawisko to nazywa się wysoką kardynalnością (High Cardinality) i może doprowadzić do przeciążenia pamięci serwera Prometheus (np. zapisywanie adresu e-mail użytkownika jako etykiety wygeneruje miliony osobnych serii czasowych). Jako etykiety dodawaj wyłącznie wartości o skończonym, małym zbiorze (np. nazwa metody HTTP `GET`/`POST`, kod statusu `200`/`500`, czy nazwa kraju).
Wzorzec projektowy: *Observer (Obserwator)*, *Metrics Collector*.
