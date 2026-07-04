## 188. Serwer RADIUS TLS RadSec z Uwierzytelnianiem EAP-FAST (RadSec TLS EAP-FAST Server)

**Szczegółowy opis i cele edukacyjne:**
Uwierzytelnianie bezprzewodowe przy użyciu mTLS (EAP-TLS) wymaga certyfikatów po obu stronach, a EAP-TTLS wymaga certyfikatu serwera i weryfikacji hasła. Istnieje jednak protokół EAP-FAST (Flexible Authentication via Secured Tunnel - RFC 4851) stworzony przez Cisco, który rezygnuje z tradycyjnych certyfikatów klienta i serwera podczas codziennego logowania. Zamiast certyfikatów, do szybkiego ustanowienia bezpiecznego tunelu TLS wykorzystuje on poświadczenie PAC (Protected Access Credential) dystrybuowane wcześniej do użytkownika. PAC zawiera symetryczny klucz tajny współdzielony z serwerem.
Projekt polega na rozbudowaniu serwera RadSec o pełną obsługę protokołu EAP-FAST.
Cele edukacyjne to mechanizmy szybkiego uwierzytelniania w systemach wbudowanych, zarządzanie i aprowizacja poświadczeń PAC (PAC Provisioning), symetryczne uwierzytelnianie wewnątrz TLS (TLS Session Resumption without server certificates), oraz kryptograficzne generowanie i deszyfrowanie kluczy PAC.

**Wymagane funkcje:**
- **Silnik negocjacji EAP-FAST:** Obsługa specyficznego uścisku dłoni EAP-FAST – klient przesyła swój token PAC w atrybucie ClientHello TLS. Serwer odczytuje PAC, odszyfrowuje go i używa zawartego w nim klucza tajnego do szybkiego uwierzytelnienia.
- **Kryptograficzny silnik PAC (PAC management):**
  - *Generowanie PAC*: Tworzenie bezpiecznego tokena binarnego zawierającego unikalne ID klienta, klucz symetryczny PAC-Key oraz informacje o dacie ważności, zaszyfrowane tajnym kluczem głównym serwera (Master Key) za pomocą algorytmu AES-GCM (ochrona przed sfałszowaniem).
  - *Odszyfrowywanie PAC*: Serwer deszyfruje nadesłany token, odczytuje klucz symetryczny i wykorzystuje go do uwierzytelnienia sesji.
- **Faza aprowizacji PAC (PAC Provisioning):** Obsługa scenariusza, w którym klient nie posiada jeszcze klucza PAC. Serwer zgadza się na jednorazowe zestawienie tymczasowego bezpiecznego tunelu przy użyciu certyfikatu serwera (Anonymous DH lub standardowy TLS) i przesyła nowo wygenerowany token PAC bezpośrednio do urządzenia klienta.
- **Uwierzytelnianie Fazy 2:** Po pomyślnym ustanowieniu tunelu przy użyciu PAC, serwer uwierzytelnia tożsamość użytkownika wewnątrz tunelu przy użyciu protokołów PAP / MSCHAPv2.

**Porady implementacyjne i dobre praktyki:**
Struktura PAC składa się z dwóch głównych części: jawnego nagłówka (PAC-Info) oraz zaszyfrowanej binarnej koperty (PAC-Opaque) chroniącej klucz symetryczny i metadane. Do szyfrowania koperty PAC-Opaque użyj algorytmu `AES-256-GCM`. Klucz główny serwera (Master Key) musi być regularnie rotowany (np. co 90 dni), aby zapewnić bezpieczeństwo – stare klucze powinny być przechowywane w bezpiecznym magazynie, aby serwer mógł wciąż odszyfrować PAC-i wystawione przed rotacją.
Wzorzec projektowy: *Token Provider*, *Secure Tunneling*, *Key Rotator*.
