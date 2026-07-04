## 170. Rozproszony Silnik Konsensusu oparty o Algorytm Multi-Paxos (Multi-Paxos Consensus Simulator)

**Szczegółowy opis i cele edukacyjne:**
Klasyczny algorytm Basic Paxos pozwala na osiągnięcie porozumienia (konsensusu) co do tylko jednej wartości. Jeśli system ma przetwarzać ciągły strumień transakcji (Replicated State Machine / Transaction Log), uruchamianie pełnego dwufazowego uścisku dłoni (Prepare -> Promise -> Accept -> Accepted) dla każdej transakcji generuje olbrzymie opóźnienia sieciowe (2 komunikacje sieciowe RTT). Rozwiązaniem jest Multi-Paxos, który łączy fazę Prepare dla wielu kolejnych wpisów w logu, wybierając stabilnego lidera (Proposer Leader). Dzięki temu w normalnym trybie pracy lider potrzebuje tylko jednej fazy (Accept) do zapisania nowej transakcji (1 RTT).
Projekt polega na zaimplementowaniu w C# kompletnego symulatora rozproszonego konsensusu Multi-Paxos.
Cele edukacyjne to wdrożenie zaawansowanych mechanizmów Multi-Paxos, stabilny wybór lidera (Leader election w Paxos), obsługa strumienia szczelin (Slot-based log streams), oraz procedury synchronizacji brakujących wpisów w logach (Log catch-up) po awariach maszyn lub podziałach sieci.

**Wymagane funkcje:**
- **Wieloszczelinowy log transakcji (Slot-based Log):** Zapisywanie instrukcji binarnej bazy danych do kolejnych ponumerowanych szczelin (Slots, np. Slot 1, Slot 2...). Każdy slot reprezentuje osobną instancję konsensusu Paxos.
- **Optymalizacja uścisku dłoni (Multi-Paxos Phase 1 unification):** Lider wysyła jedno żądanie `Prepare(N)` dla wszystkich przyszłych slotów. Jeśli uzyska większość obietnic (`Promise`), zostaje oficjalnym liderem i dla kolejnych transakcji pomija Fazę 1, wysyłając bezpośrednio `Accept(SlotId, N, Value)` (redukcja opóźnienia do 1 RTT).
- **Obsługa przerw w logach (Log Gap Resolution):** Scenariusz, w którym z powodu awarii sieci niektóre sloty zostały pominięte (np. węzeł ma zatwierdzone sloty 1, 2 i 5, ale brakuje mu 3 i 4). System automatycznie inicjuje proces odpytywania innych węzłów o wartości brakujących slotów (Catch-up / Read repair).
- **Zintegrowany CLI Monitor:** Konsola pokazująca stany wszystkich węzłów, aktualnego stabilnego lidera, numery slotów i zawartość replikowanego logu transakcji w czasie rzeczywistym.

**Porady implementacyjne i dobre praktyki:**
Podczas negocjacji w fazie 1, obietnica Acceptora (`Promise`) musi obejmować nie tylko akceptację dla aktualnego slotu, ale dla wszystkich slotów od aktualnego indeksu w nieskończoność. Jeśli nowy Proposer spróbuje przejąć przywództwo (np. po awarii starego lidera), musi najpierw przesłać zapytanie `Prepare` o wyższym numerze kadencji $N$, odebrać obietnice i sprawdzić, czy w poprzednich niezatwierdzonych szczelinach były już jakieś zaakceptowane wartości – jeśli tak, nowy lider musi najpierw "przepchnąć" i zatwierdzić te stare wartości w odpowiednich szczelinach, zanim zacznie zapisywać własne nowe instrukcje, co gwarantuje spójność historii.
Wzorzec projektowy: *Multi-Paxos Consensus*, *State*, *Active Object*.
