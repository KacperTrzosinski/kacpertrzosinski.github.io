## 88. Asynchroniczny Serwer DHCP od Zera (Async Custom DHCP Server)

**Szczegółowy opis i cele edukacyjne:**
Protokół dynamicznej konfiguracji hosta (DHCP - Dynamic Host Configuration Protocol) automatycznie przydziela adresy IP, maski sieciowe, bramy domyślne oraz adresy serwerów DNS urządzeniom podłączającym się do sieci LAN.
Projekt polega na napisaniu asynchronicznego serwera DHCP działającego na porcie UDP 67. Serwer komunikuje się z urządzeniami za pomocą komunikatów wysyłanych w trybie rozgłoszeniowym (Broadcast).
Cele edukacyjne to niskopoziomowe parsowanie pakietów binarnych protokołu DHCP/BOOTP (zgodnie z RFC 2131), asynchroniczna komunikacja UDP za pomocą gniazd sieciowych, oraz zarządzanie pulami wolnych adresów IP (IP Address Leasing) i czasem ich wygasania w bazie danych SQLite.

**Wymagane funkcje:**
- **Parser wiadomości DHCP:** Kodowanie i dekodowanie struktury binarnej DHCP (opcodes, hardware address type/length, hops, transaction ID, client/your/server IP, client hardware address - MAC).
- **Obsługa opcji DHCP (DHCP Options):** Przetwarzanie i dołączanie opcji binarnych w pakiecie (np. option 53 - DHCP Message Type, option 1 - Subnet Mask, option 3 - Router/Gateway, option 6 - Domain Name Server).
- **Cykl życia dzierżawy IP (DHCP State Machine):** Obsługa sekwencji: `DHCPDISCOVER` (wykrycie), `DHCPOFFER` (propozycja IP), `DHCPREQUEST` (żądanie) oraz `DHCPACK` (potwierdzenie dzierżawy).
- **Zarządzanie pulą adresów (Lease Manager):** Rejestrowanie przydziałów w bazie SQLite: powiązanie adresu MAC z przydzielonym adresem IP, czasem rozpoczęcia dzierżawy i czasem wygaśnięcia (Lease Time), z obsługą automatycznego zwalniania nieodnowionych adresów.

**Porady implementacyjne i dobre praktyki:**
Komunikacja DHCP odbywa się zanim urządzenie klienta ma przypisany adres IP, co oznacza konieczność wysyłania pakietów na adres rozgłoszeniowy `255.255.255.255`. Gniazdo serwera UDP musi mieć włączoną opcję `SocketOptionName.Broadcast`. Pakiet DHCP ma stały nagłówek (236 bajtów), po którym następuje sekcja opcji o zmiennej długości, zaczynająca się od unikalnego znacznika "Magic Cookie" (bajty `0x63 0x82 0x53 0x63`). Opcje są zapisywane w formacie TLV (Type-Length-Value). Wykorzystaj struktury `Span<byte>` do bezalokacyjnego parsowania i budowania pakietu DHCP.
Wzorzec projektowy: *State (Stan)*, *Flyweight*.
