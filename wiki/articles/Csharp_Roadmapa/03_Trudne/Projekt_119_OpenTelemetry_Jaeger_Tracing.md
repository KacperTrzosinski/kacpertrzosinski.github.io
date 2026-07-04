## 119. Rozproszone Śledzenie Zapytań z OpenTelemetry i Jaeger (OpenTelemetry Jaeger Tracing)

**Szczegółowy opis i cele edukacyjne:**
W architekturze mikroserwisów pojedyncze kliknięcie użytkownika na froncie może uruchomić łańcuch zapytań HTTP i gRPC przechodzący przez 5 różnych serwisów i 2 bazy danych. Jeśli zapytanie zakończy się błędem lub działa wolno, znalezienie wąskiego gardła (bottleneck) jest niemożliwe bez systemu Rozproszonego Śledzenia (Distributed Tracing).
Projekt polega na zaimplementowaniu w systemie mikroserwisów pełnego śledzenia zapytań przy użyciu standardu `OpenTelemetry` i wizualizacji śladów (Spans) w narzędziu Jaeger.
Cele edukacyjne to konfiguracja OpenTelemetry SDK w C#, automatyczna i ręczna instrumentacja kodu (śledzenie zapytań HTTP, zapytań SQL przez EF Core, wywołań gRPC), oraz propagacja kontekstu śledzenia (Context Propagation) przez nagłówki sieciowe (W3C Trace Context) w celu powiązania asynchronicznych operacji w jedno drzewo wywołań (Trace).

**Wymagane funkcje:**
- **Inicjalizacja OpenTelemetry Tracing:** Konfiguracja zbierania danych telemetrycznych w pliku `Program.cs` dla źródeł: `Microsoft.AspNetCore`, `System.Net.Http` (HttpClient) oraz `Npgsql` / `Microsoft.Data.SqlClient`.
- **Eksporter OTLP (OpenTelemetry Protocol):** Konfiguracja przesyłania zebranych śladów (Traces) do lokalnego kolektora Jaeger przy użyciu protokołu gRPC/HTTP OTLP.
- **Ręczna instrumentacja (Custom Activity):** Tworzenie autorskich jednostek śledzenia (`ActivitySource` oraz `Activity`) wewnątrz newralgicznych algorytmów biznesowych w celu dokładnego mierzenia czasu ich wykonania z dodawaniem tagów diagnostycznych (np. `activity.SetTag("order.id", orderId)`).
- **Propagacja kontekstu:** Konfiguracja klientów HTTP i gRPC tak, aby automatycznie dołączały nagłówek `traceparent` do żądań sieciowych, a mikroserwisy odbierające poprawnie odczytywały ten nagłówek i kontynuowały ten sam ślad.

**Porady implementacyjne i dobre praktyki:**
Do tworzenia i zarządzania śladami w kodzie C# używaj standardowej klasy `System.Diagnostics.Activity` (która w standardzie .NET reprezentuje pojęcie "Span" z OpenTelemetry). Przed rozpoczęciem nowej aktywności sprawdź czy logger jest aktywny, np. `using var activity = myActivitySource.StartActivity("ProcessPayment")`. Tagi (Attributes) dodawane do aktywności pomagają w późniejszym wyszukiwaniu konkretnych transakcji w Jaegerze. Unikaj logowania wrażliwych danych (np. haseł czy numerów kart) jako tagów w traces.
Wzorzec projektowy: *Observer*, *Chain of Responsibility*, *Interceptor*.
