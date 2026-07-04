## 160. Rozproszony Silnik Konsensusu oparty o Algorytm Paxos (Paxos Consensus Simulator)

**Szczegółowy opis i cele edukacyjne:**
Oprócz algorytmu Raft, historycznym i matematycznym fundamentem systemów rozproszonych jest rodzina algorytmów konsensusu Paxos (stworzona przez Lesliego Lamporta). Paxos charakteryzuje się bardziej zdecentralizowaną strukturą niż Raft (brak stałego, sztywnego lidera w wersji podstawowej - Basic Paxos), co czyni go trudniejszym w implementacji, ale bardzo pouczającym wyzwaniem.
Projekt polega na stworzeniu w pamięci symulatora sieci węzłów rozproszonych komunikujących się za pomocą protokołu Paxos (lub Multi-Paxos).
Cele edukacyjne to zrozumienie pojęć systemów rozproszonych: kworum (Quorum), role Paxos (Proposer - proponujący, Acceptor - akceptujący, Learner - dowiadujący się), dwufazowy uścisk dłoni Paxos (Faza 1: Prepare/Promise, Faza 2: Propose/Accept), oraz rozstrzyganie konfliktów przy jednoczesnych propozycjach od wielu węzłów (Duelling Proposers).

**Wymagane funkcje:**
- **Silnik węzła Paxos (Paxos Node):** Wirtualny serwer implementujący interfejsy roli Proposera (tworzenie propozycji wartości o sekwencyjnym numerze) oraz Acceptora (głosowanie i akceptacja propozycji na podstawie numerów).
- **Faza 1 (Prepare / Promise):** Proposer rozsyła żądanie `Prepare(N)` do większości Acceptorów. Acceptory odpowiadają obietnicą `Promise(N, MaxAcceptedValue)`, gwarantując, że nie przyjmą żadnej propozycji o numerze mniejszym niż $N$.
- **Faza 2 (Accept / Accepted):** Jeśli Proposer otrzyma obietnicę od większości (Quorum), wybiera wartość (własną lub najwyższą z otrzymanych obietnic) i wysyła `Accept(N, Value)`. Acceptory akceptują wartość, jeśli nie złożyły nowszej obietnicy.
- **Symulacja konfliktów (Live-lock / Duelling Proposers):** Zaimplementowanie scenariusza, w którym dwa węzły Proposerów stale próbują zgłosić propozycję o rosnących numerach $N$, blokując się nawzajem (Livelock). Wdrożenie rozwiązania tego problemu (np. losowe opóźnienia lub wybór wyróżnionego lidera - Distinguished Proposer).

**Porady implementacyjne i dobre praktyki:**
Do symulacji sieci i przesyłania pakietów (Prepare, Promise, Accept, Accepted) wykorzystaj asynchroniczne kanały (`Channel<Message>`) dla każdego węzła w pamięci RAM. Numery propozycji $N$ muszą być unikalne w całej sieci – najprostszy sposób to składanie numeru z lokalnego licznika oraz identyfikatora węzła (np. dla węzła 2 propozycja to `1.2`, kolejna to `2.2`). Zaimplementuj rolę Learnera, która nasłuchuje na decyzje Acceptorów i aktualizuje lokalną bazę danych, gdy wartość zostanie ostatecznie zatwierdzona przez kworum.
Wzorzec projektowy: *Paxos Consensus*, *State*, *Messenger*.
