## 73. Asynchroniczny Serwer i Klient DNS od Zera (Async Custom DNS Server)

**Szczegółowy opis i cele edukacyjne:**
System Nazw Domenowych (DNS) tłumaczy nazwy domenowe czytelne dla człowieka (np. `google.com`) na adresy IP maszyn (np. `142.250.180.206`). Zrozumienie sposobu kodowania zapytań i odpowiedzi DNS oraz niskopoziomowego przesyłu UDP to fundamentalna wiedza sieciowa.
Projekt polega na stworzeniu asynchronicznego serwera DNS (nasłuchującego na porcie UDP 53) oraz klienta DNS. Serwer parsuje zapytania DNS, wyszukuje wpisy w lokalnej bazie danych (pliku tekstowym typu hosts) lub przekazuje zapytania dalej (Upstream Forwarding) do serwerów takich jak Cloudflare (`1.1.1.1`) lub Google (`8.8.8.8`).
Cele edukacyjne to niskopoziomowa manipulacja bajtami, parsowanie binarnego formatu wiadomości DNS (zgodnie z RFC 1035), obsługa kompresji nazw domenowych w pakietach binarnych oraz asynchroniczna komunikacja UDP za pomocą `UdpClient`.

**Wymagane funkcje:**
- **Parser binarnych pakietów DNS:** Kodowanie i dekodowanie nagłówka DNS (identyfikator, flagi operacji, liczba pytań/odpowiedzi) oraz sekcji pytań (QName, QType, QClass).
- **Obsługa rekordów DNS:** Przetwarzanie i zwracanie rekordów typu: `A` (IPv4), `AAAA` (IPv6), `CNAME` (alias), `MX` (serwer pocztowy) oraz `TXT` (tekst).
- **Kompresja nazw domowych (DNS Name Compression):** Wdrożenie dekompresji wskaźników bajtowych (byte offsets) w nazwach domenowych w celu poprawnego odczytania pakietów zoptymalizowanych przez inne serwery.
- **Upstream Forwarder z Cache:** Jeśli domeny brak w lokalnej bazie, serwer przesyła zapytanie do serwera zewnętrznego, zapisuje odpowiedź w lokalnym cache z uwzględnieniem czasu TTL rekordu i zwraca odpowiedź klientowi.

**Porady implementacyjne i dobre praktyki:**
Pakiety DNS przesyłane są w sieci jako Big-Endian. Użyj struktur `Span<byte>` oraz klasy `BinaryPrimitives` do poprawnego konwertowania bajtów na liczby całkowite i odwrotnie. Dekompresja nazw polega na sprawdzaniu, czy dwa najbardziej znaczące bity bajtu długości etykiety to `11` (czyli wartość `0xC0`). Jeśli tak, kolejne bajty stanowią offset w pakiecie do początku nazwy domeny. Pamiętaj, aby serwer działał asynchronicznie – metoda `ReceiveAsync()` klasy `UdpClient` powinna działać w niekończącej się pętli obsługiwanej przez wątek tła.
Wzorzec projektowy: *Chain of Responsibility (Łańcuch odpowiedzialności)* (dla wyszukiwania rekordów: Local DB -> Cache -> Upstream DNS).
