## 146. Serwer API typu gRPC-Web z Transpilacją (Custom gRPC-Web Proxy)

**Szczegółowy opis i cele edukacyjne:**
Standard gRPC wymaga protokołu transportowego HTTP/2 z obsługą zwiastunów (HTTP/2 Trailers) do zwracania statusów wykonania. Ponieważ przeglądarki internetowe nie dają bezpośredniego dostępu do niskopoziomowych mechanizmów HTTP/2 z poziomu JavaScriptu, klienci webowi nie mogą bezpośrednio łączyć się z klasycznymi serwerami gRPC. Rozwiązaniem jest gRPC-Web – protokół, który przesyła ramki gRPC zakodowane w Base64 lub binarnie przez standardowe połączenie HTTP/1.1.
Projekt polega na stworzeniu własnego serwera pośredniczącego (Reverse Proxy) typu gRPC-Web w C#. Serwer nasłuchuje na żądania HTTP/1.1 gRPC-Web od przeglądarki, parsuje specyficzne ramki, otwiera połączenie gRPC (HTTP/2) do docelowego mikroserwisu backendowego, przekazuje zapytanie, a następnie konwertuje odpowiedź HTTP/2 i zwiastuny (trailers) z powrotem na format gRPC-Web i przesyła przeglądarce.
Cele edukacyjne to niskopoziomowa manipulacja protokołami HTTP/1.1 i HTTP/2, parsowanie specyficznych ramkowych formatów gRPC-Web (Frame flag + data length + payload), oraz asynchroniczny routing strumieniowy (Stream forwarding).

**Wymagane funkcje:**
- **Silnik nasłuchujący HTTP/1.1 (Kestrel / Custom endpoint):** Serwer przyjmuje zapytania gRPC-Web typu POST z nagłówkiem `Content-Type: application/grpc-web` lub `application/grpc-web-text` (Base64).
- **Dekoder i koder ramek gRPC-Web:** Wyodrębnianie nagłówka ramki gRPC-Web (1 bajt flagi: 0 dla danych, 128/0x80 dla zwiastunów, oraz 4 bajty określające długość), dekodowanie zawartości Base64 w razie potrzeby.
- **Transkodowanie do HTTP/2 gRPC backendu:** Otwarcie asynchronicznego połączenia HTTP/2 przy użyciu `HttpClient` z wymuszeniem wersji protokołu HTTP/2 (`HttpVersionPolicy.RequestVersionOrHigher`), wysłanie zdekodowanych ramek do backendowego serwera gRPC.
- **Konwersja zwiastunów (Trailers conversion):** Przechwycenie zwiastunów HTTP/2 (np. `grpc-status`, `grpc-message`) z odpowiedzi backendu i doklejenie ich jako specjalnej końcowej ramki gRPC-Web oznaczonej flagą 0x80 na końcu strumienia odpowiedzi HTTP/1.1.

**Porady implementacyjne i dobre praktyki:**
Do budowy proxy wykorzystaj lekki komponent ASP.NET Core Middleware. Strumieniowanie odpowiedzi realizuj asynchronicznie, przekazując dane na bieżąco za pomocą `HttpResponse.Body.WriteAsync()`, co zapobiega buforowaniu całej odpowiedzi w pamięci i zapewnia minimalne opóźnienia transmisji. W przypadku protokołu `application/grpc-web-text`, cała odpowiedź przesyłana przeglądarce (wraz z nagłówkami ramki) musi być spakowana w Base64 – koduj paczki danych w Base64 przed wysłaniem na strumień odpowiedzi.
Wzorzec projektowy: *Proxy (Pełnomocnik)*, *Adapter (Adapter)*.
