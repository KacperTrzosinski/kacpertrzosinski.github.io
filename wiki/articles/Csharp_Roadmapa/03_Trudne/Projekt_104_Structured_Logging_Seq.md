## 104. Ustrukturyzowane Logowanie Aplikacji z Serilog i Seq (Structured Logging Seq)

**Szczegółowy opis i cele edukacyjne:**
W klasycznych systemach logowania (np. zapis zwykłego tekstu do pliku) wyszukiwanie błędów lub korelacja zdarzeń w środowisku rozproszonym jest niezwykle trudna. Nowoczesnym standardem jest Ustrukturyzowane Logowanie (Structured Logging), w którym logi są zapisywane jako obiekty JSON zawierające parametry i właściwości, co umożliwia ich łatwe filtrowanie i analizę.
Projekt polega na zaimplementowaniu w aplikacji Web API zaawansowanego systemu diagnostyki opartego na bibliotece `Serilog` oraz integracji z centralnym serwerem Seq (lub ELK stack).
Cele edukacyjne to konfiguracja ustrukturyzowanego logowania, wstrzykiwanie kontekstu do logów (Enrichment, np. nazwa maszyny, wersja aplikacji, zalogowany użytkownik), implementacja mechanizmu korelacji żądań (Correlation ID) w celu śledzenia pełnej ścieżki pojedynczego żądania HTTP, oraz obsługa logowania wyjątków i parametrów wydajnościowych (Response Time).

**Wymagane funkcje:**
- **Konfiguracja Seriloga (Structured Outputs):** Zastąpienie domyślnego loggera .NET Serilogiem, z konfiguracją wyjść (Sinks): konsola, plik w formacie JSON (JSON File Sink) oraz Seq (serwer analizy logów).
- **Middleware korelacji (Correlation ID Middleware):** Autorski komponent middleware generujący unikalny identyfikator (Guid) dla każdego przychodzącego żądania HTTP, wstrzykujący go do nagłówków odpowiedzi oraz do kontekstu logowania Seriloga (`LogContext.PushProperty`).
- **Middleware wydajności (Performance Diagnostics):** Logowanie czasu trwania każdego żądania HTTP ze szczególnym oznaczeniem żądań, które trwały dłużej niż dopuszczalny próg (np. ostrzeżenie przy czasie > 500ms).
- **Logowanie strukturalne w kodzie:** Pisanie logów z parametrami (np. `Log.Information("Customer {CustomerId} placed order for {TotalAmount}", customerId, amount)`), co pozwala Seq na indeksowanie pól `CustomerId` i `TotalAmount` jako oddzielnych właściwości.

**Porady implementacyjne i dobre praktyki:**
Unikaj interpolacji stringów (np. `$"Customer {id} logged"`) wewnątrz metod logujących – uniemożliwia to ustrukturyzowane logowanie, ponieważ Serilog otrzyma gotowy, płaski tekst. Zamiast tego zawsze przekazuj szablon wiadomości i parametry jako osobne argumenty (Message Template). Seq pozwala na wyszukiwanie logów przy użyciu zapytań SQL-like, np. `TotalAmount > 1000`. Używaj odpowiednich poziomów logowania (Debug, Information, Warning, Error, Fatal) – błędy biznesowe (np. błędne hasło) to poziom `Warning`, a błędy infrastruktury (np. brak połączenia z bazą) to poziom `Error`.
Wzorzec projektowy: *Decorator*, *Middleware Pattern*.
