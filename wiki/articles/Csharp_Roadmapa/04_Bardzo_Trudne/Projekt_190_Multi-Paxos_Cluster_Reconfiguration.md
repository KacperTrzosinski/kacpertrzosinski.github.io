## 190. Multi-Paxos z Dynamiczną Rekonfiguracją Członków Klastra (Multi-Paxos Cluster Reconfiguration)

**Szczegółowy opis i cele edukacyjne:**
W rozproszonych bazach danych opartych o konsensus, konfiguracja klastra (lista aktywnych węzłów tworzących kworum) nie jest stała. Z biegiem czasu musimy wymieniać uszkodzone serwery, dodawać nowe w celu zwiększenia wydajności lub zmniejszać klaster. Dynamiczna zmiana konfiguracji (Cluster Reconfiguration) w trakcie normalnej pracy systemu jest niezwykle trudnym wyzwaniem. Naiwne podejście (np. jednoczesna zmiana listy węzłów na wszystkich maszynach) może doprowadzić do sytuacji, w której stary zestaw węzłów i nowy zestaw węzłów niezależnie zatwierdzą dwie różne transakcje (tzw. Split-brain z powodu braku zakładki kworum). W Multi-Paxos bezpieczną rekonfigurację realizuje się za pomocą specjalnych instrukcji zapisywanych bezpośrednio w logu (Configuration slots / Joint Consensus).
Projekt polega na rozbudowaniu symulatora Multi-Paxos o bezpieczną dynamiczną zmianę składu klastra.
Cele edukacyjne to mechanizmy spójności w dynamicznych środowiskach rozproszonych, implementacja dwufazowej zmiany konfiguracji (Joint Consensus / Transitions), oraz bezprzerwowe przełączanie liderów w locie.

**Wymagane funkcje:**
- **Dynamiczne członkostwo w klastrze (Membership Log Entries):** Zmiana konfiguracji klastra jest traktowana jako specjalna transakcja zapisywana do szczeliny logu (np. `Slot 45: Reconfigure(OldConfig, NewConfig)`).
- **Implementacja dwufazowego Joint Consensus:**
  - Krok 1: Lider zapisuje w logu konfigurację przejściową $C_{old,new}$ (Joint Consensus). Od tej pory każda transakcja musi zostać zatwierdzona przez dwa niezależne kworum jednocześnie: większość z konfiguracji $C_{old}$ oraz większość z konfiguracji $C_{new}$.
  - Krok 2: Po zatwierdzeniu $C_{old,new}$ na większości węzłów obu konfiguracji, lider zapisuje w logu konfigurację docelową $C_{new}$. Od tego momentu transakcje wymagają wyłącznie kworum nowej konfiguracji.
- **Dynamiczny Bootstrapping nowych węzłów:** Nowo dodawany pusty węzeł jest dołączany jako węzeł niegłosujący (Non-voting / Observer). Lider przesyła do niego snapshot i logi (catch-up), a dopiero gdy nowy węzeł dogoni stan bazy, lider inicjuje właściwy proces Joint Consensus w celu nadania mu praw głosowania.
- **CLI Monitor konfiguracji:** Wizualizacja składu klastra, aktualnej konfiguracji (Old / Joint / New) i aktywności głosowania poszczególnych maszyn w czasie rzeczywistym.

**Porady implementacyjne i dobre praktyki:**
Podczas fazy Joint Consensus, jeśli lider ulegnie awarii, nowy lider wybrany przez dowolne poprawne kworum dokończy proces rekonfiguracji, ponieważ informacja o konfiguracji przejściowej jest trwale zapisana w logu w jednym ze slotów. Pamiętaj, aby przy przejściu na nową konfigurację $C_{new}$, jeśli stary lider nie należy do nowej konfiguracji, automatycznie zrzekł się przywództwa (Step down) i przekazał je do jednego z węzłów z $C_{new}$ po pomyślnym zatwierdzeniu nowej konfiguracji, co zapobiegnie wiszeniu osieroconych liderów.
Wzorzec projektowy: *Joint Consensus*, *Observer (Non-voting Node)*, *State Machine*.
