## 143. Asynchroniczny Serwer i Klient Protokółu SIP VoIP (Async SIP VoIP Server)

**Szczegółowy opis i cele edukacyjne:**
VoIP (Voice over IP) umożliwia przesyłanie głosu i wideo przez sieci pakietowe IP. Głównym protokołem sterującym i zestawiającym połączenia telefoniczne w tej technologii jest SIP (Session Initiation Protocol - RFC 3261).
Projekt polega na zaimplementowaniu asynchronicznego serwera SIP (nasłuchującego na porcie UDP 5060) oraz klienta SIP. Serwer zarządza rejestracją aparatów telefonicznych (użytkowników) i pośredniczy w przekazywaniu żądań nawiązania połączeń.
Cele edukacyjne to niskopoziomowe parsowanie tekstowego protokołu SIP (nagłówki, metody `REGISTER`, `INVITE`, `ACK`, `BYE`, `CANCEL`), implementacja maszyny stanów połączeń telefonicznych (Rejestracja, Dzwonienie, Połączony, Rozłączony) oraz obsługa negocjacji parametrów transmisji głosu za pomocą protokołu SDP (Session Description Protocol).

**Wymagane funkcje:**
- **Parser komunikatów SIP:** Odczytywanie i kodowanie struktury SIP (linia startowa określająca metodę lub kod statusu, nagłówki w postaci klucz-wartość, pusta linia oraz opcjonalna treść wiadomości).
- **Obsługa rejestracji użytkowników (SIP Registrar):** Endpoint obsługujący żądania `REGISTER` i zapisujący w bazie danych aktualną lokalizację sieciową (adres IP i port UDP) użytkownika.
- **Zestawianie połączeń (SIP Proxy / Redirect):** Obsługa żądania `INVITE` od użytkownika A do B – serwer lokalizuje użytkownika B, przesyła do niego żądanie dzwonienia, a po odebraniu potwierdzenia przekazuje odpowiedź `200 OK` do użytkownika A.
- **Negocjacja SDP:** Parsowanie sekcji SDP osadzonej w ciele SIP w celu ustalenia adresów IP i portów UDP, na których urządzenia będą bezpośrednio wymieniać pakiety dźwiękowe (RTP stream).

**Porady implementacyjne i dobre praktyki:**
Protokół SIP pod wieloma względami przypomina HTTP (jest tekstowy, używa podobnych kodów statusu, np. `200 OK`, `401 Unauthorized`, `180 Ringing`). Do parsowania nagłówków wykorzystaj wydajny podział tekstu po znakach nowej linii `\r\n`. Pamiętaj, że pakiety SIP przesyłane przez UDP mogą przekroczyć maksymalny dopuszczalny rozmiar pakietu bez fragmentacji (MTU - zazwyczaj 1500 bajtów) – dbaj o to, aby komunikaty były zwięzłe i nie zawierały niepotrzebnych spacji czy długich nagłówków.
Wzorzec projektowy: *State (Stan)*, *Proxy (Pełnomocnik)*, *Factory (Fabryka)*.
