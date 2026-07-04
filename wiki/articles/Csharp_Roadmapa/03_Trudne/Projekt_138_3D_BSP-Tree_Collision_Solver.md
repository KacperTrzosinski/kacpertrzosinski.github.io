## 98. Silnik Kolizji 3D oparty o Drzewo BSP (3D BSP-Tree Collision Solver)

**Szczegółowy opis i cele edukacyjne:**
W grach 3D o zamkniętych, statycznych przestrzeniach (np. korytarze w grach typu FPS) najstarszą i bardzo wydajną techniką podziału przestrzeni jest drzewo BSP (Binary Space Partitioning / Dwójkowy Podział Przestrzeni). W przeciwieństwie do KD-Tree (które dzieli przestrzeń płaszczyznami prostopadłymi do osi układu współrzędnych), BSP pozwala na dzielenie przestrzeni płaszczyznami zorientowanymi pod dowolnym kątem, co jest idealne do reprezentacji geometrii ścian i wielokątów (Polygons).
Projekt polega na zaimplementowaniu silnika kolizji opartego o strukturę drzewa BSP.
Cele edukacyjne to matematyczne reprezentowanie płaszczyzn 3D, algorytm budowania drzewa BSP (klasyfikacja wielokątów względem płaszczyzny dzielącej, cięcie wielokątów płaszczyzną), oraz wykonywanie zapytania kolizyjnego (Ray-Casting i Sphere-Sweep) przeciwko geometrii sceny w czasie logarytmicznym $O(\log N)$.

**Wymagane funkcje:**
- **Algorytm budowania drzewa BSP (Slicing):** Generowanie drzewa binarnego na bazie wczytanej geometrii 3D (zestaw trójkątów/ścian). Algorytm wybiera jedną ze ścian jako płaszczyznę podziału i dzieli pozostałe ściany na dwie grupy: leżące z przodu (Front) i z tyłu (Back) płaszczyzny, w razie potrzeby tnąc trójkąty na mniejsze części.
- **Wyszukiwanie kolizji promienia (Ray Casting):** Algorytm wyznaczający punkt przecięcia linii/promienia (np. toru lotu pocisku) z geometrią BSP z pominięciem sprawdzania niewidocznych gałęzi drzewa.
- **Weryfikacja kolizji ciał (AABB / Sphere collision):** Wykrywanie kolizji poruszającej się sfery gracza z wielokątami zakodowanymi w strukturze drzewa BSP.
- **ASCII/Unicode Visualizer:** Konsolowe narzędzie generujące uproszczony schemat drzewa BSP z oznaczeniem podziałów przestrzennych.

**Porady implementacyjne i dobre praktyki:**
Płaszczyzna w przestrzeni 3D definiowana jest przez punkt $P$ i wektor normalny $N$. Równanie płaszczyzny to $Ax + By + Cz + D = 0$. Podczas klasyfikacji wierzchołków trójkąta względem płaszczyzny podziału, obliczasz dystans ze znakiem (Signed distance): $d = N \cdot (V - P)$. Jeśli dla wszystkich wierzchołków odległość $d > 0$, trójkąt jest z przodu; jeśli $d < 0$, jest z tyłu. Jeśli znaki są mieszane, trójkąt przecina płaszczyznę i musi zostać podzielony (Spliced) na dwa lub trzy mniejsze trójkąty za pomocą interpolacji liniowej punktów przecięcia krawędzi z płaszczyzną.
Wzorzec projektowy: *Composite (Kompozyt)*, *Strategy*.
