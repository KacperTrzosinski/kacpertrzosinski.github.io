## 129. Asynchroniczny System IPC przez Nazwane Potoki (Named Pipes IPC CLI)

**Szczegółowy opis i cele edukacyjne:**
W komunikacji międzyprocesowej (IPC) na tej samej maszynie nazwane potoki (Named Pipes) stanowią jedno z najpopularniejszych i najbezpieczniejszych rozwiązań. Umożliwiają one przesyłanie strumieniowe danych między dwoma procesami (Server-Client) z pełną obsługą bezpieczeństwa na poziomie uprawnień systemu operacyjnego, działając wydajniej niż tradycyjne połączenia TCP/IP.
Projekt polega na stworzeniu wielowątkowego, asynchronicznego serwera IPC obsługującego wielu równolegle podłączonych klientów za pomocą nazwanych potoków w C#.
Cele edukacyjne to zaawansowana praca z potokami systemowymi (`NamedPipeServerStream` oraz `NamedPipeClientStream`), asynchroniczne czytanie i zapisywanie pakietów o zmiennej długości (z protokołem ramkowania wiadomości - Message Framing), oraz wstrzykiwanie polityk bezpieczeństwa do potoków (Pipe Security).

**Wymagane funkcje:**
- **Wielowątkowy serwer potoków (Named Pipes Server):** Serwer nasłuchujący asynchronicznie na nowe połączenia potoków o nazwie `MySecurePipe` i uruchamiający osobną instancję strumienia dla każdego podłączonego klienta.
- **Ramkowanie wiadomości (Message Framing):** Zaimplementowanie wysyłania komunikatów binarnych o zmiennej długości – nadawca najpierw wysyła nagłówek (np. 4 bajty) określający długość pakietu $L$, a następnie dokładnie $L$ bajtów danych, co zapobiega sklejaniu i ucinaniu wiadomości w strumieniu potoku.
- **Asynchroniczny dupleks (Full-Duplex):** Możliwość jednoczesnego dwukierunkowego przesyłania wiadomości (zarówno serwer jak i klient mogą wysyłać zapytania w dowolnym momencie przez to samo połączenie).
- **Zabezpieczenie potoków (Pipe Access Control):** Konfiguracja uprawnień dostępu (Access Control List - ACL) do potoku, uniemożliwiająca podłączenie się procesom uruchomionym przez innych użytkowników systemu (ochrona przed eskalacją uprawnień).

**Porady implementacyjne i dobre praktyki:**
W .NET do tworzenia serwera nazwanych potoków użyj klasy `System.IO.Pipes.NamedPipeServerStream`. Pętla serwera powinna wywoływać `await serverStream.WaitForConnectionAsync()` w celu asynchronicznego oczekiwania na klienta. Po podłączeniu klienta natychmiast stwórz nowy wątek/zadanie obsługujące sesję, a serwer powinien uruchomić kolejną instancję `NamedPipeServerStream` z tą samą nazwą potoku w celu nasłuchiwania na kolejnych klientów. Do przesyłania tekstów/obiektów wykorzystaj serializację binarną do strumienia potoku.
Wzorzec projektowy: *Worker (Robotnik)*, *Active Object*, *Duplex Channel*.
