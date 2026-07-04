## 127. Serwer FTP z Obsługą Szyfrowania SSL/TLS FTPS (FTPS Secure Server)

**Szczegółowy opis i cele edukacyjne:**
Tradycyjny protokół FTP przesyła hasła i dane otwartym tekstem, co ułatwia ich podsłuchanie. Standardem zapewniającym bezpieczeństwo jest FTPS (FTP over SSL/TLS), który szyfruje sesje sterujące oraz kanały przesyłu danych za pomocą certyfikatów SSL/TLS.
Projekt polega na rozbudowaniu asynchronicznego serwera FTP na socketach o pełną obsługę protokołu FTPS (Explicit FTPS zgodnie z RFC 2228).
Cele edukacyjne to zaawansowana komunikacja sieciowa na bazie gniazd, obsługa bezpiecznych strumieni `SslStream` z asynchronicznym uwierzytelnianiem certyfikatu serwera (SSL Handshake), dynamiczne przełączanie strumienia sieciowego z trybu tekstowego na szyfrowany po komendzie `AUTH TLS`, oraz obsługa bezpiecznych połączeń dla kanału danych (Passive FTPS mode).

**Wymagane funkcje:**
- **Explicit FTPS Handshake:** Serwer nasłuchuje standardowo na porcie 21. Po otrzymaniu od klienta komendy `AUTH TLS` (lub `AUTH SSL`), serwer inicjuje bezpieczne połączenie SSL na dotychczasowym strumieniu kontrolnym przy użyciu klasy `SslStream` i certyfikatu X.509.
- **Bezpieczny kanał danych (PROT P):** Obsługa komend negocjacji ochrony danych: `PBSZ 0` (Protection Buffer Size) oraz `PROT P` (Private data channel). Gdy kanał jest prywatny, każde połączenie do przesyłu danych (np. listowanie katalogu, pobranie pliku) musi być szyfrowane za pomocą `SslStream`.
- **Zarządzanie certyfikatami X.509:** Ładowanie certyfikatu serwera (np. z pliku `.pfx` z hasłem) i autoryzacja tożsamości serwera w bezpiecznym strumieniu.
- **Asynchroniczny silnik wielowątkowy:** Pełna asynchroniczność obsługi poleceń FTPS i równoległych transferów plików na zoptymalizowanych wątkach systemowych.

**Porady implementacyjne i dobre praktyki:**
W .NET do szyfrowania połączeń sieciowych służy klasa `System.Net.Security.SslStream`. Tworząc bezpieczny strumień, owiń bazowy `NetworkStream` gniazda, np. `var sslStream = new SslStream(networkStream, false);`. Następnie wywołaj asynchronicznie `await sslStream.AuthenticateAsServerAsync(serverCertificate);`. Pamiętaj, że po udanym handshake wszystkie kolejne polecenia od klienta i odpowiedzi serwera muszą być odczytywane i zapisywane przez `sslStream`, a nie bazowy `networkStream`.
Wzorzec projektowy: *Decorator (Dekorator)* (do nakładania warstwy SSL na strumień), *State (Stan)*.
