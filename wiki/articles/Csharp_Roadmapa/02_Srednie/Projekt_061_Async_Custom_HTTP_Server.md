## 61. Asynchroniczny Serwer HTTP 1.1 od Zera (Async Custom HTTP Server)

**Szczegółowy opis i cele edukacyjne:**
Zrozumienie, jak działają serwery webowe pod spodem (np. Kestrel w ASP.NET Core, Nginx) wymaga odejścia od wysokopoziomowych frameworków i napisania obsługi protokołu HTTP na surowych gniazdach TCP.
Projekt polega na stworzeniu asynchronicznego serwera zgodnego ze specyfikacją HTTP 1.1. Serwer nasłuchuje na porcie TCP, akceptuje połączenia przeglądarek internetowych, parsuje żądania HTTP (metoda, ścieżka, nagłówki), wyszukuje pliki statyczne (HTML, CSS, obrazy) w wyznaczonym folderze `wwwroot` i zwraca poprawne odpowiedzi HTTP wraz z odpowiednimi kodami statusu (200 OK, 404 Not Found, 500 Internal Server Error) i nagłówkami `Content-Type`.
Cele edukacyjne to niskopoziomowa obsługa protokołu HTTP, parsowanie nagłówków tekstowych, dynamiczne określanie typów MIME plików oraz wydajna obsługa I/O.

**Wymagane funkcje:**
- **Asynchroniczny serwer socketowy:** Nasłuchiwanie połączeń gniazd za pomocą `TcpListener` i asynchroniczne przetwarzanie żądań na puli zadań w celu obsługi wielu przeglądarek jednocześnie.
- **Parser protokołu HTTP:** Wyodrębnianie z nagłówka żądania metody (obsługa `GET` oraz `POST`), ścieżki zasobu, wersji protokołu oraz nagłówków (np. `Host`, `User-Agent`, `Content-Length`).
- **Serwowanie plików statycznych:** Bezpieczne wczytywanie i przesyłanie plików z katalogu `wwwroot` z mapowaniem rozszerzeń (np. `.html` -> `text/html`, `.png` -> `image/png`) i obsługą strumieniową dużych plików.
- **Bezpieczeństwo ścieżek (Directory Traversal Protection):** Blokowanie prób wyjścia poza katalog root serwera za pomocą ścieżek typu `http://localhost/../../windows/system32`.

**Porady implementacyjne i dobre praktyki:**
Do czytania nagłówka HTTP użyj `StreamReader`, wczytując dane linia po linii do momentu napotkania pustej linii (oznaczającej koniec sekcji nagłówków). Aby zabezpieczyć serwer przed atakiem Directory Traversal, przed odczytaniem pliku z dysku znormalizuj ścieżkę za pomocą `Path.GetFullPath` i upewnij się, że wynikowa ścieżka zaczyna się od pełnej ścieżki katalogu `wwwroot` (`path.StartsWith(wwwrootPath)`). Zwróć uwagę na nagłówek `Connection: keep-alive` – podstawowa implementacja może zamykać połączenie po każdej odpowiedzi, co jest prostsze, ale zaawansowana może wspierać wielokrotne żądania na jednym gnieździe.
Wzorzec projektowy: *Chain of Responsibility (Łańcuch odpowiedzialności)* (do routowania żądań lub nakładania filtrów/middleware).
