## 16. Symulator Ruchu Windy w Budynku Biurowym (Elevator Simulator CLI)

**Szczegółowy opis i cele edukacyjne:**
Projekt polega na stworzeniu konsolowej symulacji systemu sterowania windami w wielopiętrowym budynku biurowym. Zadaniem systemu jest efektywne przemieszczanie kabin wind w celu obsługi wezwań pasażerów z różnych pięter, minimalizując czas oczekiwania i zużycie energii.
Głównym celem edukacyjnym jest nauka modelowania maszyn stanów (State Machine), zarządzania kolejkami żądań z wykorzystaniem struktur takich jak `Queue<T>` oraz `PriorityQueue<TKey, TValue>` (dostępnej od .NET 6), oraz implementacji algorytmu sterowania windą (np. algorytmu SCAN / "Elevator Algorithm" stosowanego w prawdziwych windach i sterownikach dysków twardych).

**Wymagane funkcje:**
- **Model budynku i wind:** Klasy reprezentujące budynek (`Building`), piętra (`Floor`) oraz windę (`Elevator`) ze stanami: Stoi na piętrze, Jedzie w górę, Jedzie w dół, Drzwi otwarte, Przeciążenie.
- **Algorytm SCAN dla wind:** Logika decydująca o kierunku ruchu windy na podstawie zgłoszonych wezwań wewnętrznych (z kabiny) oraz zewnętrznych (z pięter), zapewniająca płynną obsługę pasażerów w jednym kierunku przed zmianą kierunku ruchu.
- **Kolejkowanie priorytetowe:** Obsługa wezwań VIP (np. winda strażacka lub wezwanie dyrektorskie) realizowana za pomocą priorytetów.
- **Pętla symulacji czasu dyskretnego:** Krok po kroku (tick-based simulation) aktualizacja stanu wind i wypisywanie ich pozycji oraz stanu pasażerów na ekranie konsoli.

**Porady implementacyjne i dobre praktyki:**
Do modelowania kierunku ruchu windy użyj typu wyliczeniowego `enum Direction { Idle, Up, Down }`. Zaimplementuj klasę `ElevatorController` jako centralny moduł koordynujący ruch wielu wind. Użycie `PriorityQueue<int, int>` z biblioteki systemowej ułatwi sortowanie docelowych pięter w zależności od aktualnego kierunku jazdy windy. Zwróć uwagę na obsługę warunków brzegowych (np. maksymalny udźwig windy – rzucanie zdarzenia `OnOverloaded`). Do symulacji upływu czasu (kroków symulacji) nie używaj wątków śpiących w pętli bez kontroli; stwórz czystą architekturę opartą na interfejsie `ISimulationClock` przekazywanym przez konstruktor (co ułatwi testowanie jednostkowe w przyszłości).
Wzorzec projektowy: *State (Stan)* (dla stanów windy), *Mediator* (kontroler wind koordynujący ruch i przydział zgłoszeń).
