## 181. Optymalizujący Kompilator JIT Szablonów HTML do MSIL (Optimizing HTML JIT Compiler)

**Szczegółowy opis i cele edukacyjne:**
W zaawansowanych systemach kompilacji szablonów HTML (jak Razor/Blazor) prosty zapis instrukcji IL dla każdego tagu i fragmentu tekstu wciąż pozostawia miejsce na optymalizację. Cześć struktury szablonu jest statyczna (nigdy się nie zmienia), a część dynamiczna (zależy od modelu). Optymalizacja polega na statycznej analizie drzewa AST przed kompilacją w celu wyodrębnienia i wstępnego wyrenderowania (Pre-rendering) statycznych poddrzew (Static Subtree Hoisting), co pozwala na scalenie wielu operacji zapisu tekstu w jedno asynchroniczne wywołanie `Append` o stałej wartości.
Projekt polega na stworzeniu optymalizującego kompilatora JIT dla szablonów HTML.
Cele edukacyjne to zaawansowana optymalizacja drzew AST, statyczna analiza i detekcja niezmiennych elementów (Immutable node detection), dynamiczna generacja kodu IL w pamięci przy użyciu `ILGenerator`, oraz redukcja narzutu wywołań metod i optymalizacja czasu procesora.

**Wymagane funkcje:**
- **Analizator optymalizacji AST (Optimizer Pass):** Moduł badający drzewo AST szablonu przed fazą kompilacji. Algorytm oznacza wszystkie węzły, które nie zawierają odwołań do zmiennych modelu jako statyczne.
- **Static Subtree Hoisting:** Węzły statyczne są automatycznie łączone (scalane) na etapie analizy. Przykładowo, struktura `<div> <span> Hello </span> <p> World </p> </div>` (reprezentowana pierwotnie jako 5 węzłów AST i generująca 5 wywołań w IL) zostaje spłaszczona do jednego węzła statycznego `"<div><span>Hello</span><p>World</p></div>"` i generuje dokładnie jedno wywołanie `Append(string)`.
- **Kompilacja zoptymalizowanego kodu IL:** Generowanie kodu MSIL dla zoptymalizowanego drzewa AST, z zachowaniem instrukcji sterujących (pętle, warunki) dla gałęzi oznaczonych jako dynamiczne.
- **Porównanie wydajności (Simple JIT vs Optimizing JIT):** Benchmark porównujący czas generowania stron oraz liczbę instrukcji procesora przy użyciu prostego kompilatora JIT i nowego kompilatora optymalizującego.

**Porady implementacyjne i dobre praktyki:**
Implementacja optymalizatora opiera się na wzorcu Visitor. Węzeł AST (np. `TextNode`, `IfNode`, `ElementNode`) otrzymuje flagę `IsStatic`. Węzeł jest statyczny, jeśli wszystkie jego dzieci są statyczne i nie posiada odwołań do właściwości modelu (`ModelPropertyNode`). Podczas generowania kodu IL, zamiast wczytywać ten sam string wielokrotnie z puli stałych (ldstr), połączone ciągi statyczne można zadeklarować jako pola statyczne (Static fields) pomocniczej klasy i pobierać je za pomocą `ldsfld`, co jest optymalne pod kątem pamięci cache.
Wzorzec projektowy: *Visitor (Wizytator)*, *Subtree Hoisting*, *Optimizing JIT Compiler*.
