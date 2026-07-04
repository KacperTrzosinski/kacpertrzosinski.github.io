## 180. Multi-Paxos z Czyszczeniem Logów i Snapshotami (Multi-Paxos Log Compaction)

**Szczegółowy opis i cele edukacyjne:**
W rozproszonych systemach konsensusu (np. Multi-Paxos, Raft) dziennik transakcji (Log) stale rośnie przy każdym nowym zapisie. Po dłuższym czasie działania plik logu osiągnąłby gigantyczne rozmiary, co doprowadziłoby do przepełnienia dysku, a start nowego węzła (który musi przeczytać cały log od zera, aby odbudować stan bazy) trwałby godzinami. Rozwiązaniem jest Czyszczenie Logów (Log Compaction) poprzez mechanizm migawek stanu (Snapshots). Węzeł zapisuje aktualny stan bazy danych (np. ostateczne wartości wszystkich kluczy) jako plik snapshotu na dysku, a wszystkie wpisy w logu (Slots) starsze niż ten snapshot są bezpiecznie usuwane.
Projekt polega na rozbudowaniu symulatora Multi-Paxos o mechanizm automatycznego tworzenia snapshotów oraz procedury synchronizacji opóźnionych węzłów (Catch-up via Snapshot Transfer).
Cele edukacyjne to synchronizacja stanów w systemach rozproszonych, bezpieczne czyszczenie dzienników transakcji z zachowaniem spójności kworum, oraz przesyłanie migawek stanu przez sieć do węzłów, które zbyt mocno opóźniły się w replikacji.

**Wymagane funkcje:**
- **Silnik tworzenia migawek (Snapshot Engine):** Gdy liczba zatwierdzonych slotów w Multi-Paxos przekroczy limit (np. co 1000 slotów), silnik zapisuje aktualny zrzut bazy (np. pary klucz-wartość) na dysku wraz z metadanymi: `LastIncludedIndex` (indeks ostatniego włączonego slotu) oraz `LastIncludedTerm` (kadencja tego slotu).
- **Czyszczenie logu (Log Discarding):** Po pomyślnym zapisie snapshotu, silnik usuwa z pamięci i dysku wszystkie wpisy w logu o indeksach mniejszych lub równych `LastIncludedIndex`.
- **Transmisja migawek (Snapshot Transfer RPC):** Scenariusz, w którym węzeł A był odłączony od sieci przez długi czas i po powrocie próbuje zsynchronizować logi. Ponieważ lider usunął już stare sloty z logu (zrobił snapshot), nie może wysłać ich tradycyjnym catch-upem. Lider wykrywa tę sytuację i przesyła cały plik snapshotu do węzła A.
- **Wczytanie migawki (Snapshot Installation):** Węzeł A odbiera snapshot, całkowicie nadpisuje swoją lokalną bazę danych i ustawia swój aktualny indeks logu na `LastIncludedIndex`, a następnie wznawia standardową replikację kolejnych slotów.

**Porady implementacyjne i dobre praktyki:**
Podczas tworzenia snapshotu baza danych musi być spójna. Zamiast blokować cały system na czas zapisu pliku na dysku (co zatrzymałoby obsługę żądań klientów), wykorzystaj technikę Copy-on-Write – przed zapisem utwórz szybką, wirtualną kopię danych w pamięci (lub użyj transakcyjnych mechanizmów izolacji) i zrzuć ją na dysk w asynchronicznym wątku w tle, pozwalając głównemu procesowi na dalszą modyfikację bazy i logów.
Wzorzec projektowy: *Memento*, *State Machine*, *Snapshot Transfer*.
