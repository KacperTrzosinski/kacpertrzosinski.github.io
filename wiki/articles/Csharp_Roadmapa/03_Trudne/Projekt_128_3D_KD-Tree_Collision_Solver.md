## 128. Silnik Kolizji 3D oparty o Drzewo K-Wymiarowe (3D KD-Tree Collision Solver)

**Szczegółowy opis i cele edukacyjne:**
Oprócz drzew ósemkowych (Octree), inną niezwykle wydajną przestrzenną strukturą danych jest Drzewo K-Wymiarowe (K-Dimensional Tree / KD-Tree). KD-Tree to binarne drzewo poszukiwań, w którym każdy węzeł dzieli przestrzeń na pół wzdłuż jednej wybranej osi ($X$, $Y$ lub $Z$ naprzemiennie), co pozwala na doskonałe zbalansowanie podziału przestrzeni w zależności od rozkładu obiektów fizycznych.
Projekt polega na stworzeniu symulatora kolizji 3D dla dużej liczby poruszających się cząstek, wykorzystującego własną strukturę KD-Tree.
Cele edukacyjne to implementacja algorytmu budowania KD-Tree (gdzie oś podziału i punkt podziału są wyznaczane przez medianę współrzędnych obiektów), optymalizacja zapytań o najbliższego sąsiada (Nearest Neighbor Search - NNS) oraz przeszukiwania przedziałowego (Range Search) w przestrzeni trójwymiarowej.

**Wymagane funkcje:**
- **Algorytm budowania zbalansowanego KD-Tree:** Rekurencyjne budowanie drzewa binarnego z listy punktów 3D, z dynamicznym przełączaniem osi podziału ($X \rightarrow Y \rightarrow Z \rightarrow X$) i wyznaczaniem podziału w medianie w celu zbalansowania głębokości drzewa.
- **Ruch i reinsercja (Dynamic KD-Tree):** Mechanizm aktualizujący położenie obiektów. Ponieważ KD-Tree jest wrażliwy na ruch obiektów, system wdraża wydajny algorytm aktualizacji (przebudowa poddrzewa lub dynamiczne przenoszenie punktu).
- **Range Query Collision Detection:** Wyszukiwanie wszystkich obiektów w zadanym promieniu $R$ od wskazanego punktu w czasie $O(\log N)$ do sprawdzania kolizji sferycznych.
- **Zintegrowany CLI Benchmarker:** Narzędzie porównujące czas wykrywania kolizji przy użyciu KD-Tree, Octree oraz metody brute-force dla 10 000 poruszających się obiektów.

**Porady implementacyjne i dobre praktyki:**
Użyj typu `System.Numerics.Vector3` z włączoną optymalizacją SIMD dla obliczeń odległości euklidesowych. Podczas budowania KD-Tree, sortowanie listy obiektów przy każdym podziale w celu wyznaczenia mediany ma złożoność $O(N \log N)$, co spowalnia budowę drzewa. Aby to zoptymalizować, użyj algorytmu szybkiego wyboru (Quickselect) o średniej złożoności $O(N)$ do wyznaczenia mediany. Przy zapytaniu Nearest Neighbor, zaimplementuj sprawdzanie, czy odległość do płaszczyzny podziału aktualnego węzła jest mniejsza niż dotychczasowy najbliższy znaleziony dystans – jeśli nie, możesz bezpiecznie pominąć całe drugie poddrzewo (gałąź), co drastycznie przyspiesza przeszukiwanie.
Wzorzec projektowy: *Composite (Kompozyt)*, *Strategy (Strategia)*.
