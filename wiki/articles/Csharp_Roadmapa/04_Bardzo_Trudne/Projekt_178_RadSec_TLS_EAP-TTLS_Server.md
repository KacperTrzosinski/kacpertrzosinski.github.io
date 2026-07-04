## 178. Serwer RADIUS TLS RadSec z Uwierzytelnianiem EAP-TTLS (RadSec TLS EAP-TTLS Server)

**Szczegółowy opis i cele edukacyjne:**
Uwierzytelnianie EAP-TLS wymaga posiadania certyfikatu X.509 przez każde urządzenie klienckie (telefon, laptop), co jest trudne w konfiguracji i utrzymaniu w dużych organizacjach. Rozwiązaniem kompromisowym jest protokół EAP-TTLS (Tunneled Transport Layer Security - RFC 5281). W EAP-TTLS tylko serwer RADIUS musi posiadać certyfikat. Urządzenie klienta zestawia bezpieczny tunel TLS z serwerem (weryfikując certyfikat serwera), a następnie wewnątrz tego szyfrowanego tunelu bezpiecznie przesyła tradycyjne, niezaszyfrowane poświadczenia użytkownika (np. login i hasło) za pomocą protokołów PAP, CHAP lub MSCHAPv2.
Projekt polega na rozbudowaniu serwera RadSec o pełne wsparcie dla protokołu EAP-TTLS.
Cele edukacyjne to zaawansowana hermetyzacja protokołów, obsługa dynamicznego tunelowania TLS wewnątrz wiadomości EAP (EAP-TTLS handshake), oraz parsowanie i weryfikacja atrybutów AVP (Attribute-Value Pairs) przesyłanych wewnątrz wewnętrznego strumienia TLS (Tunnel Decryption).

**Wymagane funkcje:**
- **Silnik negocjacji EAP-TTLS:** Obsługa specyficznego cyklu życia EAP-TTLS – zestawienie zewnętrznego tunelu TLS (Outer TLS tunnel) wewnątrz fragmentów EAP-Message RADIUS.
- **Dekodowanie wewnętrznego strumienia TLS (Tunnel Decrypter):** Po zestawieniu tunelu, serwer odczytuje przesyłane przez klienta pakiety danych wewnątrz tunelu. Pakiety te mają format binarny EAP-TTLS AVP (podobny do formatu atrybutów RADIUS/Diameter).
- **Obsługa wewnętrznych metod uwierzytelniania (Inner Methods):** Serwer parsuje wewnętrzne atrybuty w poszukiwaniu loginu i hasła użytkownika oraz weryfikuje je przy użyciu bazy danych (np. Active Directory / LDAP / SQLite) z obsługą metod:
  - *PAP* (hasło przesyłane tekstem wewnątrz bezpiecznego tunelu).
  - *MSCHAPv2* (wyliczanie skrótu challenge-response).
- **Zwracanie wyników sesji:** Po pomyślnym uwierzytelnieniu wewnątrz tunelu, serwer zamyka tunel i odsyła standardowy pakiet RADIUS `Access-Accept` lub `Access-Reject`.

**Porady implementacyjne i dobre praktyki:**
EAP-TTLS AVP są przesyłane wewnątrz rekordu TLS Application Data. Musisz zaimplementować parser, który odczytuje nagłówek wewnętrznej wiadomości (4 bajty flag i kodu, 4 bajty AVP code, 1 bajt flag, 3 bajty długości AVP, 4 bajty Vendor ID dla specyficznych atrybutów, oraz surowy payload). Hasło przesłane przez PAP jest bezpieczne, ponieważ znajduje się wewnątrz silnie zaszyfrowanego tunelu TLS utworzonego między klientem a serwerem. Wykorzystaj MemoryStream i wbudowane API SslStream do obsługi wewnętrznego tunelu TLS.
Wzorzec projektowy: *Secure Tunneling*, *State (Stan)*, *Chain of Responsibility*.
