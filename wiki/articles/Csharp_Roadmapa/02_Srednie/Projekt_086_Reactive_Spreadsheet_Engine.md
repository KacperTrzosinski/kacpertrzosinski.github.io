## 86. Reaktywny Silnik Arkusza Kalkulacyjnego w Pamięci (Reactive Spreadsheet Engine)

**Szczegółowy opis i cele edukacyjne:**
W przeciwieństwie do podstawowego arkusza kalkulacyjnego, systemy produkcyjne wymagają w pełni reaktywnego modelu danych (Reactive Programming) – gdy wartość w jednej komórce ulega zmianie, wszystkie komórki w całej sieci zależności muszą zostać natychmiast zaktualizowane w zoptymalizowanej kolejności, bez zbędnych powtórzeń obliczeń.
Projekt polega na stworzeniu zaawansowanego, reaktywnego silnika arkusza kalkulacyjnego w pamięci, ze wsparciem dla wykrywania zależności, dynamicznego parsowania matematycznego i leniwej ewaluacji.
Cele edukacyjne to wdrożenie programowania reaktywnego w C#, budowanie dynamicznych grafów skierowanych acyklicznych (DAG) reprezentujących zależności formuł komórek, implementacja sortowania topologicznego w czasie rzeczywistym oraz obsługa asynchronicznej propagacji zdarzeń o zmianach stanu.

**Wymagane funkcje:**
- **Reaktywne komórki (Reactive Cells):** Komórki implementujące powiadomienia o zmianie wartości (np. za pomocą `INotifyPropertyChanged` lub strumieni reaktywnych `IObservable<T>`).
- **Dynamiczny graf zależności:** Silnik, który po wpisaniu nowej formuły (np. `=A1 + SUM(B1:B3)`) automatycznie analizuje tokeny w poszukiwaniu odniesień do komórek i rejestruje je jako krawędzie w grafie zależności.
- **Topologiczne odświeżanie wartości (DAG Solver):** Algorytm wyznaczający optymalną kolejność przeliczania komórek przy zmianie wartości początkowej, gwarantujący, że każda komórka zależna zostanie obliczona dokładnie raz.
- **Asynchroniczne aktualizacje i wątki:** Zmiany wartości komórek mogą zachodzić asynchronicznie na różnych wątkach, a silnik gwarantuje spójność obliczeń bez zakleszczeń.

**Porady implementacyjne i dobre praktyki:**
Do śledzenia powiązań komórek wykorzystaj graf skierowany reprezentowany jako `Dictionary<CellCoordinates, HashSet<CellCoordinates>> dependencies`. Gdy wartość komórki $X$ ulega zmianie, uruchom algorytm sortowania topologicznego (np. algorytm Kahna lub DFS z wykrywaniem cykli) na podgrafie osiągalnym z węzła $X$. Otrzymasz wtedy listę komórek w kolejności, w jakiej muszą zostać obliczone. Przykładowo, jeśli $Z$ zależy od $Y$, a $Y$ od $X$, kolejność to $X \rightarrow Y \rightarrow Z$. Do parsowania formuł matematycznych wewnątrz komórek wykorzystaj tokenizator napisany we wcześniejszych projektach.
Wzorzec projektowy: *Observer (Obserwator)*, *Composite (Kompozyt)*, *Topological Scheduler*.
