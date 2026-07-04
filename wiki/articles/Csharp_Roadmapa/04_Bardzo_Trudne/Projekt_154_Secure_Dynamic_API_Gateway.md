## 154. Dynamiczna Brama API z Szyfrowaniem TLS od Zera (Secure Dynamic API Gateway)

**Szczegółowy opis i cele edukacyjne:**
Brama API (API Gateway) to centralny punkt wejściowy do systemu mikroserwisów, odpowiedzialny za routing żądań, autoryzację, limitowanie ruchu oraz terminowanie połączeń SSL/TLS. W środowiskach produkcyjnych API Gateway musi umożliwiać dynamiczną zmianę konfiguracji tras (Routing rules) bez konieczności restartowania całej usługi.
Projekt polega na stworzeniu w C# od zera własnego, w pełni asynchronicznego serwera API Gateway na bazie niskopoziomowych gniazd sieciowych i strumieni.
Cele edukacyjne to terminowanie połączeń SSL/TLS bezpośrednio na socketach (`SslStream`), dynamiczne przeładowanie konfiguracji routingu z plików JSON w locie, wdrożenie autorskich middleware (Rate Limiting, JWT Auth verification, Load Balancing), oraz asynchroniczny, asymetryczny proxy-routing strumieniowy.

**Wymagane funkcje:**
- **Terminacja SSL/TLS na gniazdach (HTTPS Server):** Serwer nasłuchuje na porcie 443, akceptuje połączenia i przeprowadza asynchroniczny uścisk dłoni SSL przy użyciu certyfikatu serwera.
- **Dynamiczny silnik routingu (Dynamic Routing):** Klasa routująca, która na podstawie reguł (np. `/users/*` -> `http://user-service:5001`) przekazuje ruch HTTP do odpowiednich mikroserwisów. Zmiana pliku konfiguracyjnego wywołuje automatyczną aktualizację tras w locie bez restartu serwera (wykorzystanie `IOptionsMonitor` lub file watchers).
- **Asynchroniczny Reverse Proxy:** Serwer czyta nagłówki i treść żądania HTTP od klienta, otwiera nowe połączenie do serwisu docelowego, wysyła żądanie, odbiera odpowiedź i przekazuje ją z powrotem klientowi.
- **Wbudowane middleware o wysokiej wydajności:**
  - *Load Balancer*: Dystrybucja zapytań do wielu instancji serwisu docelowego przy użyciu algorytmów Round-Robin lub Least Connections.
  - *Rate Limiting*: Limitowanie liczby zapytań z jednego adresu IP przy użyciu algorytmu Token Bucket.

**Porady implementacyjne i dobre praktyki:**
Do budowy proxy nie używaj ASP.NET Core MVC – napisz je jako surowe middleware lub bezpośrednio na gniazdach TCP z użyciem `SocketAsyncEventArgs` oraz `System.IO.Pipelines` do bezalokacyjnego przetwarzania nagłówków HTTP. Podczas przekazywania żądań (Forwarding), musisz poprawnie obsłużyć nagłówki proxy, takie jak `X-Forwarded-For`, `X-Forwarded-Proto` oraz `X-Forwarded-Host`, aby mikroserwisy podrzędne znały prawdziwe IP i protokół klienta.
Wzorzec projektowy: *Reverse Proxy*, *Chain of Responsibility*, *Gateway*, *Load Balancer*.
