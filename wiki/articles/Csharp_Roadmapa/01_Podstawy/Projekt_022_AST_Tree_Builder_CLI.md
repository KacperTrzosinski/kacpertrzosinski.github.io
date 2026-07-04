## 22. Parser Notacji Prefiksowych i Drzew AST (AST Tree Builder CLI)

**Szczegółowy opis i cele edukacyjne:**
W informatyce drzewo składniowe (Abstract Syntax Tree - AST) reprezentuje strukturę kodu źródłowego programu lub wyrażenia. W tym projekcie zbudujesz parser wyrażeń zapisanych w notacji prefiksowej (np. LISP-like `(+ 3 (* 5 2))`) lub klasycznej, który przekształci ten zapis w drzewo AST w pamięci. Następnie program będzie potrafił przejść to drzewo na różne sposoby, zoptymalizować je (np. upraszczanie stałych: zamiana `3 + 5` na `8` bezpośrednio w strukturze drzewa) oraz wygenerować z niego kod w innej postaci.
Projekt uczy pracy z drzewiastymi strukturami danych, rekurencji (recursion), przechodzenia drzew (traversal algorithms: In-order, Pre-order, Post-order) oraz implementacji klasycznego wzorca projektowego *Visitor*.

**Wymagane funkcje:**
- **Analiza składniowa i budowa drzewa:** Parsowanie zapisu tekstowego i reprezentowanie go jako zagnieżdżone węzły klasy `ExpressionNode` (np. `BinaryExpressionNode`, `ConstantExpressionNode`, `VariableExpressionNode`).
- **Weryfikacja i przejścia drzewa:** Implementacja algorytmów przechodzenia drzewa (w głąb - DFS) w celach diagnostycznych i wyświetlania struktury (np. w postaci graficznej gałęzi z wcięciami w konsoli).
- **Optymalizacja drzewa (Constant Folding):** Przebieganie przez drzewo i automatyczne obliczanie węzłów, które zawierają wyłącznie stałe matematyczne, zastępując je jednym węzłem liczbowym.
- **Wzorzec Visitor do obliczeń i generowania kodu:** Użycie wizytora do wyliczenia wartości wyrażenia dla podanych zmiennych oraz drugiego wizytora do konwersji drzewa na notację postfiksową (RPN).

**Porady implementacyjne i dobre praktyki:**
Zdefiniuj klasę bazową `ExpressionNode` jako klasę abstrakcyjną z metodą `Accept(IExpressionVisitor visitor)`. Wszelkie operacje na drzewie (wyliczanie wartości, optymalizacja, wizualizacja) zaimplementuj w osobnych klasach implementujących interfejs `IExpressionVisitor` – dzięki temu unikniesz zaśmiecania klas węzłów logiką biznesową (zasada OCP - Open/Closed Principle). W metodach parsujących rekurencyjnie zabezpiecz kod przed przepełnieniem stosu (StackOverflowException) dla zbyt głęboko zagnieżdżonych struktur poprzez ograniczenie głębokości rekurencji.
Wzorzec projektowy: *Visitor (Wizytator)*, *Composite (Kompozyt)* (do reprezentacji drzewa).
