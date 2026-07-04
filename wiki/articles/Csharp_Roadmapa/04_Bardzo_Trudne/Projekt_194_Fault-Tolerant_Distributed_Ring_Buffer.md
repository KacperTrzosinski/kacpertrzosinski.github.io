## 194. Rozproszony Ring Buffer IPC odporny na Awarie (Fault-Tolerant Distributed Ring Buffer)

**Szczegółowy opis i cele edukacyjne:**
Rozproszone buforowanie pamięci IPC (Shared Memory klastra) o bardzo niskich opóźnieniach wymaga zabezpieczenia przed nagłymi awariami sieciowymi, zgonami procesów (Consumer Crashes) lub restartami maszyn fizycznych. Wiadomości o priorytecie krytycznym nie mogą zostać zgubione, jeśli proces konsumenta umrze w trakcie ich przetwarzania. Rozwiązaniem jest zaimplementowanie mechanizmów tolerancji błędów – transakcyjnego pobierania wiadomości (Transactional Dequeue), zapisu historii do dziennika typu Write-Ahead Log (WAL) oraz automatycznego przejmowania zadań przez inne węzły (Failover).
Projekt polega na stworzeniu odpornego na awarie, rozproszonego priorytetowego bufora kołowego IPC w C#.
Cele edukacyjne to projektowanie systemów rozproszonych odpornych na błędy (Fault-Tolerance), implementacja transakcyjnego modelu pobierania danych (At-Least-Once Delivery), oraz niskopoziomowy zapis dzienników WAL (Write-Ahead Logging) o wysokiej wydajności.

**Wymagane funkcje:**
- **Transakcyjne pobieranie (Transactional Consumer API):** Konsument nie usuwa wiadomości z Ring Buffera w momencie odczytu. Zamiast tego wiadomość zostaje oznaczona jako "w trakcie przetwarzania" (In-Flight). Konsument musi wysłać potwierdzenie `Commit` po zakończeniu zadania. Jeśli konsument ulegnie awarii (lub nie potwierdzi wiadomości w czasie $T$), wiadomość automatycznie wraca na początek kolejki (Rollback / Timeout recovery).
- **Zintegrowany plikowy Write-Ahead Log (WAL):** Wszystkie przychodzące wiadomości o priorytecie High są trwale zapisywane na dysku do pliku dziennika WAL przed dodaniem ich do pamięci współdzielonej. Gwarantuje to zerową utratę danych przy nagłym braku zasilania (Crash recovery).
- **Automatyczny Failover klastra:** Węzły stale monitorują się nawzajem przy użyciu pakietów heartbeat. Jeśli węzeł A (obsługujący dany strumień danych) ulegnie awarii, sąsiedni węzeł B automatycznie przejmuje jego zadania, wczytuje stan z pliku WAL i wznawia konsumpcję wiadomości z rozproszonego ringu.
- **Konsolowy Symulator Awarii (Chaos Monkey):** Narzędzie testowe pozwalające na symulowanie losowych zgonów procesów konsumentów i pokazujące poprawność powrotu niepotwierdzonych wiadomości do kolejki bez przerywania pracy systemu.

**Porady implementacyjne i dobre praktyki:**
Aby zaimplementować transakcyjne pobieranie (At-Least-Once), każda pozycja w Ring Bufferze współdzielonym musi posiadać metadane zawierające ID konsumenta oraz znacznik czasu blokady (Lock Timestamp). Write-Ahead Log (WAL) musi być zapisywany z flagą wymuszającą fizyczny zapis na dysk (`FileOptions.WriteThrough`), co pomija pamięć podręczną systemu operacyjnego i gwarantuje, że dane fizycznie znalazły się na nośniku magnetycznym/SSD (jest to operacja wolna, dlatego w pliku WAL grupuj zapisy, tzw. Group Commit, co drastycznie podniesie wydajność przy dużym obciążeniu).
Wzorzec projektowy: *Write-Ahead Log (WAL)*, *Transactional Queue*, *Heartbeat & Failover*.
