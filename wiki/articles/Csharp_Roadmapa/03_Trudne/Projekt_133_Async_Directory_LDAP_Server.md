## 133. Asynchroniczny Serwer i Klient Directory LDAP od Zera (Async Directory LDAP Server)

**Szczegółowy opis i cele edukacyjne:**
Lekki protokół dostępu do katalogów (LDAP - Lightweight Directory Access Protocol) jest powszechnie stosowany w systemach Enterprise (np. Microsoft Active Directory, OpenLDAP) do centralnego uwierzytelniania użytkowników oraz pobierania informacji o hierarchii organizacji (działy, role, uprawnienia). Komunikacja opiera się o binarny protokół przesyłany przez TCP.
Projekt polega na zaimplementowaniu w C# od zera asynchronicznego serwera LDAP (nasłuchującego na porcie TCP 389 lub 636) oraz klienta LDAP.
Cele edukacyjne to niskopoziomowa manipulacja bajtami, kodowanie i dekodowanie binarnych struktur danych w formacie ASN.1 BER (Basic Encoding Rules) używanym przez LDAP, asynchroniczna komunikacja TCP za pomocą gniazd, oraz implementacja hierarchicznej bazy danych drzewiastych w pamięci (Directory Information Tree - DIT).

**Wymagane funkcje:**
- **Parser binarny ASN.1 BER:** Kodowanie i dekodowanie struktur BER (tag, długość, wartość - TLV). Obsługa struktur typu Sequence, Set, Integer, Octet String oraz Boolean.
- **Obsługa operacji LDAP (LDAP Operations):** Parsowanie i odpowiadanie na komendy:
  - `BindRequest` / `BindResponse` (uwierzytelnianie użytkownika).
  - `SearchRequest` / `SearchResultEntry` / `SearchResultDone` (przeszukiwanie bazy z obsługą filtrów, np. `(mail=john.doe@org.com)`).
  - `UnbindRequest` (zamknięcie sesji).
- **Hierarchiczna baza DIT (Directory Information Tree):** Reprezentacja obiektów w postaci Distinguished Name (DN, np. `cn=John Doe,ou=Users,dc=mycompany,dc=com`) w pamięci RAM, z szybkim wyszukiwaniem poddrzew (Subtree Search).
- **Zintegrowany tester LDAP:** Narzędzie pozwalające na odpytanie Twojego serwera zewnętrznym programem (np. standardowym CLI `ldapsearch`), potwierdzające zgodność protokołu ze standardem RFC 4511.

**Porady implementacyjne i dobre praktyki:**
Kodowanie BER określa typy danych za pomocą bajtu identyfikatora (np. `0x02` to Integer, `0x04` to Octet String, `0x30` to Sequence). Długość pola może być zapisana w formacie krótkim (1 bajt dla długości < 128) lub długim (gdzie pierwszy bajt określa liczbę kolejnych bajtów reprezentujących długość). Użyj struktury `Span<byte>` oraz klasy `BinaryPrimitives` do operowania na liczbach w formacie Big-Endian. Wyszukiwanie w strukturze DIT zorganizuj jako przeszukiwanie grafu (drzewa) metodą DFS lub BFS.
Wzorzec projektowy: *State (Stan)*, *Chain of Responsibility*, *Interpreter*.
