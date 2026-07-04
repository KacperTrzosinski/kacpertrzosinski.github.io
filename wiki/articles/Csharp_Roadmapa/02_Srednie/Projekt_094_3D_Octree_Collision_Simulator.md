## 94. Silnik Kolizji 3D oparty o Drzewo Ósemkowe (3D Octree Collision Simulator)

**Szczegółowy opis i cele edukacyjne:**
W symulacjach 3D, silnikach fizycznych i grach trójwymiarowych wykrywanie kolizji między setkami obiektów poruszających się w przestrzeni to kosztowna operacja o złożoności $O(N^2)$ (każdy z każdym). Aby zredukować liczbę testów kolizji, stosuje się przestrzenny podział danych (Spatial Partitioning).
Projekt polega na stworzeniu symulatora kolizji 3D (np. ruch samolotów/dronów w przestrzeni powietrznej), wykorzystującego strukturę Drzewa Ósemkowego (Octree) do podziału trójwymiarowej przestrzeni na mniejsze sześciany.
Cele edukacyjne to implementacja przestrzennej struktury danych Octree, zaawansowane obliczenia geometryczne 3D (Bounding Box, Bounding Sphere, detekcja przecięć), oraz optymalizacja złożoności obliczeniowej przeszukiwań kolizyjnych z $O(N^2)$ do $O(N \log N)$.

**Wymagane funkcje:**
- **Model fizyczny obiektów 3D:** Klasa `ColliderObject3D` reprezentująca obiekt w przestrzeni posiadający pozycję (`Vector3`), prędkość oraz obszar kolizyjny w postaci sfery (Bounding Sphere) lub prostopadłościanu (AABB - Axis-Aligned Bounding Box).
- **Struktura Drzewa Ósemkowego (Octree):** Klasa reprezentująca węzeł przestrzenny dzielący swój obszar na 8 równych pod-obszarów (dzieci) po przekroczeniu maksymalnej dopuszczalnej liczby obiektów w węźle.
- **Ruch i aktualizacja drzewa (Dynamic Octree):** Usługa aktualizująca pozycje obiektów w każdym kroku czasowym, wymuszająca przebudowę lub dynamiczną migrację obiektów między węzłami drzewa Octree.
- **Wyszukiwanie kolizji:** Wykrywanie par kolizyjnych – system sprawdza kolizje wyłącznie dla obiektów znajdujących się w tym samym węźle Octree lub w węzłach sąsiednich, ignorując obiekty odległe.

**Porady implementacyjne i dobre praktyki:**
Do zapisu wektorów 3D i obliczeń odległości wykorzystaj wbudowany typ `System.Numerics.Vector3` (wykorzystujący instrukcje SIMD). Klasa `OctreeNode` powinna mieć zdefiniowany graniczny sześcian (`BoundingBox`). Podział węzła (Split) następuje, gdy liczba obiektów przekroczy limit $M$ (np. 8). Podczas wyszukiwania kolizji, zamiast przebudowywać całe drzewo od zera w każdym kroku (co generuje narzut alokacji), zaimplementuj metodę aktualizacji `UpdateObjectPosition(object, oldPos, newPos)`, która przenosi obiekt do węzła nadrzędnego i potem w dół tylko wtedy, gdy obiekt opuścił granice dotychczasowego węzła.
Wzorzec projektowy: *Composite (Kompozyt)* (struktura Octree), *Strategy*.
