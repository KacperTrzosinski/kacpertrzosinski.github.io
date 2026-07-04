## 77. Analizator Zależności Projektów C# z Wykrywaniem Cykli (C# Dependency Analyzer)

**Szczegółowy opis i cele edukacyjne:**
W dużych systemach składających się z dziesiątek projektów (plików `.csproj`) łatwo doprowadzić do niepotrzebnego skomplikowania struktury zależności. Najbardziej niebezpiecznym zjawiskiem są zależności cykliczne (Circular Dependencies), w których projekt A zależy od B, a B bezpośrednio lub pośrednio zależy od A. Powoduje to błędy kompilacji i uniemożliwia czysty podział kodu.
Projekt polega na stworzeniu narzędzia CLI analizującego pliki rozwiązań C# (`.sln`) i projekty `.csproj` w celu zbudowania grafu zależności i wykrycia cykli.
Cele edukacyjne to zaawansowane parsowanie plików XML (struktura pliku `.csproj`), reprezentacja grafów skierowanych, implementacja algorytmu Tarjana lub algorytmu przeszukiwania w głąb (DFS) do wykrywania silnie spójnych składowych (Strongly Connected Components - SCC) wskazujących na cykle, oraz sortowanie topologiczne grafu (Topological Sort).

**Wymagane funkcje:**
- **Parser plików XML (.csproj):** Wyszukiwanie tagów `<ProjectReference Include="..." />` i wyodrębnianie relacji zależności między projektami.
- **Modelowanie grafu skierowanego:** Klasa `DependencyGraph` przechowująca listę projektów (węzłów) i skierowanych krawędzi reprezentujących referencje.
- **Algorytm wykrywania cykli (Tarjan / DFS):** Analiza grafu pod kątem obecności cykli. Jeśli cykl zostanie wykryty, program wypisuje pełną ścieżkę zapętlenia (np. `ProjectA -> ProjectB -> ProjectC -> ProjectA`).
- **Sortowanie topologiczne (Build Order):** Wyznaczanie poprawnej kolejności kompilacji projektów (od tych bez zależności do najbardziej zależy).

**Porady implementacyjne i dobre praktyki:**
Pliki `.csproj` są dobrze sformatowanymi dokumentami XML. Do ich odczytu wykorzystaj nowoczesną klasę `System.Xml.Linq.XDocument` (LINQ to XML), która pozwala w prosty sposób wyszukiwać węzły przy użyciu zapytań LINQ, np. `doc.Descendants("ProjectReference")`. Przy detekcji cykli metodą DFS śledź stany węzłów (np. Nieodwiedzony, W trakcie odwiedzania - na stosie rekurencji, Odwiedzony), co pozwoli na wykrycie krawędzi wstecznych (back-edges) wskazujących na cykl.
Wzorzec projektowy: *Visitor (Wizytator)* (do przechodzenia grafu), *Composite*.
