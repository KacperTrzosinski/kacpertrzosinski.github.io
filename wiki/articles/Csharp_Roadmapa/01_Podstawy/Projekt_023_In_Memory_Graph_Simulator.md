## 23. Symulator Sieci Społecznościowej w Pamięci (In-Memory Graph Simulator)

**Szczegółowy opis i cele edukacyjne:**
Sieci społecznościowe (np. Facebook, LinkedIn) opierają się na grafach relacji między użytkownikami (węzły reprezentują ludzi, a krawędzie – znajomości). Projekt polega na stworzeniu w pamięci symulatora takiej sieci, umożliwiającego dodawanie użytkowników, tworzenie relacji (znajomości) o różnym statusie (np. bliski znajomy, obserwujący) oraz analizę powiązań między osobami.
Cele edukacyjne to opanowanie struktur grafowych (np. reprezentacja za pomocą listy sąsiedztwa – Adjacency List), implementacja klasycznych algorytmów przeszukiwania grafu: BFS (Breadth-First Search) do wyznaczania stopnia oddalenia między osobami (np. stopnie separacji / "znajomi znajomych") oraz DFS (Depth-First Search) do wykrywania spójnych grup/społeczności.

**Wymagane funkcje:**
- **Modelowanie grafu relacji:** Reprezentacja grafu nieskierowanego (lub skierowanego dla relacji "obserwuje") przy użyciu słownika powiązań `Dictionary<Guid, HashSet<Guid>>` dla optymalnego wyszukiwania relacji w czasie $O(1)$.
- **Stopnie separacji (BFS):** Obliczanie najkrótszej ścieżki powiązań między dwoma wybranymi użytkownikami (np. Jan -> Adam -> Piotr = 2 stopnie separacji).
- **Rekomendacja znajomych:** Sugerowanie nowych kontaktów na podstawie kryterium: wspólne zainteresowania oraz największa liczba wspólnych znajomych (analiza sąsiedztwa).
- **Wykrywanie społeczności (DFS/Connectivity):** Identyfikacja odizolowanych grup użytkowników, którzy mają relacje tylko wewnątrz swojej grupy i nie są połączeni z resztą sieci.

**Porady implementacyjne i dobre praktyki:**
Do reprezentacji użytkowników wykorzystaj niezmienny rekord `User` z właściwościami typu `Guid Id`, `string Name` oraz unikalnym zbiorem zainteresowań. Do śledzenia odwiedzonych węzłów w algorytmach BFS/DFS zawsze stosuj `HashSet<Guid>`, co zapobiega nieskończonym pętlom w grafach zawierających cykle. Zadbaj o wydajność – nie kopiuj całych kolekcji przy wyszukiwaniu połączeń. Jeśli to możliwe, używaj interfejsów `IEnumerable<T>` lub struktur tylko do odczytu (`IReadOnlyCollection<T>`).
Wzorzec projektowy: *Facade (Fasada)* (udostępniająca spójne metody API do zarządzania grafem sieci), *Strategy* (dla różnych kryteriów rekomendacji znajomych).
