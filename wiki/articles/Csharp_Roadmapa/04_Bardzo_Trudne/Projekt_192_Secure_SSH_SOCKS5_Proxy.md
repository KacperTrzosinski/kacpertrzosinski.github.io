## 192. Szyfrowany Kanał Przekazywania SOCKS5 przez SSH (Secure SSH SOCKS5 Proxy)

**Szczegółowy opis i cele edukacyjne:**
Dynamiczne tunelowanie SOCKS5 przez SSH to świetne rozwiązanie, ale w środowiskach korporacyjnych (Enterprise) może być wykorzystywane do obchodzenia polityk bezpieczeństwa (np. przesyłania niezaszyfrowanego ruchu HTTP lub pobierania niebezpiecznych danych wewnątrz tunelu, którego tradycyjne zapory sieciowe nie mogą przeskanować). Aby temu zapobiec, profesjonalny serwer SSH musi kontrolować dynamiczny ruch proxy za pomocą wbudowanych filtrów bezpieczeństwa (Deep Packet Inspection - DPI) oraz limitowania prędkości przesyłu (Rate Limiting).
Projekt polega na rozbudowaniu serwera SSH z obsługą SOCKS5 o zaawansowane mechanizmy inspekcji pakietów, filtrowanie protokołów oraz ograniczanie pasma przepustowości dla poszczególnych kanałów.
Cele edukacyjne to implementacja mechanizmów DPI wewnątrz szyfrowanych tuneli SSH, zaawansowane zarządzanie asynchronicznym strumieniowaniem danych z limitowaniem prędkości (Token Bucket Algorithm), oraz filtrowanie domen docelowych na bazie czarnych list.

**Wymagane funkcje:**
- **Inspekcja pakietów SOCKS5 (Inner DPI):** Silnik serwera SSH analizuje strumień danych przesyłanych wewnątrz kanałów SOCKS5, wykrywając typy protokołów (np. czy w kanale przesyłany jest poprawny HTTPS, czy też ruch torrent/P2P) i blokując pakiety niezgodne z polityką bezpieczeństwa.
- **Dynamiczne limitowanie pasma (Per-Channel Rate Limiting):** Zaimplementowanie algorytmu Token Bucket (Kubełek tokenów) dla każdego aktywnego kanału SOCKS5 – ograniczenie prędkości pobierania/wysyłania (np. max 1 MB/s na użytkownika) zapobiegające zapchaniu łącza serwera.
- **Filtrowanie domen (Domain Whitelist / Blacklist):** Serwer weryfikuje domenę docelową z żądania SOCKS5 CONNECT i odrzuca połączenia do stron znajdujących się na czarnej liście (np. domeny ze złośliwym oprogramowaniem).
- **Zintegrowany panel logów i statystyk:** CLI wyświetlający w czasie rzeczywistym aktywne tunele SOCKS5, prędkości transferu dla każdego użytkownika oraz statystyki zablokowanych prób nieautoryzowanych połączeń.

**Porady implementacyjne i dobre praktyki:**
Limitowanie pasma zrealizuj asynchronicznie – zamiast wywoływać `Thread.Sleep` (co blokowałoby wątki systemu), napisz asynchroniczny strumień filtrujący (Custom Stream wrapping socket stream), który w metodzie `ReadAsync` i `WriteAsync` wylicza czas opóźnienia na podstawie algorytmu Token Bucket i asynchronicznie opóźnia wykonanie za pomocą `Task.Delay()`. Do sprawdzania domen w czasie rzeczywistym wykorzystaj strukturę drzewa Trie, co pozwoli na błyskawiczną weryfikację nawet setek tysięcy reguł w czasie $O(L)$, gdzie $L$ to długość nazwy domeny.
Wzorzec projektowy: *Decorator (Dekorator)*, *Token Bucket Rate Limiting*, *Trie Filter*.
