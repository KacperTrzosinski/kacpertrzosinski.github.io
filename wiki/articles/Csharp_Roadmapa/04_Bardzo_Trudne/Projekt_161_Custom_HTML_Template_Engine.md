## 161. Silnik Szablonów HTML i Parser od Zera (Custom HTML Template Engine)

**Szczegółowy opis i cele edukacyjne:**
Silniki renderowania szablonów (takie jak Razor, Liquid czy Handlebars) pozwalają na dynamiczne generowanie dokumentów HTML poprzez wstrzykiwanie zmiennych, wykonywanie pętli nad kolekcjami oraz warunkowe wyświetlanie bloków kodu. Stworzenie takiego silnika od podstaw to doskonała szkoła pisania analizatorów składniowych i kompilacji kodu.
Projekt polega na napisaniu w C# silnika szablonów HTML. System parsuje plik tekstowy z autorską składnią (np. `<h1>{{user.name}}</h1> {{if user.isAdmin}} <p>Admin panel</p> {{endif}}`), buduje drzewo składniowe AST i kompiluje je do wykonywalnej metody w locie.
Cele edukacyjne to leksykalna tokenizacja plików tekstowych, budowanie dynamicznych drzew AST z obsługą instrukcji warunkowych (`if`/`else`) oraz pętli (`each`), dynamiczne weryfikowanie ścieżek właściwości obiektów (Property Path Resolution, np. `user.address.street` za pomocą refleksji lub kodu kompilowanego), oraz szybkie renderowanie wyjściowego tekstu.

**Wymagane funkcje:**
- **Parser składni szablonu:** Tokenizator rozróżniający zwykły tekst HTML od znaczników szablonu (np. `{{variable}}`, `{{if condition}}`, `{{each item in collection}}`, `{{endif}}`, `{{endeach}}`).
- **Rozwiązywanie ścieżek właściwości (Property Resolver):** Mechanizm pobierający wartości z obiektów przekazanych jako kontekst renderowania na podstawie ścieżki tekstowej (np. parsowanie ścieżki `user.orders[0].price` i asynchroniczne pobranie jej refleksją z obiektu C#).
- **Obsługa instrukcji sterujących (Logic Control):**
  - *Warunki*: Blok `{{if expr}} ... {{else}} ... {{endif}}`.
  - *Pętle*: Blok `{{each item in list}} ... {{endeach}}`.
- **Kompilator szablonów (Dynamic Compilation):** Kompilacja sparsowanego szablonu do delegata typu `Func<object, string>`, co przyspiesza ponowne renderowanie tego samego szablonu z nowymi danymi (brak potrzeby ponownego parsowania tekstu).

**Porady implementacyjne i dobre praktyki:**
Do kompilacji szablonu do delegata wykorzystaj klasy Expression Trees z przestrzeni `System.Linq.Expressions`. Reprezentują one kod jako struktury danych, które można skompilować bezpośrednio w pamięci do silnie typowanego kodu maszynowego przy użyciu `Expression.Compile()`. Do efektywnego budowania wynikowego tekstu HTML wewnątrz generowanej metody używaj `StringBuilder` lub `StringWriter`. Unikaj spowalniającej refleksji w pętli renderującej – skompilowane Expression Trees automatycznie generują zoptymalizowany dostęp do pól i właściwości obiektów.
Wzorzec projektowy: *Interpreter*, *Visitor (Wizytator)*, *Expression Trees Compilation*.
