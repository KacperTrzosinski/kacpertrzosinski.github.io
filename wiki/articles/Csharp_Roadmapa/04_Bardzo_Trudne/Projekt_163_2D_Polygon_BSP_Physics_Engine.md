## 163. Silnik Fizyki Wielokątów 2D oparty o Drzewo BSP (2D Polygon BSP Physics Engine)

**Szczegółowy opis i cele edukacyjne:**
Większość prostych silników fizyki obsługuje wyłącznie kolizje kół i prostokątów (Bounding Boxes). Wykrywanie zderzeń i obliczanie fizyki dla ciał o skomplikowanych kształtach (wielokąty wklęsłe i wypukłe - Polygons) wymaga zaawansowanej matematyki wektorowej oraz wydajnej przestrzennej indeksacji, aby uniknąć drastycznego spadku wydajności.
Projekt polega na stworzeniu w pełni funkcjonalnego silnika fizyki 2D obsługującego ciała o dowolnych kształtach wielokątów wypukłych.
Cele edukacyjne to implementacja algorytmu wykrywania kolizji wielokątów wypukłych za pomocą Twierdzenia o Osi Separującej (Separating Axis Theorem - SAT), obliczanie pędu i momentu bezwładności dla rotujących wielokątów (Angular Impulse / Rotational Dynamics), oraz optymalizacja sprawdzania kolizji za pomocą dwuwymiarowego drzewa BSP (Binary Space Partitioning) do statycznej geometrii sceny (np. ściany, mapy).

**Wymagane funkcje:**
- **Detektor kolizji SAT (Separating Axis Theorem):** Rzutowanie wierzchołków obu wielokątów na osie normalne do ich krawędzi. Jeśli na wszystkich osiach rzuty wielokątów nakładają się (Overlap), dochodzi do kolizji. Algorytm wyznacza wektor minimalnego przesunięcia (Minimum Translation Vector - MTV) określający głębokość i kierunek kolizji.
- **Fizyka obrotowa (Rigid Body Rotational Dynamics):** Uwzględnienie prędkości kątowej (Angular Velocity), momentu pędu, momentu bezwładności wielokąta (Inertia Tensor) oraz punktu przyłożenia siły kolizji w celu wywołania realistycznego obracania się ciał po zderzeniu.
- **Drzewo BSP 2D dla geometrii mapy:** Podział statycznej mapy za pomocą linii podziału pod dowolnym kątem, co pozwala na błyskawiczne wykluczanie sprawdzania kolizji wielokątów z dalekimi ścianami.
- **Zintegrowany CLI Simulator:** Wizualizacja spadających i odbijających się wielokątów na ekranie konsoli w stałym klatkażu.

**Porady implementacyjne i dobre praktyki:**
Wielokąt wypukły reprezentuj jako uporządkowaną listę wierzchołków `Vector2` (zgodnie z ruchem wskazówek zegara). Do obliczenia momentu bezwładności i środka masy wielokąta wypukłego o jednorodnej gęstości wykorzystaj geometryczny algorytm triangulacji (podział wielokąta na trójkąty, obliczenie masy i bezwładności dla każdego trójkąta i zsumowanie ich za pomocą twierdzenia Steinera o osiach równoległych). Podczas zderzenia, punkt kontaktu (Contact Point) jest wyznaczany jako punkt przecięcia krawędzi – obliczanie siły odbicia musi uwzględniać odległość tego punktu od środków masy obu zderzających się ciał.
Wzorzec projektowy: *Separating Axis Theorem Solver*, *Game Loop*, *Composite*.
