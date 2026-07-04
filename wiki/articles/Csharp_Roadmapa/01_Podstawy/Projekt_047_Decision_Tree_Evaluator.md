## 47. Silnik Ewaluacji Drzewa Decyzyjnego w Pamięci (Decision Tree Evaluator)

**Szczegółowy opis i cele edukacyjne:**
Drzewa decyzyjne są klasyczną strukturą reprezentacji reguł biznesowych oraz prostych modeli klasyfikacyjnych uczenia maszynowego. Projekt polega na zaimplementowaniu w pamięci silnika ewaluacyjnego, który na podstawie zdefiniowanego drzewa warunków potrafi zaklasyfikować wejściowe dane (np. profil klienta ubiegającego się o pożyczkę) do odpowiedniej decyzji końcowej (np. "Zaakceptowano", "Odrzucono", "Wymagana weryfikacja").
Cele edukacyjne to modelowanie struktur drzewiastych w C#, parsowanie złożonej struktury drzewa z formatu JSON, implementacja rekurencyjnego algorytmu przechodzenia węzłów oraz dynamiczne porównywanie wartości typów prymitywnych i tekstowych przy użyciu refleksji lub słowników dynamicznych.

**Wymagane funkcje:**
- **Hierarchia węzłów drzewa:** Klasa bazowa `TreeNode` oraz klasy pochodne: `ConditionNode` (zawierający regułę logiczną, np. `Age >= 18` oraz referencje do lewego i prawego dziecka) i `LeafNode` (węzeł decyzji końcowej).
- **Parsowanie definicji z JSON:** Wczytywanie struktury całego drzewa z pliku JSON (struktura zagnieżdżona) przy użyciu `System.Text.Json` i dynamiczna rekonstrukcja obiektów w pamięci.
- **Ewaluacja rekurencyjna:** Funkcja `Decision Evaluate(Record data)` przechodząca przez kolejne warunki drzewa na podstawie właściwości wejściowego rekordu danych aż do osiągnięcia liścia decyzyjnego.
- **Wizualizacja struktury drzewa:** Metoda wypisująca drzewo w postaci graficznej (tekstowej) w konsoli, pokazująca hierarchię warunków i liści.

**Porady implementacyjne i dobre praktyki:**
Zdefiniuj rekord wejściowy jako `Dictionary<string, object>` w celu uniknięcia sztywnego typowania danych wejściowych. Warunki wewnątrz `ConditionNode` powinny obsługiwać dynamiczne typowanie – na przykład, jeśli wartość w rekordzie to liczba całkowita, a warunek porównuje ją za pomocą operatora `>`, silnik musi poprawnie dokonać rzutowania typów (używając interfejsu `IComparable`). Do zapisu logiki warunków stwórz strukturę `Rule` składającą się z właściwości: nazwa pola, operator (np. `LessThan`, `Equals`), oraz wartość porównywana.
Wzorzec projektowy: *Composite (Kompozyt)* (do reprezentacji węzłów drzewa), *Interpreter* (do wykonywania reguł w węzłach).
