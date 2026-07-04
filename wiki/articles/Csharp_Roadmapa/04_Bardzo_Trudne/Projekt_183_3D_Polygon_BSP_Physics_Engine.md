## 183. Silnik Fizyki Wielokątów 3D oparty o Drzewo BSP (3D Polygon BSP Physics Engine)

**Szczegółowy opis i cele edukacyjne:**
Symulacja fizyki 3D dla obiektów o nieregularnych kształtach (wielokąty wypukłe w przestrzeni trójwymiarowej - Convex Polyhedra / Mesh) to szczytowe osiągnięcie w dziedzinie matematyki obliczeniowej i silników fizyki. Wykrywanie kolizji takich ciał wymaga analizy ich geometrii w przestrzeni trójwymiarowej, co przy dużej liczbie obiektów stanowi ogromne wyzwanie wydajnościowe.
Projekt polega na stworzeniu od podstaw silnika fizyki 3D obsługującego kolizje wielościanów wypukłych poruszających się w środowisku statycznej geometrii zoptymalizowanej trójwymiarowym drzewem BSP.
Cele edukacyjne to implementacja algorytmu wykrywania kolizji wielościanów wypukłych za pomocą Twierdzenia o Osi Separującej (Separating Axis Theorem - SAT) w 3D, generowanie punktów kontaktu (Contact Manifold generation), wyliczanie momentu bezwładności i środka ciężkości dla wielościanów, oraz optymalizacja przestrzenna przy użyciu drzewa BSP 3D.

**Wymagane funkcje:**
- **Detektor kolizji SAT 3D:** Sprawdzanie osi separacji dla dwóch wielościanów wypukłych. W 3D osiami potencjalnej separacji są: wektory normalne do ścian obiektu A, wektory normalne do ścian obiektu B oraz iloczyny wektorowe ($N_A \times N_B$) wszystkich krawędzi obiektu A z krawędziami obiektu B.
- **Generowanie zbioru punktów kontaktu (Contact Manifold):** Wyznaczanie dokładnej geometrii styku ciał (wierzchołek-ściana, krawędź-krawędź) oraz wektora normalnej i głębokości kolizji w celu poprawnego zaaplikowania sił odbicia.
- **Fizyka obrotowa w 3D (Rotational Mechanics):** Zastosowanie tensorów bezwładności (Inertia Tensor 3x3), obliczanie prędkości kątowych, momentu pędu i przyspieszeń kątowych dla rotujących brył sztywnych 3D.
- **Optymalizacja BSP 3D dla statycznej sceny:** Podział przestrzeni 3D płaszczyznami o dowolnej orientacji, umożliwiający logarytmiczne wyszukiwanie kolizji wielościanów z geometrią otoczenia (np. podłoga, schody).

**Porady implementacyjne i dobre praktyki:**
Do obliczeń wektorowych i macierzowych wykorzystaj wbudowane w .NET typy zoptymalizowane pod SIMD: `System.Numerics.Vector3`, `System.Numerics.Matrix4x4` oraz `System.Numerics.Quaternion` do reprezentacji obrotów brył sztywnych (unikaj rotacji Eulera z powodu problemu blokady kierunku - Gimbal Lock). Tensor bezwładności wielościanu wypukłego wylicz metodą dekompozycji bryły na piramidy (z wierzchołkiem w środku ciężkości i podstawą jako trójkąty ścian wielościanu), oblicz tensor dla każdej piramidy i zsumuj je.
Wzorzec projektowy: *Convex Collision Detection (SAT 3D)*, *Physics Engine Architecture*, *Composite*.
