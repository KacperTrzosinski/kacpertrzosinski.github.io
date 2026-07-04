## 131. Silnik Serwera GraphQL i Parser Zapytań od Zera (Custom GraphQL Server)

**Szczegółowy opis i cele edukacyjne:**
Standard GraphQL pozwala klientom na precyzyjne definiowanie struktury danych, które chcą otrzymać w odpowiedzi z serwera, eliminując problem pobierania zbyt wielu (Over-fetching) lub zbyt mało (Under-fetching) informacji. Zrozumienie sposobu, w jaki silnik GraphQL parsuje zapytanie, analizuje typy i rozwiązuje pola (Resolvers) to wyzwanie z pogranicza teorii kompilatorów i systemów typów.
Projekt polega na stworzeniu od zera uproszczonego silnika GraphQL. Serwer wczytuje tekstowe zapytanie GraphQL (np. `{ user(id: 1) { name email orders { id total } } }`), parsuje je do drzewa AST (Abstract Syntax Tree), weryfikuje poprawność z zdefiniowanym schematem typów, a następnie wykonuje to drzewo, wywołując powiązane funkcje rezolwujące (Resolvers) i formatuje wynikowy dokument JSON.
Cele edukacyjne to leksykalna i składniowa analiza zapytań GraphQL, budowa i ewaluacja drzew AST, dynamiczne wyszukiwanie typów w C# za pomocą refleksji, oraz zapobieganie problemowi wydajnościowemu $N+1$ za pomocą implementacji wzorca DataLoader.

**Wymagane funkcje:**
- **Parser zapytań GraphQL AST:** Tokenizacja i parsowanie dokumentu zapytania w poszukiwaniu pól, argumentów i zagnieżdżeń, budujące hierarchiczną strukturę AST.
- **Definicja schematu i typów (GraphQL Schema):** API pozwalające zdefiniować typy obiektów, ich pola oraz powiązane z nimi metody (Resolvers) bezpośrednio w kodzie C#.
- **Ewaluator zapytań (Execution Engine):** Silnik przechodzący po drzewie AST i wywołujący rezolwery dla każdego pola, agregujący wyniki do zagnieżdżonego słownika/obiektu JSON.
- **Implementacja DataLoadera (N+1 query solver):** Zaimplementowanie buforowania i grupowania zapytań (Batching) za pomocą klasy DataLoader, co pozwala na zebranie wszystkich identyfikatorów żądań podrzędnych (np. zamówień dla wielu użytkowników) i pobranie ich z bazy jednym zapytaniem SQL `IN (...)` zamiast osobnymi zapytaniami dla każdego użytkownika.

**Porady implementacyjne i dobre praktyki:**
Do budowania parsera wykorzystaj technikę rekurencyjnego schodzenia (Recursive Descent Parsing). Wykonując zapytanie, przekaż obiekt kontekstu `ExecutionContext`. Wzorzec DataLoader polega na opóźnianiu faktycznego wykonania zapytania – rezolwer zamiast bezpośrednio pobierać dane z bazy, zwraca obiekt typu `Task<T>`, rejestrując potrzebny identyfikator w kolejce DataLoadera. Gdy faza odczytu danego poziomu drzewa się zakończy, DataLoader odpala asynchroniczną funkcję wsadową (Batch Function), pobiera wszystkie rekordy na raz i zasila czekające zadania `Task`.
Wzorzec projektowy: *Interpreter*, *DataLoader*, *Composite*, *Flyweight*.
