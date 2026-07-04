## 139. Strumień IPC przez Kolejkę Ring Buffer w Pamięci (Ring Buffer IPC CLI)

**Szczegółowy opis i cele edukacyjne:**
W komunikacji międzyprocesowej o ultrawysokiej wydajności (Low Latency IPC) tradycyjne mechanizmy blokowania (np. Mutex systemowy) generują zbyt duży narzut, ponieważ wywołują przełączanie kontekstu wątków w jądrze systemu operacyjnego (Kernel Context Switch). Najszybszą metodą wymiany danych jest użycie pamięci współdzielonej wraz ze strukturą kolejki kołowej bez użycia blokad (Lock-Free Circular Ring Buffer), gdzie synchronizacja opiera się wyłącznie na atomowych instrukcjach procesora (np. Compare-And-Swap - CAS).
Projekt polega na stworzeniu w C# biblioteki do komunikacji IPC opartej o bezblokadową kolejkę Ring Buffer zapisaną w pliku mapowanym w pamięci.
Cele edukacyjne to zaawansowana praca z wskaźnikami (`unsafe` C#), projektowanie układów struktur w pamięci (Memory Layout) z uwzględnieniem wyrównywania bajtów (Data Alignment), oraz niskopoziomowa synchronizacja wątków i procesów przy użyciu barier pamięciowych (`Thread.MemoryBarrier`) oraz operacji atomowych `Interlocked`.

**Wymagane funkcje:**
- **Struktura Ring Buffer w Shared Memory:** Tworzenie nazwanego segmentu pamięci współdzielonej, w którym nagłówek zawiera pozycje wskaźnika zapisu (Write Index) i odczytu (Read Index) jako 64-bitowe liczby całkowite modyfikowane atomowo.
- **Bezblokowy algorytm zapisu i odczytu:** Zaimplementowanie zapisu (Producer) i odczytu (Consumer) w taki sposób, aby w pętli modyfikowały wyłącznie wskaźniki przy użyciu instrukcji atomowych, eliminując potrzebę blokowania systemu operacyjnego.
- **Wyrównanie linii cache (Cache Line Padding):** Zaprojektowanie struktury nagłówka kolejki tak, aby wskaźnik zapisu i odczytu znajdowały się w innych liniach cache procesora (zazwyczaj 64 bajty), co zapobiega zjawisku False Sharing spowalniającemu działanie procesorów wielordzeniowych.
- **Zintegrowany tester przepustowości (Throughput Test):** Narzędzie mierzące liczbę wiadomości przesyłanych na sekundę (Messages Per Second) oraz opóźnienie (Latency) w nanosekundach.

**Porady implementacyjne i dobre praktyki:**
Użyj klasy `MemoryMappedFile` do uzyskania dostępu do pamięci współdzielonej. Zadeklaruj atrybut `[StructLayout(LayoutKind.Explicit)]` na nagłówku struktury, aby precyzyjnie kontrolować przesunięcia bajtowe (Offsets) pól. Aby zapobiec False Sharing, dodaj puste pole paddingu między wskaźnikami zapisu i odczytu:
```csharp
[FieldOffset(0)] public long WriteIndex;
[FieldOffset(64)] public long ReadIndex; // 64 bajty odstępu - linia cache
```
Wykorzystuj operacje `Interlocked.Read` i `Interlocked.CompareExchange` do bezpiecznego odczytu i aktualizacji wskaźników z różnych procesów.
Wzorzec projektowy: *Disruptor Pattern*, *Single Producer Single Consumer (SPSC) Ring Buffer*.
