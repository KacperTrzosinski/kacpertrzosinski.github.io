## 172. Serwer SSH z Obsługą Tunelowania Portów TCP (SSH Port Forwarding Server)

**Szczegółowy opis i cele edukacyjne:**
Tunelowanie portów przez SSH (SSH Port Forwarding / SSH Tunneling) to potężna technika sieciowa pozwalająca na bezpieczne przekazywanie ruchu sieciowego z lokalnego portu na maszynę zdalną (Local Port Forwarding) lub odwrotnie (Remote Port Forwarding) wewnątrz zaszyfrowanego kanału SSH. Jest to standard branżowy do bezpiecznego łączenia się z bazami danych wewnątrz zamkniętych chmur prywatnych.
Projekt polega na rozbudowaniu wiersza poleceń Twojego serwera SSH o pełne wsparcie dla tunelowania portów TCP (zgodnie ze specyfikacją protokołu SSH transport layer i connection protocol).
Cele edukacyjne to zaawansowana praca z wielokanałowymi połączeniami SSH, obsługa mechanizmów multipleksowania wielu niezależnych strumieni TCP (Channels) wewnątrz jednego szyfrowanego tunelu SSH, asynchroniczny routing danych sieciowych, oraz dynamiczne bindy gniazd TCP.

**Wymagane funkcje:**
- **Local Port Forwarding (L-tunnel):** Klient łączy się z serwerem i żąda otwarcia lokalnego portu $P_1$ (np. na komputerze klienta), z którego ruch jest asynchronicznie przesyłany tunelem SSH do serwera i stamtąd kierowany na docelowy serwer/port (np. baza danych SQL na serwerze).
- **Remote Port Forwarding (R-tunnel):** Klient żąda od serwera SSH zbindowania portu $P_2$ na maszynie serwera. Każde nowe połączenie przychodzące na port serwera $P_2$ jest przekazywane tunelem SSH z powrotem do klienta (przydatne do wystawiania lokalnych usług na publiczny adres IP).
- **Zarządzanie kanałami SSH (SSH Channels):** Parsowanie i odpowiadanie na komendy protokołu SSH: `tcpip-forward` (rozpoczęcie tunelowania zdalnego) oraz otwieranie kanałów typu `direct-tcpip` (dla tunelowania lokalnego).
- **Wielowątkowy router strumieni (Full Duplex forwarder):** Dynamiczne i asynchroniczne kopiowanie bajtów między gniazdem TCP a kanałem SSH w obu kierunkach z minimalnym opóźnieniem.

**Porady implementacyjne i dobre praktyki:**
W celu optymalizacji wydajności i zmniejszenia zużycia CPU, do asynchronicznego przekazywania danych między strumieniem sieciowym gniazda TCP a strumieniem kanału SSH wykorzystaj metodę `Stream.CopyToAsync()`. Pamiętaj o obsłudze bezpieczeństwa – serwer powinien posiadać konfigurację (Access Control List - ACL) definiującą, którzy zalogowani użytkownicy mają uprawnienia do otwierania tuneli oraz na jakie docelowe adresy IP i porty wolno im przekazywać ruch (ochrona przed nieautoryzowanym skanowaniem wewnętrznej sieci serwera).
Wzorzec projektowy: *Proxy (Pełnomocnik)*, *Multiplexer*, *Bridge (Most)*.
