## 158. Serwer RADIUS TLS RadSec z Uwierzytelnianiem Certyfikatów (RadSec TLS Server)

**Szczegółowy opis i cele edukacyjne:**
Klasyczny protokół RADIUS (przesyłany przez UDP z prostym szyfrowaniem hasła za pomocą MD5) jest podatny na podsłuch oraz ataki typu Man-in-the-Middle w publicznych sieciach WAN. Nowoczesnym i bezpiecznym standardem w infrastrukturach Enterprise jest protokół RadSec (RADIUS over TLS - RFC 6614). RadSec przesyła tradycyjne pakiety RADIUS wewnątrz bezpiecznego tunelu TCP z pełnym szyfrowaniem TLS.
Projekt polega na stworzeniu serwera RadSec w C#.
Cele edukacyjne to integracja bezpiecznego protokołu TLS na bazie gniazd TCP, zaawansowane zarządzanie infrastrukturą PKI (Public Key Infrastructure), uwierzytelnianie dwukierunkowe klientów (mTLS - Mutual TLS / Client Certificate Authentication), oraz wdrożenie bezpiecznej kontroli dostępu do zasobów AAA.

**Wymagane funkcje:**
- **Silnik gniazd TCP z TLS (RadSec Server):** Serwer nasłuchuje na porcie TCP 2083 (standardowy port RadSec), akceptuje połączenia i owija je w bezpieczny strumień `SslStream`.
- **Weryfikacja mTLS (Mutual TLS):** Konfiguracja `SslStream` wymagająca od klienta (np. router, Access Point) przesłania własnego certyfikatu X.509. Serwer weryfikuje certyfikat klienta w oparciu o zaufane centrum certyfikacji (Root CA) oraz sprawdza, czy certyfikat nie został unieważniony (lista CRL lub protokół OCSP).
- **Bezpieczny routing pakietów:** Parsowanie tradycyjnych binarnych pakietów RADIUS (Access-Request, Accounting-Request) odebranych przez strumień TLS i przekazywanie ich do wewnętrznego silnika decyzyjnego.
- **Weryfikacja tożsamości klienta na podstawie certyfikatu:** Wyodrębnianie nazwy pospolitej (Common Name - CN) lub innych atrybutów (Subject Alternative Name - SAN) z certyfikatu klienta w celu weryfikacji jego praw dostępu do serwera (np. mapowanie certyfikatu na dozwolony profil sieciowy).

**Porady implementacyjne i dobre praktyki:**
Do weryfikacji dwukierunkowej (mTLS) przy wywołaniu uwierzytelniania serwera użyj metody:
`await sslStream.AuthenticateAsServerAsync(serverCertificate, clientCertificateRequired: true, enabledSslProtocols: SslProtocols.Tls13, checkCertificateRevocation: true);`.
Generowanie certyfikatów testowych (Root CA, certyfikat serwera, certyfikaty klientów) zrealizuj programowo za pomocą wbudowanych w .NET klas kryptograficznych z przestrzeni `System.Security.Cryptography.X509Certificates` (np. `CertificateRequest`), co eliminuje zależność od zewnętrznych narzędzi typu OpenSSL.
Wzorzec projektowy: *Secure Channel*, *Proxy*, *Factory*.
