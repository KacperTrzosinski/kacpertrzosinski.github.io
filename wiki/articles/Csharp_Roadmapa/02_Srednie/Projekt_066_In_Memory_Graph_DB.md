## 66. Generyczna Baza Danych Grafowych w Pamięci (In-Memory Graph DB)

**Szczegółowy opis i cele edukacyjne:**
Bazy danych grafowych (np. Neo4j) przechowują dane w postaci wierzchołków (Nodes/Vertices) i krawędzi (Edges/Relationships) oznaczonych kluczami i wartościami właściwości. Zapytania w bazach grafowych skupiają się na szybkim przeszukiwaniu relacji.
Projekt polega na zaimplementowaniu w pamięci generycznej bazy danych grafowych.
Cele edukacyjne to projektowanie zaawansowanych, generycznych struktur danych (wierzchołki i krawędzie mogą posiadać dowolne typy identyfikatorów i ładunków właściwości, np. `Node<TId, TProps>`), tworzenie systemów indeksowania w pamięci (np. indeksowanie wierzchołków po właściwościach w celu szybkiego wyszukiwania w czasie $O(1)$) oraz implementacja języka zapytań opartego na wyrażeniach lambda do filtrowania ścieżek grafu.

**Wymagane funkcje:**
- **Generyczna struktura grafu:** Klasy `GraphDatabase<TId, TNodeProps, TEdgeProps>`, `Node<TId, TNodeProps>` oraz `Edge<TId, TEdgeProps>` reprezentujące skierowany graf z wagami i właściwościami na węzłach i krawędziach.
- **Wielokrotne indeksowanie (Indexing Layer):** Indeksy unikalne i nieunikalne oparte na `Dictionary` oraz `HashSet` ułatwiające błyskawiczne wyszukiwanie wierzchołków po ich atrybutach bez skanowania całego grafu.
- **Płynne wyszukiwanie relacji (Graph Traverser):** API umożliwiające pisanie zapytań typu: "Znajdź wszystkich ludzi o imieniu X, którzy posiadają krawędź typu 'Kupił' skierowaną do produktu o cenie > Y".
- **Spójność referencyjna:** Automatyczne usuwanie wszystkich powiązanych krawędzi w momencie usunięcia wierzchołka z bazy.

**Porady implementacyjne i dobre praktyki:**
Użyj generyków (`Generics`) z ograniczeniami typów (np. `where TId : notnull, IEquatable<TId>`). Do reprezentacji relacji wewnątrz klasy bazy użyj dwóch poziomów mapowania: słownika wierzchołków oraz słowników krawędzi wchodzących i wychodzących:
`Dictionary<TId, HashSet<Edge<TId, TEdgeProps>>> _outgoingEdges`.
Zapobiegnie to skanowaniu całego zbioru relacji przy wyszukiwaniu sąsiadów. Do dynamicznego indeksowania właściwości obiektów (które mogą mieć różne klucze) wykorzystaj wzorzec generycznego indeksu powiązanego z refleksją.
Wzorzec projektowy: *Unit of Work*, *Facade (Fasada)* (API bazy danych), *Strategy* (dla strategii przeszukiwania i indeksowania).
