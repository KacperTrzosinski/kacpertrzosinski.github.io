## 173. Silnik Fizyki 3D oparty o Drzewo BSP (3D BSP Physics Engine)

**Szczegółowy opis i cele edukacyjne:**
Symulacje fizyczne w trójwymiarze (3D) dla dynamicznych obiektów (np. gracz reprezentowany jako elipsoida lub kapsuła, spadające skrzynie jako AABB) poruszających się wewnątrz skomplikowanych, statycznych środowisk 3D (np. labirynty, budynki) wymagają ultrawydajnego wykrywania kolizji. Drzewo BSP (Binary Space Partitioning) w 3D doskonale nadaje się do tego zadania, pozwalając na szybką lokalizację ścian, podłóg i sufitów, z którymi obiekt może wejść w kontakt.
Projekt polega na stworzeniu silnika fizyki 3D, który wykorzystuje trójwymiarowe drzewo BSP do wykrywania zderzeń i obliczania reakcji ciał na zderzenia.
Cele edukacyjne to matematyczne modelowanie kolizji w przestrzeni 3D, rzutowanie ruchu (Sweep tests) ciał (kuli/kapsuły) na drzewo BSP w celu znalezienia czasu kolizji (Time of Impact - TOI), obliczanie ślizgania się po płaszczyźnie kolizji (Sliding Plane Algorithm), oraz rozwiązywanie problemów z zakleszczaniem się obiektów wewnątrz geometrii (Depenetration).

**Wymagane funkcje:**
- **Detektor kolizji rzutowanego ruchu (Sweep Sphere / Capsule vs 3D BSP):** Algorytm obliczający, czy poruszająca się wzdłuż wektora $V$ sfera (lub kapsuła) zderzy się z płaszczyznami zakodowanymi w drzewie BSP, i wyznaczający dokładny punkt zderzenia oraz czas kolizji ($t \in [0, 1]$).
- **Algorytm ślizgania po ścianach (Sliding Response):** Gdy gracz idzie na ukos w stronę ściany, silnik nie zatrzymuje go całkowicie, lecz rzutuje wektor ruchu na płaszczyznę ściany (obliczenie wektora stycznego), pozwalając na płynne przesuwanie (ślizganie) się wzdłuż przeszkody.
- **Resolver kolizji dynamicznych ciał sztywnych:** Reakcje na zderzenia między wieloma spadającymi sferami a statyczną geometrią z uwzględnieniem tarcia i współczynnika sprężystości.
- **Konsolowy Renderer 3D w rzucie perspektywicznym:** Uproszczony silnik renderujący (np. rzutowanie wierzchołków 3D na ekran 2D konsoli w ASCII) pokazujący scenę testową z perspektywy kamery.

**Porady implementacyjne i dobre praktyki:**
Podczas rzutowania poruszającej się sfery o promieniu $R$ przeciwko płaszczyźnie $P$, możesz uprościć matematykę poprzez powiększenie płaszczyzny o wartość $R$ na zewnątrz (tzw. Minkowski Sum / Expand plane) i zredukowanie testu sfery do testu punktu (Point vs Expanded Plane). Algorytm ślizgania (Sliding) obliczamy wzorem: $V_{new} = V - (V \cdot N) \cdot N$, gdzie $V$ to wektor ruchu, a $N$ to znormalizowany wektor normalny płaszczyzny kolizji. Zaimplementuj tolerancję błędu (Epsilon) – zatrzymuj ruch o małą odległość (np. `0.001` jednostki) przed fizycznym punktem kolizji, aby zapobiec przenikaniu wierzchołków geometrii z powodu niedokładności obliczeń zmiennoprzecinkowych (`double` / `float`).
Wzorzec projektowy: *Minkowski Sum Collision Detection*, *State Machine*, *Game Loop*.
