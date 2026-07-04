## 168. Serwer RADIUS TLS RadSec z Obsługą Autoryzacji EAP (RadSec TLS EAP Server)

**Szczegółowy opis i cele edukacyjne:**
Extensible Authentication Protocol (EAP) to uniwersalny protokół uwierzytelniania zdefiniowany w RFC 3748, stosowany powszechnie w sieciach bezprzewodowych Wi-Fi Enterprise (WPA-Enterprise) i sieciach przewodowych 802.1X. EAP nie narzuca konkretnej metody uwierzytelniania, lecz działa jako kontener przesyłający pakiety innych protokołów (np. EAP-TLS, EAP-MSCHAPv2). Pakiety te są hermetyzowane wewnątrz atrybutów `EAP-Message` protokołu RADIUS i transportowane bezpiecznym kanałem RadSec (TLS).
Projekt polega na rozbudowaniu serwera RadSec o pełną obsługę protokołu EAP (w szczególności EAP-TLS zgodnie z RFC 5216).
Cele edukacyjne to głębokie zrozumienie wielowarstwowej hermetyzacji protokołów (EAP inside RADIUS inside TLS), implementacja negocjacji EAP (Request/Response/Success/Failure), oraz obsługa dynamicznego tunelowania TLS wewnątrz wiadomości EAP (EAP-TLS inner handshake).

**Wymagane funkcje:**
- **Silnik negocjacji EAP (EAP State Machine):** Obsługa cyklu życia uwierzytelniania EAP – wysyłanie żądania tożsamości `EAP-Request/Identity`, odbieranie `EAP-Response/Identity`, wybór metody uwierzytelniania (EAP-TLS) i weryfikacja końcowa.
- **Implementacja metody EAP-TLS (RFC 5216):** Zaimplementowanie zagnieżdżonego uścisku dłoni TLS wewnątrz pakietów EAP. Serwer odbiera fragmenty uścisku dłoni TLS z atrybutów `EAP-Message` RADIUS, składa je w strumień, przekazuje do wewnętrznej maszyny SSL w celu weryfikacji certyfikatu użytkownika, a następnie fragmentuje i odsyła odpowiedzi TLS w pakietach `EAP-Request`.
- **Obsługa fragmentacji EAP:** Ponieważ pakiety EAP przesyłane w RADIUS mają ograniczenie rozmiaru (atrybut RADIUS może mieć maksymalnie 253 bajty), silnik musi dzielić długie certyfikaty TLS na wiele mniejszych pakietów (EAP Fragmentation) i poprawnie je scalać.
- **Zapewnienie kluczy sesyjnych (MSK generation):** Generowanie kluczy Master Session Key (MSK) z uścisku dłoni EAP-TLS, które są następnie przekazywane w atrybutach RADIUS do punktu dostępowego (Access Point) w celu szyfrowania ruchu Wi-Fi klienta (klucze WPA).

**Porady implementacyjne i dobre praktyki:**
EAP-TLS to "tunel w tunelu". Masz połączenie TLS na poziomie transportu RadSec (między routerem a serwerem RADIUS), a wewnątrz tego połączenia przesyłasz pakiety RADIUS, które w atrybutach `EAP-Message` niosą surowe bajty kolejnego, niezależnego uścisku dłoni TLS (między telefonem użytkownika a serwerem RADIUS). Do obsługi tego wewnętrznego uścisku dłoni TLS wykorzystaj systemowe interfejsy SslStream w trybie manualnym (Memory Loopback/SslStream over memory streams) w celu przechwycenia i generowania surowych bajtów handshake bez otwierania kolejnego prawdziwego socketu.
Wzorzec projektowy: *Protocol encapsulation*, *State (Stan)*, *Security Gate*.
