## 68. Klient P2P do Przesyłania Plików w Sieci Lokalnej (P2P File Sharer)

**Szczegółowy opis i cele edukacyjne:**
Wymiana plików w sieciach rozproszonych (Peer-to-Peer) eliminuje potrzebę posiadania centralnego serwera przechowującego pliki. Kluczowym elementem P2P jest mechanizm automatycznego wykrywania innych uczestników (Peers) w tej samej sieci oraz wydajny przesył danych binarnych.
Projekt polega na stworzeniu konsolowej aplikacji P2P.
Cele edukacyjne to praca z dwoma różnymi protokołami sieciowymi: UDP (wykorzystanie rozgłaszania/multicastu – UDP Broadcast/Multicast do automatycznego wykrywania aktywnych klientów w sieci lokalnej bez podawania ich adresów IP) oraz TCP (wykorzystanie asynchronicznych gniazd TCP do bezpośredniego transferu plików), a także wdrożenie protokołu komunikacyjnego (Packet Framing) oraz weryfikacji integralności danych przy użyciu haszowania SHA-256.

**Wymagane funkcje:**
- **Peer Discovery (UDP Beacon):** Moduł wysyłający co $N$ sekund pakiet UDP na określony port multicastowy i nasłuchujący zgłoszeń innych klientów w sieci w celu zbudowania dynamicznej listy dostępnych węzłów.
- **Katalogowanie i udostępnianie plików:** Każdy klient indeksuje pliki w swoim lokalnym folderze udostępnionym i rozgłasza listę dostępnych u niego plików.
- **Asynchroniczny transfer TCP (Segmented transfer):** Pobieranie wybranego pliku od innego węzła P2P za pomocą strumienia TCP z podziałem pliku na bloki (np. po 64KB) i weryfikacją sumy kontrolnej SHA-256 każdego bloku.
- **Pasek postępu i wznawianie:** Wizualizacja pobierania w konsoli oraz obsługa wznawiania (Resume) niedokończonych transferów na podstawie przesunięcia wskaźnika zapisu pliku.

**Porady implementacyjne i dobre praktyki:**
Do wykrywania peerów wykorzystaj klasę `UdpClient`. Rozgłaszanie wykonuj na adresie grupowym lub ogólnym IP `255.255.255.255`. Pamiętaj o włączeniu opcji gniazda `SocketOptionName.ReuseAddress`, aby wiele instancji aplikacji mogło nasłuchiwać na tym samym porcie UDP na jednej maszynie (podczas testów lokalnych). Przy transferze plików przez TCP zaprojektuj ramkowanie pakietów (Packet Framing) – wysyłaj najpierw długość pakietu (jako `int` / 4 bajty), a następnie dokładnie tyle bajtów danych. Zapobiegnie to sklejaniu się pakietów w strumieniu TCP.
Wzorzec projektowy: *Observer* (powiadomienia o nowych peerach/postępach transferu), *Async Pipeline*.
