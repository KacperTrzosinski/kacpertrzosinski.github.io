## 164. Priorytetowy Bufor Ring Buffer IPC w Pamięci Współdzielonej (Priority Ring Buffer IPC)

**Szczegółowy opis i cele edukacyjne:**
W komunikacji międzyprocesowej o wysokiej wydajności (High-Performance IPC) często zachodzi potrzeba przesyłania wiadomości o różnych poziomach priorytetu (np. polecenia systemowe o priorytecie krytycznym muszą wyprzedzić standardowe pakiety danych w kolejce). Klasyczny bezblokadowy Ring Buffer (kolejka FIFO) nie obsługuje priorytetów. Wdrożenie kolejki priorytetowej w pamięci współdzielonej bez używania wolnych blokad systemowych (Lock-Free) i bez wywoływania alokacji pamięci RAM to szczyt inżynierii współbieżności.
Projekt polega na zaimplementowaniu w C# biblioteki do wieloprocesowej komunikacji IPC z obsługą priorytetów wiadomości.
Cele edukacyjne to niskopoziomowa organizacja struktur w pamięci współdzielonej (`MemoryMappedFile`), projektowanie bezblokowych algorytmów synchronizacji wielu producentów i wielu konsumentów (MPMC - Multi-Producer Multi-Consumer) o stałym czasie $O(1)$, oraz implementacja mechanizmów priorytetyzacji bez wywoływania relokacji i fragmentacji buforów binarnych.

**Wymagane funkcje:**
- **Wielopoziomowy Ring Buffer w Shared Memory:** Struktura pamięci podzielona na $K$ niezależnych fizycznych kolejnych Ring Bufferów (gdzie każdy buffer odpowiada jednemu priorytetowi, np. High, Medium, Low).
- **Bezblokowy algorytm MPMC:** Zapis i odczyt wiadomości zaimplementowane przy użyciu operacji CAS (`Interlocked.CompareExchange`) na wskaźnikach indeksów, pozwalające wielu procesom jednocześnie dodawać i odbierać wiadomości bez kolizji i blokad.
- **Ruter priorytetów (Priority Dispatcher):**
  - *Nadawca (Producer)*: Zapisuje wiadomość do bufora kołowego odpowiadającego priorytetowi wiadomości.
  - *Odbiorca (Consumer)*: Odpytuje asynchronicznie bufory w kolejności od najwyższego priorytetu do najniższego. Dopiero gdy bufor o priorytecie High jest pusty, konsument przetwarza dane z bufora Medium.
- **Wyrównanie pamięci i zapobieganie False Sharing:** Układ nagłówków w pamięci współdzielonej z przesunięciem o rozmiar linii cache procesora (64 bajty) dla wszystkich zmiennych modyfikowanych przez różne procesy.

**Porady implementacyjne i dobre praktyki:**
Aby zaimplementować bezblokowy MPMC Ring Buffer, każda komórka w buforze powinna posiadać skojarzony z nią numer sekwencyjny (Sequence Number) zmieniany atomowo. Producent rezerwuje miejsce w buforze inkrementując wskaźnik zapisu przy użyciu `Interlocked.Increment`, a następnie czeka (Spin-Wait) aż numer sekwencyjny komórki wskaże, że jest ona pusta i gotowa na zapis. Po zapisaniu danych, producent aktualizuje numer sekwencyjny informując konsumentów o dostępności nowej wiadomości. Zastosowanie unsafe kodu i wskaźników (`byte*`) bezpośrednio na zmapowanym widoku pamięci (`MemoryMappedViewAccessor.SafeMemoryMappedViewHandle`) gwarantuje zero-alokacyjność i maksymalną szybkość działania.
Wzorzec projektowy: *Low-Latency Disruptor*, *Priority Queue*, *Memory-Mapped Ring Buffer*.
