## 171. Kompilator JIT Silnika Szablonów HTML do MSIL (HTML Template JIT Compiler)

**Szczegółowy opis i cele edukacyjne:**
Renderowanie dynamicznych stron internetowych (szablonów HTML) na serwerze to jedno z najbardziej krytycznych zadań pod kątem wydajności (CPU/alokacje RAM). Klasyczny parser w locie (Interpreter) lub dynamiczne drzewa wyrażeń (.NET Expression Trees) nakładają pewien narzut. Aby osiągnąć maksymalną, ekstremalną wydajność porównywalną z kompilacją Razor, silnik powinien kompilować szablon HTML bezpośrednio do kodu bajtowego MSIL (Microsoft Intermediate Language) w locie (JIT), generując czysty kod maszynowy wykonujący operacje na strumieniach wyjściowych.
Projekt polega na stworzeniu kompilatora JIT dla silnika szablonów HTML. System parsuje szablon do AST, a następnie generuje surowe instrukcje IL platformy .NET, kompilując metodę dynamiczną w pamięci.
Cele edukacyjne to zaawansowana generacja kodu MSIL przy użyciu klasy `DynamicMethod` oraz `ILGenerator`, dynamiczne mapowanie instrukcji sterujących (`if`/`else`, pętle) na struktury skoków IL (labels, branches), oraz unikanie alokacji pamięci przy operacjach na ciągach znaków (poprzez dynamiczne generowanie wywołań metod `StringBuilder`).

**Wymagane funkcje:**
- **Kompilacja szablonu do IL (JIT compiler):** Program wczytuje drzewo AST szablonu i za pomocą `ILGenerator` emituje kod dla metody o sygnaturze `string Render(object model)`.
- **Wydajne renderowanie statycznego tekstu:** Zamiast operacji łączenia ciągów znaków (String concatenation), kompilator JIT wstrzykuje instrukcje ładujące statyczne bloki HTML na stos i wywołujące metodę `StringBuilder.Append(string)`.
- **Dynamiczne pętle i warunki w IL:** Generowanie instrukcji warunkowych (np. badanie wartości logicznej w modelu i skoki `Brfalse` / `Br`) oraz pętli po kolekcjach (np. wstrzykiwanie pobierania iteratora `IEnumerable.GetEnumerator`, wywoływanie w pętli `MoveNext` oraz pobieranie `Current`).
- **Benchmark wydajności (Interpreter vs JIT):** Porównanie czasu renderowania skomplikowanego, dużego szablonu tabeli danych w napisanym wcześniej interpreterze szablonów oraz w nowym kompilatorze JIT.

**Porady implementacyjne i dobre praktyki:**
Podczas generowania pętli `each` w kodzie IL, musisz samodzielnie zarządzać strukturą `try/finally` w celu wywołania metody `Dispose()` na iteratorze (`IEnumerator`), co zapobiega wyciekom zasobów w platformie .NET (jest to dokładne odwzorowanie tego, co kompilator C# robi pod spodem z pętlą `foreach`). Zadeklaruj lokalną zmienną `StringBuilder` wewnątrz dynamicznej metody (`ILGenerator.DeclareLocal(typeof(StringBuilder))`), zainicjalizuj ją konstruktorem na początku metody, a na samym końcu wywołaj `ToString()` i zwróć wynik.
Wzorzec projektowy: *Just-in-Time Compiler*, *Builder*, *Visitor*.
