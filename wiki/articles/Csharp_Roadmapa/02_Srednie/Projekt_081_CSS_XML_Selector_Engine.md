## 81. Parser Selektorów CSS w Dokumentach XML (CSS XML Selector Engine)

**Szczegółowy opis i cele edukacyjne:**
Wyszukiwanie elementów w plikach strukturyzowanych (np. HTML, XML) za pomocą selektorów CSS (np. `div.content > p.highlight`) jest powszechnie stosowane w web scrapingu, automatyzacji testów UI oraz parsowaniu konfiguracji. Klasyczne biblioteki (np. AngleSharp) ukrywają tę logikę.
Projekt polega na stworzeniu parsera selektorów CSS, który potrafi przeszukać drzewo dokumentu XML wczytane do pamięci (za pomocą klasy `XDocument`) i wyodrębnić węzły pasujące do zapytania.
Cele edukacyjne to zaawansowana analiza leksykalno-składniowa selektorów CSS, nawigacja po drzewiastych strukturach XML, implementacja reguł selekcji (tagi, klasy, identyfikatory, relacje rodzic-dziecko `>` oraz rodzeństwo), oraz optymalizacja przeszukiwania drzewa.

**Wymagane funkcje:**
- **Parser składni CSS Selector:** Tokenizacja i parsowanie selektora (np. `main #title.bold` -> znajdź element o id `title` i klasie `bold` będący potomkiem elementu `main`).
- **Wyszukiwanie i ewaluacja węzłów:** Przechodzenie drzewa `XElement` i sprawdzanie dla każdego węzła, czy spełnia reguły selekcji (tag name, atrybuty typu `id` i `class`).
- **Obsługa relacji (Combinators):** Interpretacja relacji przestrzennych: spacji (dowolny potomek), znaku `>` (bezpośredni syn), oraz `+` (bezpośrednie rodzeństwo).
- **Zintegrowany CLI Tester:** Konsolowe narzędzie, które pozwala wczytać plik XML, wpisać selektor CSS i natychmiast wyświetlić pasujące tagi i ich zawartość tekstową.

**Porady implementacyjne i dobre praktyki:**
Zaimplementuj selektor jako listę obiektów `SelectorToken` (gdzie każdy token ma regułę dopasowania oraz typ relacji z poprzednim elementem). Podczas przechodzenia drzewa XML wykorzystaj rekurencję lub metody LINQ to XML (np. `XElement.Elements()`, `XElement.Ancestors()`). Zadbaj o obszerne testowanie zachowania dla selektorów zawierających wiele zagnieżdżeń i kombinacji klas (np. `div.class1.class2`). Do sprawdzania klas w XML (gdzie klasa jest zapisana jako atrybut `class="c1 c2"`) zaimplementuj podział tekstu po spacjach i operację zbiorową w celu poprawnego wykrywania cząstkowych dopasowań.
Wzorzec projektowy: *Interpreter*, *Strategy*, *Composite*.
