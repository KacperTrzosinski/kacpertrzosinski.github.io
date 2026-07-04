## 92. Generator Diagramów Klas Mermaid z Kodu C# (Mermaid Diagram Generator)

**Szczegółowy opis i cele edukacyjne:**
Wizualizacja powiązań między klasami ułatwia zrozumienie architektury systemu. Mermaid.js to popularne narzędzie, które pozwala generować diagramy (w tym diagramy klas UML) z prostego formatu tekstowego osadzanego w plikach Markdown.
Projekt polega na stworzeniu narzędzia CLI, które analizuje pliki kodu źródłowego C# (`.cs`) i automatycznie generuje kod diagramu klas w formacie Mermaid, odzwierciedlający strukturę dziedziczenia, implementację interfejsów oraz asocjacje (powiązania) między klasami.
Cele edukacyjne to leksykalna analiza kodu C# w poszukiwaniu definicji typów, wykrywanie relacji między klasami (dziedziczenie `:`, pola i właściwości będące instancjami innych klas), oraz generowanie tekstu kodu diagramu zgodnie ze składnią Mermaid class diagram.

**Wymagane funkcje:**
- **Skanowanie kodu C#:** Parsowanie plików tekstowych `.cs` w poszukiwaniu słów kluczowych `class`, `interface`, `struct` i wyodrębnianie ich nazw oraz metod/pól.
- **Detekcja dziedziczenia i interfejsów:** Wykrywanie relacji typu "jest" (Inheritance/Implementation, np. `class A : B, IC` generuje w Mermaid relację `B <|-- A` oraz `IC <|.. A`).
- **Analiza asocjacji (Dependency Detection):** Badanie typów pól i właściwości wewnątrz klasy – jeśli klasa A posiada pole typu B, program generuje relację asocjacji `A --> B`.
- **Eksport do Markdown:** Generowanie kompletnego pliku `.md` zawierającego blok kodu ` ```mermaid ` ze strukturą diagramu klas, właściwościami oznaczonymi odpowiednimi modyfikatorami widoczności (`+` public, `-` private).

**Porady implementacyjne i dobre praktyki:**
Do wyszukiwania struktur klas i ich powiązań w plikach tekstowych C# bez użycia ciężkich narzędzi parsujących (jak Roslyn) napisz wydajny Lexer analizujący słowa kluczowe i nawiasy klamrowe, lub użyj precyzyjnie skonstruowanych wyrażeń regularnych (`Regex`). Zabezpiecz generator przed zapętleniami i duplikacją węzłów na diagramie (np. jeśli klasa A zależy od B, a B od A, relacje powinny być narysowane, ale same klasy zdefiniowane w pliku Mermaid tylko raz).
Wzorzec projektowy: *Visitor (Wizytator)*, *Code Generation*.
