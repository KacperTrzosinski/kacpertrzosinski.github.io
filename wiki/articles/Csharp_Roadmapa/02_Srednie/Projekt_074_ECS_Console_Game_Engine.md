## 74. Silnik Gry 2D oparty o ECS w Konsoli (ECS Console Game Engine)

**Szczegółowy opis i cele edukacyjne:**
Architektura zorientowana obiektowo w silnikach gier (oparta o głębokie hierarchie dziedziczenia) często prowadzi do problemów z wydajnością z powodu złego ułożenia danych w pamięci (Cache Misses) oraz trudności w utrzymaniu kodu (tzw. "God Object" reprezentujące jednostki w grze). Nowoczesnym standardem w branży gier (np. silnik Unity, Unreal) jest wzorzec ECS (Entity Component System).
Projekt polega na stworzeniu konsolowego silnika gry 2D (np. klon Space Invaders lub Asteroids) opartego na własnym, napisanym od zera silniku ECS.
Cele edukacyjne to wdrożenie architektury ECS: separacja tożsamości (Entity jako zwykły identyfikator), czystych danych (Components jako struktury) oraz logiki (Systems operujące na zbiorach komponentów), a także optymalizacja ułożenia pamięci (Memory Locality) w C# za pomocą tablic struktur (Data-Oriented Design).

**Wymagane funkcje:**
- **Silnik ECS Core:** Klasy zarządzające cyklem życia: `EntityManager` (tworzenie i niszczenie identyfikatorów encji), `ComponentManager` (zarządzanie tablicami komponentów, np. `TransformComponent`, `VelocityComponent`, `RenderComponent`) oraz `SystemManager`.
- **Systemy przetwarzania logicznego:** Implementacja systemów: `MovementSystem` (aktualizuje pozycję na podstawie prędkości), `CollisionSystem` (wykrywa zderzenia ciał) oraz `RenderSystem` (rysuje obiekty w buforze ekranu konsoli).
- **Pętla gry z Delta Time (Game Loop):** Implementacja pętli aktualizującej stan gry w stałych odstępach czasu (np. 60 FPS) z poprawnym obliczaniem czasu różnicowego (`deltaTime`) w celu uniezależnienia prędkości fizyki od wydajności sprzętu.
- **Sterowanie i interakcja:** Obsługa asynchronicznego odczytu klawiatury przez system wejścia (`InputSystem`) w celu sterowania graczem bez zatrzymywania pętli gry.

**Porady implementacyjne i dobre praktyki:**
W ECS encja (`Entity`) to po prostu liczba całkowita `int` (lub opakowujący struct). Komponenty powinny być czystymi strukturami zawierającymi wyłącznie dane (żadnej logiki). Przechowuj komponenty jednego typu w płaskiej, ciągłej tablicy `T[]` indeksowanej identyfikatorami encji (lub przy użyciu struktur słownikowych o wysokiej wydajności). Taki układ (Data-Oriented Design) pozwala procesorowi na pobranie całej serii danych do pamięci L1/L2 cache przy jednym odczycie pamięci, co drastycznie zwiększa wydajność. Zaprojektuj systemy w taki sposób, aby implementowały wspólny interfejs, np. `IGameSystem` z metodą `Update(double deltaTime)`.
Wzorzec projektowy: *Entity Component System (ECS)*, *Game Loop*.
