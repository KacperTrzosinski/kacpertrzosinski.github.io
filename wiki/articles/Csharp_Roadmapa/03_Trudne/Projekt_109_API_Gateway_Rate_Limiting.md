## 109. API Gateway z Limiterem Żądań i CORS (API Gateway Rate Limiting)

**Szczegółowy opis i cele edukacyjne:**
Ochrona API przed przeciążeniem oraz złośliwymi atakami typu DoS / Brute-Force to kluczowy element bezpieczeństwa infrastruktury. Jedną z najważniejszych technik ochrony jest Rate Limiting (ograniczanie liczby żądań na jednostkę czasu) oraz poprawna konfiguracja CORS (Cross-Origin Resource Sharing) zapobiegająca wykonywaniu zapytań z nieautoryzowanych domen zewnętrznych.
Projekt polega na stworzeniu uproszczonego API Gateway w ASP.NET Core, który przekierowuje żądania (Proxy) do wewnętrznych mikroserwisów, implementując polityki bezpieczeństwa na brzegu systemu.
Cele edukacyjne to wdrożenie polityk Rate Limiting (Token Bucket, Fixed Window, Sliding Window, Concurrency Limiter) w oparciu o wbudowane middleware w .NET 7/8, konfiguracja dynamicznych reguł CORS oraz nagłówków bezpieczeństwa HTTP (HSTS, X-Content-Type-Options, Content-Security-Policy).

**Wymagane funkcje:**
- **Silnik Rate Limitingu (Token Bucket / Fixed Window):** Konfiguracja ograniczeń żądań globalnie oraz dla poszczególnych endpointów (np. endpoint logowania ograniczony do maksymalnie 5 prób na minutę na adres IP klienta).
- **Zarządzanie limitami w Redis (Distributed Rate Limiting):** Przeniesienie liczników Rate Limitingu do bazy Redis, co pozwala na współdzielenie limitów między wieloma instancjami API Gateway za Load Balancerem.
- **Konfiguracja CORS i nagłówków bezpieczeństwa:** Ograniczenie dostępu do API wyłącznie dla autoryzowanych klientów frontendowych (Origin validation) z poprawną obsługą żądań wstępnych (Preflight OPTIONS requests).
- **Custom Error Handling:** Zwracanie poprawnego kodu statusu HTTP `429 Too Many Requests` wraz z nagłówkiem `Retry-After` informującym klienta za ile sekund może ponowić zapytanie.

**Porady implementacyjne i dobre praktyki:**
W .NET 7 i nowszych używaj przestrzeni `System.Threading.RateLimiting`. Możesz skonfigurować limiter za pomocą metody `services.AddRateLimiter(options => ...)`. Aby Rate Limiting działał poprawnie za Load Balancerem (np. Cloudflare, Nginx), upewnij się, że middleware pobiera IP klienta z nagłówka `X-Forwarded-For` po uprzednim skonfigurowaniu `ForwardedHeadersOptions`. Do implementacji rozproszonej (Distributed Rate Limiting) wykorzystaj Redis i skrypty Lua gwarantujące atomowość operacji odczytu i inkrementacji liczników.
Wzorzec projektowy: *Gateway (Brama)*, *Chain of Responsibility*, *Token Bucket Pattern*.
