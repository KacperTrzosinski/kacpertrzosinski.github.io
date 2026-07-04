## 150. Rozproszony Silnik Konsensusu oparty o Algorytm Raft (Raft Consensus Simulator)

**Szczegółowy opis i cele edukacyjne:**
W rozproszonych systemach bazodanowych i chmurowych (np. etcd, Consul) pojedynczy serwer nie może stanowić pojedynczego punktu awarii (Single Point of Failure). Kluczem jest replikacja danych na wiele maszyn w taki sposób, aby wspólnie decydowały o spójnym stanie systemu, nawet w przypadku awarii sieci lub wyłączenia części serwerów. Do osiągnięcia tego celu stosuje się Algorytmy Konsensusu (Consensus Algorithms), z których najpopularniejszym i najbardziej zrozumiałym jest `Raft`.
Projekt polega na stworzeniu w pamięci symulatora rozproszonej bazy danych klucz-wartość, replikowanej między 3 lub 5 wirtualnymi węzłami za pomocą algorytmu Raft.
Głównym celem edukacyjnym na zakończenie poziomu "Trudne" jest głębokie opanowanie zaawansowanych zagadnień systemów rozproszonych: wybory lidera (Leader Election), replikacja dziennika transakcji (Log Replication) oraz obsługa podziału sieci (Network Partition) z poprawnym rozstrzyganiem konfliktów logów na podstawie kadencji (Terms).

**Wymagane funkcje:**
- **Maszyna stanów węzła Raft (Raft Node State):** Każdy węzeł może działać w jednym z 3 stanów: `Follower` (sługa), `Candidate` (kandydat) lub `Leader` (przywódca), przełączając stany na podstawie zdarzeń czasowych (Heartbeat timeouts).
- **Algorytm wyboru lidera (Leader Election):** Wybory lidera uruchamiane automatycznie, gdy sługa nie otrzyma sygnału życia (Heartbeat) od lidera w losowym czasie (np. 150-300ms). Węzły głosują na kandydata z uwzględnieniem aktualności jego logów (Log Completeness).
- **Replikacja logów (Log Replication):** Lider przyjmuje polecenia zapisu (np. `Set("key", "val")`), dopisuje je do swojego logu, rozsyła żądania replikacji (`AppendEntries` RPC) do sług i po uzyskaniu potwierdzenia od większości węzłów (Quorum) zatwierdza transakcję (Commit) i aplikuje ją do lokalnej bazy.
- **Symulator podziału sieci (Network Split):** Interfejs konsolowy pozwalający dynamicznie "odciąć" część węzłów od sieci (Split-Brain scenario) i obserwować, jak dwie odizolowane grupy zachowują się przy próbach zapisu (tylko grupa posiadająca większość/quorum pozwala na zapisy, a po ponownym połączeniu sieci grupa mniejszościowa automatycznie synchronizuje i nadpisuje swoje logi danymi od prawdziwego lidera).

**Porady implementacyjne i dobre praktyki:**
Do asynchronicznej komunikacji między węzłami w pamięci wykorzystaj bibliotekę kanałów `System.Threading.Channels` lub interfejsy Task, co pozwoli na bezproblemową symulację opóźnień sieciowych (Latency). Losowość czasu oczekiwania na wybory (Randomized Election Timeouts) to kluczowy element algorytmu Raft – zapobiega to sytuacji, w której wiele węzłów jednocześnie zostaje kandydatami i głosy stale się dzielą (Split Vote). Zaimplementuj logi jako kolekcję struktur `LogEntry` zawierających indeks, kadencję (Term) oraz komendę.
Wzorzec projektowy: *Raft Consensus*, *State (Stan)*, *Command (Polecenie)*.
