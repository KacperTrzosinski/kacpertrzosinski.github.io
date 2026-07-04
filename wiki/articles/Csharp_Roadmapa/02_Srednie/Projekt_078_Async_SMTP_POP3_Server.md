## 78. Asynchroniczny Serwer i Klient SMTP/POP3 (Async SMTP POP3 Server)

**Szczegółowy opis i cele edukacyjne:**
Poczta elektroniczna (e-mail) opiera się na dwóch głównych protokołach tekstowych: SMTP (Simple Mail Transfer Protocol - do wysyłania wiadomości) oraz POP3 (Post Office Protocol v3 - do odbierania poczty ze skrzynki). Zrozumienie sposobu transmisji i przechowywania e-maili na poziomie surowych gniazd TCP to cenne wyzwanie sieciowe.
Projekt polega na napisaniu w pełni asynchronicznego serwera SMTP (port 25 lub 587) oraz serwera POP3 (port 110).
Cele edukacyjne to niskopoziomowa komunikacja sieciowa, asynchroniczne parsowanie komend protokołów tekstowych (RFC 5321 dla SMTP oraz RFC 1939 dla POP3), zarządzanie transakcyjnym zapisem e-maili w bazie danych (np. SQLite) oraz obsługa przesyłu dużych bloków danych (wiadomości wraz z załącznikami MIME).

**Wymagane funkcje:**
- **Serwer SMTP (Mail Ingestion):** Nasłuch na połączenia TCP, obsługa komend `HELO`/`EHLO`, `MAIL FROM`, `RCPT TO`, `DATA` (odczyt treści maila do linii zawierającej pojedynczą kropkę `.`) i zapis wiadomości w bazie SQLite.
- **Serwer POP3 (Mail Retrieval):** Autoryzacja użytkownika (`USER`, `PASS`), listowanie wiadomości (`LIST`), pobieranie treści (`RETR`) oraz oznaczanie do usunięcia (`DELE`).
- **Klient SMTP/POP3 (Mail Client):** Moduł kliencki pozwalający na wysłanie e-maila do Twojego serwera oraz pobranie listy maili i ich odczytanie.
- **Obsługa błędów protokołu:** Zwracanie poprawnych kodów statusów SMTP (np. 250 OK, 550 No such user) i POP3 (eg. `+OK`, `-ERR`).

**Porady implementacyjne i dobre praktyki:**
Wszystkie operacje I/O na gniazdach TCP muszą być asynchroniczne, aby serwer mógł przetwarzać wiele sesji e-mailowych naraz. W serwerze SMTP sekcja `DATA` może zawierać długie wiadomości – wczytuj je buforowanym strumieniem line-by-line, dbając o nieprzekroczenie maksymalnego dopuszczalnego rozmiaru wiadomości (np. 10MB) w celu ochrony przed atakami typu Denial of Service (DoS) opartymi na zapychaniu dysku. Treść maila przechowuj w bazie jako surowy tekst MIME, a metadane (nadawca, odbiorca, data) w osobnych kolumnach ułatwiających filtrowanie w POP3.
Wzorzec projektowy: *State (Stan)* (do kontrolowania faz sesji SMTP i POP3), *Factory* (do generowania odpowiedzi).
