## 33. Konsolowy Arkusz Kalkulacyjny z Formułami (Mini Console Spreadsheet)

**Szczegółowy opis i cele edukacyjne:**
Arkusze kalkulacyjne (np. Excel) bazują na siatce komórek, w których wartości mogą być stałymi tekstowymi, liczbami lub formułami wyliczanymi na podstawie wartości innych komórek (np. `=A1+B2`).
Projekt polega na zaimplementowaniu w pamięci uproszczonego arkusza kalkulacyjnego o wymiarach np. 10x10.
Cele edukacyjne to zaawansowane mapowanie adresów komórek (np. "A1" oznacza wiersz 0, kolumnę 0), parsowanie i ewaluacja prostych zależności matematycznych, implementacja algorytmu wykrywania cykli (circular reference detection) za pomocą przeszukiwania grafu zależności (DFS), oraz dynamiczne odświeżanie wartości powiązanych komórek (reaktywność).

**Wymagane funkcje:**
- **Siatka komórek (Cell Grid):** Przechowywanie stanu komórek w tablicy dwuwymiarowej obiektów klasy `Cell`. Komórka może zawierać surowy tekst, liczbę lub formułę.
- **Ewaluator formuł:** Obsługa prostych operacji matematycznych (`+`, `-`, `*`, `/`) odwołujących się do innych komórek (np. `=C3*2`).
- **Wykrywanie zapętleń (Circular Dependency Detection):** Przed zatwierdzeniem nowej formuły system buduje tymczasowy graf zależności i sprawdza za pomocą przeszukiwania w głąb (DFS), czy nie powstanie cykl (np. A1 zależy od B1, a B1 zależy od A1).
- **Automatyczna aktualizacja (Propagation):** Gdy wartość komórki A1 ulega zmianie, wszystkie komórki, które zależą od A1, automatycznie przeliczają swoją wartość (propagacja zmian w grafie acyklicznym - DAG).

**Porady implementacyjne i dobre praktyki:**
Zaimplementuj klasę `Cell` z polami `RawValue` (np. string `=A1+10`) i `EvaluatedValue` (np. decimal `25`). Każda zmiana wartości powinna powodować powiadomienie komórek zależnych – przydatny będzie tu wzorzec Obserwatora lub delegaty powiązane z komórkami. Wykorzystaj algorytm sortowania topologicznego (Topological Sort) na grafie zależności, aby ustalić poprawną kolejność przeliczania wartości w arkuszu. Wszelkie błędy obliczeń (np. dzielenie przez zero lub błąd składni) powinny ustawiać `EvaluatedValue` na specjalną wartość błędu (np. `#VALUE!`, `#DIV/0!`, `#REF!`), zamiast przerywać działanie programu.
Wzorzec projektowy: *Observer (Obserwator)*, *Composite (Kompozyt)*.
