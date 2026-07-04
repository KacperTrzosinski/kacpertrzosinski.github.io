## 136. Parser i Kompilator Arkuszy SCSS/Sass do CSS (SCSS Sass Transpiler CLI)

**Szczegółowy opis i cele edukacyjne:**
Sass/SCSS to popularny preprocesor CSS, który rozszerza możliwości kaskadowych arkuszy stylów o funkcje takie jak zmienne (Variables), zagnieżdżenia reguł (Nesting), domieszki (Mixins) oraz dziedziczenie stylów. Praca z drzewami reguł CSS i ich kompilacja to doskonałe wyzwanie inżynieryjne z zakresu parsowania i analizy semantycznej.
Projekt polega na stworzeniu konsolowego kompilatora plików SCSS do czystego formatu CSS.
Cele edukacyjne to leksykalna tokenizacja formatu SCSS (analiza selektorów, bloków nawiasów `{}` oraz reguł), budowa drzewa składniowego stylów (Style AST), dynamiczne rozwiązywanie zależności zmiennych (Scope resolution) oraz rekurencyjne spłaszczanie zagnieżdżonych selektorów (Selector flattening) do postaci zrozumiałej dla przeglądarek.

**Wymagane funkcje:**
- **Parser składni SCSS:** Tokenizacja plików SCSS i budowa drzewa AST odzwierciedlającego zagnieżdżenie reguł (np. `nav { ul { li { color: red; } } }`).
- **Rozwiązywanie zmiennych (Variables scope):** Obsługa definicji zmiennych (np. `$primary-color: #333;`) i dynamiczne podmienianie ich wartości w deklaracjach stylów z uwzględnieniem zasięgu zmiennej (zasięg lokalny bloku vs zasięg globalny).
- **Spłaszczanie selektorów (Nesting compiler):** Zamiana zagnieżdżeń na płaskie reguły CSS (np. powyższy przykład staje się `nav ul li { color: red; }`). Obsługa referencji do rodzica za pomocą znaku `&` (np. `a { &:hover { color: blue; } }` staje się `a:hover { color: blue; }`).
- **Generowanie sformatowanego CSS:** Narzędzie zapisujące przetłumaczony arkusz do pliku `.css` z konfiguracją wyjściową: wersja z wcięciami (Expanded) lub wersja zminimalizowana bez białych znaków (Minified).

**Porady implementacyjne i dobre praktyki:**
Napisz parser zstępujący (Recursive Descent Parser). Do mapowania struktury zagnieżdżeń użyj rekurencyjnego rekordu `StyleNode` zawierającego selektor, listę deklaracji właściwości oraz listę dzieci (innych `StyleNode`). Do sprawdzania zmiennych przekaż strukturę typu stos zasięgów (Scope Stack) – słownik mapujący nazwy zmiennych na wartości, odkładany na stos przy wejściu do każdego bloku `{}` i zdejmowany z niego przy wyjściu, co zapewni poprawne przysłanianie zmiennych (variable shadowing).
Wzorzec projektowy: *Visitor (Wizytator)*, *Code Generation*, *Interpreter*.
