## 165. Silnik Kolejek Pub-Sub na Bazie Protokołu CoAP (Custom CoAP Broker)

**Szczegółowy opis i cele edukacyjne:**
Constrained Application Protocol (CoAP) to wyspecjalizowany protokół warstwy aplikacji zdefiniowany w standardzie RFC 7252, przeznaczony dla urządzeń o bardzo ograniczonych zasobach (IoT, sieci sensorowe) działający na bazie UDP (port 5683). Protokół ten mapuje model REST (GET, POST, PUT, DELETE) na binarny, niezwykle kompaktowy format nagłówka sieciowego i obsługuje asynchroniczny wzorzec Publish/Subscribe przy użyciu rozszerzenia `Observe` (RFC 7641).
Projekt polega na zaimplementowaniu w C# od zera asynchronicznego brokera wiadomości (CoAP Server) komunikującego się przez UDP.
Cele edukacyjne to niskopoziomowe parsowanie binarnego formatu pakietów CoAP (nagłówek o stałej długości 4 bajtów, opcje TLV o zmiennej długości, znacznik Payload Marker `0xFF`, surowy ładunek danych), obsługa niezawodności nad UDP (wiadomości potwierdzane - Confirmable vs niepotwierdzane - Non-confirmable z algorytmem retransmisji), oraz wdrożenie wzorca subskrypcji Observe.

**Wymagane funkcje:**
- **Parser binarnych komunikatów CoAP:** Dekodowanie nagłówka (2 bity Version, 2 bity Type: CON, NON, ACK, RST, 4 bity Token Length, 1 bajt Code: klasy żądań 0.xx lub odpowiedzi 2.xx/4.xx/5.xx, 2 bajty Message ID, Token o długości do 8 bajtów, oraz binarne opcje w formacie Delta-Length).
- **Obsługa transakcji UDP (CON Retransmission):** Zaimplementowanie mechanizmu retransmisji (Exponential Backoff z losowym jitterem) dla wiadomości typu Confirmable (CON) – serwer wysyła pakiet i czeka na potwierdzenie `ACK` o tym samym `Message ID`. Jeśli nie dotrze w zadanym czasie, następuje automatyczna ponowna wysyłka.
- **Implementacja mechanizmu subskrypcji Observe (RFC 7641):** Klient wysyła żądanie `GET` z opcją `Observe = 0` na dany zasób (np. `/sensors/temp`). Serwer rejestruje klienta i przy każdej zmianie wartości zasobu (Publish) automatycznie wysyła asynchroniczne powiadomienie z opcją `Observe` zawierającą rosnący numer sekwencyjny.
- **Zintegrowany tester CLI:** Konsolowe narzędzie pozwalające wysyłać zapytania binarne i obserwować odpowiedzi Twojego brokera.

**Porady implementacyjne i dobre praktyki:**
Opcje w pakiecie CoAP (np. URI-Path określające ścieżkę zasobu) są kodowane w postaci delty (różnicy numeru opcji względem poprzedniej), co minimalizuje rozmiar pakietu sieciowego. Musisz napisać pętlę parsującą te opcje sekwencyjnie. Do asynchronicznej komunikacji sieciowej UDP wykorzystaj klasę `UdpClient`. Pamiętaj, aby wiadomości typu `Confirmable` po odebraniu przez klienta były potwierdzane pakietem `ACK` o identycznym `Message ID` (lub serwer może dokonać potwierdzenia bezpośredniego, tzw. Piggybacked Response, wysyłając odpowiedź z danymi bezpośrednio w pakiecie `ACK`).
Wzorzec projektowy: *Observer (Obserwator)*, *Piggybacked Response Pattern*, *Trie Tree* (do routingu ścieżek URI).
