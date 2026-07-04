## 148. Asynchroniczny Serwer i Klient Protokołu RADIUS (Async RADIUS Server)

**Szczegółowy opis i cele edukacyjne:**
Remote Authentication Dial-In User Service (RADIUS) to binarny protokół sieciowy (działający na bazie UDP, porty 1812 i 1813) używany do centralnego zarządzania uwierzytelnianiem, autoryzacją oraz rozliczaniem (AAA - Authentication, Authorization, Accounting) użytkowników w sieciach komputerowych (np. dostęp do VPN, sieci Wi-Fi Enterprise).
Projekt polega na zaimplementowaniu w C# od zera asynchronicznego serwera i klienta RADIUS.
Cele edukacyjne to niskopoziomowe parsowanie binarnych struktur pakietów (RFC 2865), kryptograficzna weryfikacja integralności pakietów przy użyciu algorytmów haszujących (MD5 z współdzielonym kluczem - Shared Secret), oraz asynchroniczna komunikacja UDP.

**Wymagane funkcje:**
- **Parser binarnych pakietów RADIUS:** Odczyt nagłówka pakietu (1 bajt Code: np. `Access-Request`, `Access-Accept`, `Access-Reject`, 1 bajt Identifier, 2 bajty Length, 16 bajtów Authenticator, oraz sekcja atrybutów).
- **Kodowanie i dekodowanie atrybutów (AVPs):** Przetwarzanie atrybutów w formacie TLV (Type-Length-Value), takich jak `User-Name`, `User-Password`, `NAS-IP-Address` czy `Service-Type`.
- **Kryptografia RADIUS (Szyfrowanie haseł):** Odszyfrowywanie hasła użytkownika przesyłanego w pakiecie `Access-Request` (hasło jest maskowane za pomocą algorytmu XOR z hashem MD5 połączonego klucza Shared Secret oraz pola Request Authenticator) oraz weryfikacja podpisu pakietu odpowiedzi (Response Authenticator).
- **Zintegrowany serwer asynchroniczny:** Serwer nasłuchuje na porcie UDP 1812, weryfikuje poświadczenia użytkownika w lokalnej bazie danych SQLite i zwraca pakiet `Access-Accept` (z przypisaniem atrybutów profilu, np. adres IP klienta) lub `Access-Reject`.

**Porady implementacyjne i dobre praktyki:**
Pola binarne RADIUS przesyłane są w formacie Big-Endian. Szyfrowanie hasła w RADIUS (zgodnie z RFC 2865) polega na podzieleniu hasła na 16-bajtowe bloki $P_1, P_2 ...$, a następnie dla każdego bloku obliczany jest XOR z hashem MD5: $c_i = P_i \oplus \text{MD5}(\text{Shared Secret} + \text{Request Authenticator} / c_{i-1})$. Pamiętaj, aby współdzielony klucz (Shared Secret) był odpowiednio silny i nie był przesyłany otwartym tekstem przez sieć. Do asynchronicznej komunikacji wykorzystaj klasę `UdpClient` z metodami `ReceiveAsync()`.
Wzorzec projektowy: *Adapter*, *Strategy*, *Security Gate*.
