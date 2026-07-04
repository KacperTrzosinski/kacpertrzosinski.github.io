## 41. Analizator Składniowy Kodu Źródłowego C# (Mini Roslyn Analyzer)

**Szczegółowy opis i cele edukacyjne:**
Narzędzia do statycznej analizy kodu (Lintery) badają kod bez jego uruchamiania w celu wykrycia błędów, naruszeń standardów kodowania oraz wyliczenia metryk kodu (np. złożoności cyklomatycznej).
Projekt polega na stworzeniu konsolowego parsera kodu źródłowego języka C# (nie używając biblioteki Roslyn). Parser ma za zadanie analizować strukturę klas i metod w plikach `.cs`.
Cele edukacyjne obejmują naukę tokenizacji słów kluczowych języka C# (`class`, `interface`, `public`, `void` itp.), zliczanie linii kodu (LOC - Lines of Code), wykrywanie komentarzy jednoliniowych (`//`) i blokowych (`/* */`), pomiar głębokości zagnieżdżenia klamer `{}` (wskazujący na potencjalnie skomplikowane bloki sterujące) oraz wykrywanie podstawowych antywzorców (np. puste bloki `catch`, zbyt długie klasy/metody).

**Wymagane funkcje:**
- **Skaner plików źródłowych:** Analiza rekurencyjna wskazanego folderu projektu i wczytywanie plików z rozszerzeniem `.cs`.
- **Ekstrator metryk LOC:** Wyliczanie dla każdego pliku oraz całego projektu: całkowitej liczby linii, linii z komentarzami, linii czystego kodu oraz pustych wierszy.
- **Detekcja deklaracji OOP:** Identyfikacja zdefiniowanych w plikach klas, interfejsów, struktur oraz ich metod za pomocą reguł wyszukiwania tekstowego i dopasowań nawiasów.
- **Linter kodowania (Anti-pattern Detector):** Automatyczne zgłaszanie ostrzeżeń o złych praktykach, takich jak: metody dłuższe niż 50 linii, puste bloki `catch { }` bez logowania, lub użycie zabronionych metod (np. `Thread.Sleep`).

**Porady implementacyjne i dobre praktyki:**
Zaimplementuj parser jako automat analizujący plik znak po znaku lub linia po linii. Zwróć szczególną uwagę na poprawne ignorowanie tekstu wewnątrz literałów string (np. klamry wewnątrz tekstu `"class MyTest { }"` nie powinny być zliczane jako struktura kodu). Wykorzystaj stos do zliczania zagnieżdżenia klamer `{}` i okrągłych nawiasów `()`. Ułatwi to wykrywanie miejsc, gdzie nawiasy nie są domknięte. Logikę reguł lintera zdefiniuj jako odrębne klasy implementujące wspólny interfejs `IRule`, co ułatwi rozszerzanie kodu o nowe kontrole w przyszłości.
Wzorzec projektowy: *Specification (Specyfikacja)* (dla reguł lintera), *Composite* (do zbierania metryk na poziomie plików i całego projektu).
