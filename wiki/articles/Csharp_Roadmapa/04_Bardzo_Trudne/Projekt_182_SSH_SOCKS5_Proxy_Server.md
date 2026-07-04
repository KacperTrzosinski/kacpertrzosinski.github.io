## 182. Serwer SSH z Obsługą Przekazywania Portów SOCKS5 (SSH SOCKS5 Proxy Server)

**Szczegółowy opis i cele edukacyjne:**
Oprócz tunelowania statycznego (L-tunnel i R-tunnel, gdzie bindujemy konkretny port na konkretny port docelowy), protokół SSH umożliwia Tunelowanie Dynamiczne (Dynamic Port Forwarding). Działa ono w oparciu o protokół proxy SOCKS5 (RFC 1928). Klient konfiguruje przeglądarkę internetową tak, aby używała tunelu SSH jako serwera proxy SOCKS5. Wtedy wszystkie żądania sieciowe (np. przeglądanie stron www) są przesyłane bezpiecznym tunelem SSH do serwera, a serwer SSH dynamicznie otwiera połączenia do dowolnych adresów docelowych w locie.
Projekt polega na rozbudowaniu serwera SSH o pełną obsługę dynamicznego tunelowania SOCKS5.
Cele edukacyjne to implementacja protokołu proxy SOCKS5, asynchroniczna negocjacja metod uwierzytelniania w SOCKS5 (No Authentication), parsowanie żądań nawiązania połączenia TCP (SOCKS5 CONNECT request), obsługa rozstrzygania nazw hostów (DNS lookup) po stronie serwera proxy, oraz dynamiczne multipleksowanie kanałów w sesji SSH.

**Wymagane funkcje:**
- **Dynamic Port Forwarding engine (SOCKS5 Proxy):** Serwer SSH nasłuchuje na żądania otwarcia dynamicznego kanału typu `dynamic-forward` z tunelu SSH.
- **Implementacja protokołu SOCKS5 (RFC 1928):** Serwer parsuje binarny protokół powitalny SOCKS5:
  - Faza 1 (Negotiation): Klient wysyła listę wspieranych metod uwierzytelniania (wybór metody `0x00` - bez autoryzacji).
  - Faza 2 (Request): Klient wysyła strukturę żądania: polecenie (CONNECT `0x01`), typ adresu (IPv4, Domain Name, IPv6) oraz docelowy port.
- **Rozstrzyganie nazw (DNS lookup):** Obsługa typu adresu `0x03` (Domain Name) – serwer odczytuje nazwę hosta (np. `google.com`) przesyłaną jako ciąg bajtów i asynchronicznie pobiera jego adres IP.
- **Router dynamicznych połączeń:** Po udanej negocjacji SOCKS5 serwer dynamicznie inicjuje połączenie TCP do wskazanego hosta i asynchronicznie przesyła dane w obie strony, symulując pełne działanie bramy proxy.

**Porady implementacyjne i dobre praktyki:**
Protokół SOCKS5 przesyła dane binarne (np. port jako 2 bajty w formacie Big-Endian). Do parsowania nagłówka żądania i typów adresów wykorzystaj `ReadOnlySpan<byte>`. Przy typie adresu `Domain Name` pierwszy bajt to długość nazwy domeny $L$, po której następuje dokładnie $L$ znaków ASCII. Zaimplementuj obsługę błędów – jeśli docelowy host nie odpowiada, serwer SOCKS5 musi odesłać do klienta odpowiednią binarną ramkę statusu błędu (np. `0x04` Host Unreachable) i natychmiast zamknąć powiązany kanał SSH, co zapobiegnie wiszeniu martwych socketów w systemie.
Wzorzec projektowy: *Proxy (Pełnomocnik)*, *Bridge (Most)*, *State (Stan)*.
