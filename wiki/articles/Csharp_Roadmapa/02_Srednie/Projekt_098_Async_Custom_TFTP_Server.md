## 98. Asynchroniczny Serwer i Klient TFTP od Zera (Async Custom TFTP Server)

**Szczegółowy opis i cele edukacyjne:**
Trivial File Transfer Protocol (TFTP) to uproszczony protokół przesyłu plików o niskim narzucie nagłówków, działający na bazie protokołu UDP (port 69). Jest powszechnie stosowany do zdalnego bootowania maszyn (np. PXE boot) lub wgrywania oprogramowania na routery i przełączniki sieciowe.
Projekt polega na stworzeniu asynchronicznego serwera i klienta TFTP.
Cele edukacyjne to niskopoziomowa komunikacja UDP, parsowanie binarnych pakietów o zmiennej długości (zgodnie z RFC 1350), implementacja mechanizmu potwierdzania odbioru pakietów (ACK) oraz radzenie sobie z utratą pakietów w sieci za pomocą mechanizmu ponawiania (Timeout & Retransmit) na poziomie aplikacji.

**Wymagane funkcje:**
- **Parser binarnych pakietów TFTP:** Dekodowanie i kodowanie pakietów: `RRQ` (Read Request), `WRQ` (Write Request), `DATA` (zawierający blok danych o stałym rozmiarze 512 bajtów), `ACK` (potwierdzenie bloku) oraz `ERROR` (obsługa kodów błędów).
- **Asynchroniczny transfer UDP:** Obsługa wielu równoległych transferów plików (serwer otwiera nowy losowy port UDP dla każdej sesji transferu, uwalniając port 69 dla kolejnych żądań).
- **Niezawodność transmisji (Stop-and-Wait ARQ):** Implementacja protokołu przesyłu z zatrzymaniem: nadawca wysyła blok $N$ i czeka na pakiet `ACK` z numerem bloku $N$. Jeśli pakiet `ACK` nie nadejdzie w ciągu $T$ sekund, nadawca ponownie wysyła ten sam blok.
- **Bezpieczeństwo plików:** Ograniczenie operacji zapisu i odczytu wyłącznie do wyznaczonego katalogu roboczego na serwerze (ochrona przed atakiem Path Traversal).

**Porady implementacyjne i dobre praktyki:**
Pakiety TFTP są bardzo małe – nagłówek danych ma tylko 4 bajty (2 bajty na opcode i 2 bajty na numer bloku), po których następuje maksymalnie 512 bajtów danych. Wykorzystaj `UdpClient` do przesyłania pakietów. Pętla transferu powinna działać asynchronicznie przy użyciu `ReceiveAsync()`. Zaimplementuj timeout za pomocą `Task.WaitAny` łącząc zadanie odbioru sieciowego z zadaniem opóźnienia `Task.Delay`. Jeśli wskaźnik otrzymanych danych w ostatnim bloku jest mniejszy niż 512 bajtów, oznacza to koniec przesyłu pliku.
Wzorzec projektowy: *State (Stan)*, *Timeout Retry Pattern*.
