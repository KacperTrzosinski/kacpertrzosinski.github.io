## 28. Parser i Ewaluator Zapytań SQL w Pamięci (In-Memory SQL Parser)

**Szczegółowy opis i cele edukacyjne:**
Większość baz danych posiada parser języka SQL, który tłumaczy tekst zapytania na instrukcje zrozumiałe dla silnika bazy. W tym projekcie napiszesz uproszczony parser SQL dla zapytań typu `SELECT` (obsługujący sekcje: `SELECT`, `FROM`, `WHERE`, `ORDER BY`). Parser ten będzie wykonywał zapytania na kolekcjach obiektów C# znajdujących się w pamięci (np. liście obiektów typu `User` lub `Product`).
Cel edukacyjny to zaawansowane przetwarzanie tekstów, tokenizacja składniowa (Lexing), walidacja słów kluczowych oraz dynamiczne budowanie predykatów filtrujących i sortujących (za pomocą wyrażeń lambda i delegatów) na podstawie tekstu wpisanego przez użytkownika.

**Wymagane funkcje:**
- **Lexer i Parser SQL:** Podział zapytania na tokeny i budowa obiektu reprezentującego strukturę zapytania (np. `SqlQuery` przechowujący listę wybieranych kolumn, nazwę tabeli/kolekcji, warunki WHERE oraz kryteria sortowania).
- **Ewaluacja warunków (WHERE clause):** Obsługa operatorów porównania `=`, `>`, `<`, `!=` oraz operatorów logicznych `AND` i `OR` dla filtracji danych.
- **Dynamiczne sortowanie (ORDER BY):** Dynamiczne sortowanie wynikowej kolekcji po wskazanej kolumnie, z obsługą modyfikatorów `ASC` i `DESC`.
- **Projekcja kolumn (SELECT):** Zwracanie obiektów zawierających wyłącznie wybrane właściwości (projekcja dynamiczna do anonimowych słowników klucz-wartość).

**Porady implementacyjne i dobre praktyki:**
Do dynamicznego filtrowania obiektów na podstawie warunków SQL zamiast powolnego sprawdzania refleksją w pętli, zaimplementuj prosty kompilator wyrażeń budujący drzewa wyrażeń (`System.Linq.Expressions.Expression`). Pozwala to na skompilowanie warunku tekstowego (np. `Age > 18`) bezpośrednio do natywnego delegata `Func<T, bool>` w czasie wykonywania programu, co drastycznie zwiększa wydajność. Jeśli drzewa wyrażeń są zbyt trudne na tym etapie, zaimplementuj bezpieczne sprawdzanie właściwości przez refleksję z cache'owaniem obiektów `PropertyInfo`.
Wzorzec projektowy: *Interpreter (Interpreter)* (do interpretacji i wykonania reguł zapytania SQL).
