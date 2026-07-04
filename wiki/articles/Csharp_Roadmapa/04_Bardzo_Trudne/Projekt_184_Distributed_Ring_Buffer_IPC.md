## 184. Priorytetowy Bufor Ring Buffer IPC z Rozproszoną Synchronizacją (Distributed Ring Buffer IPC)

**Szczegółowy opis i cele edukacyjne:**
Tradycyjne bufory Ring Buffer IPC (współdzielona pamięć) ograniczają się do komunikacji między procesami na tej samej maszynie fizycznej. Aby rozszerzyć ten model na komunikację sieciową o niskich opóźnieniach (np. rozproszone systemy transakcyjne, komunikacja węzłów w klastrze), należy stworzyć Rozproszony Ring Buffer IPC. Łączy on bezblokową lokalną pamięć współdzieloną (dla procesów lokalnych) z asynchroniczną replikacją sieciową o niskich opóźnieniach (dla procesów na innych maszynach), z zachowaniem priorytetyzacji wiadomości.
Projekt polega na zaimplementowaniu w C# biblioteki do rozproszonej komunikacji IPC klastra opartej o hybrydową architekturę pamięci współdzielonej i replikacji gniazd TCP (z bezblokową synchronizacją).
Cele edukacyjne to synchronizacja rozproszona stanów kolejek, replikacja danych o niskich opóźnieniach (Zero-copy network serialization) z użyciem `System.IO.Pipelines`, oraz projektowanie bezblokowych algorytmów synchronizacji MPMC (Multi-Producer Multi-Consumer) działających hybrydowo na pamięci lokalnej i sieciowej.

**Wymagane funkcje:**
- **Hybrydowy Ring Buffer (Shared Memory + Socket):**
  - *Zapis lokalny*: Dodawanie danych bezblokowo do pamięci współdzielonej (Shared Memory MPMC Ring Buffer) dla konsumentów na tej samej maszynie.
  - *Zapis zdalny (Network Replicator)*: Wątek replikatora automatycznie odczytuje nowe wiadomości z kolejki i przesyła je przez zoptymalizowane gniazda TCP do zdalnych węzłów klastra.
- **Wielopoziomowa kolejka priorytetowa klastra:** Obsługa przesyłania danych w 3 priorytetach (High, Medium, Low) z zachowaniem reguły, że zdalne wiadomości o priorytecie High są przetwarzane przed wiadomościami lokalnymi o priorytecie Medium.
- **Protokół replikacji Zero-Copy:** Serializacja wiadomości bezpośrednio z pamięci współdzielonej do strumienia sieciowego gniazda za pomocą `System.IO.Pipelines` bez alokacji tymczasowych tablic bajtów.
- **Dynamiczna weryfikacja spójności (Sequence validation):** Każdy węzeł weryfikuje numery sekwencyjne nadawców i odbiorców w klastrze, wykrywając zagubione pakiety sieciowe i automatycznie żądając retransmisji.

**Porady implementacyjne i dobre praktyki:**
W celu wyeliminowania narzutów kopiowania danych w pamięci (Zero-Copy), wykorzystaj strukturę `ReadOnlySequence<byte>` z przestrzeni `System.Buffers` do reprezentacji fragmentów pamięci współdzielonej, które przekazujesz bezpośrednio do asynchronicznego zapisu sieciowego. Sieciowy replikator powinien działać w oparciu o model wątku dedykowanego o wysokim priorytecie (Thread Affinity / Spin-Wait) odpytującego lokalny Ring Buffer (metoda Pollingu zamiast zdarzeń opartych na blokadach), co minimalizuje opóźnienia przesyłu pakietów do poziomu mikrosekund.
Wzorzec projektowy: *LMAX Disruptor Architecture*, *Replication Pattern*, *Zero-Allocation Serialization*.
