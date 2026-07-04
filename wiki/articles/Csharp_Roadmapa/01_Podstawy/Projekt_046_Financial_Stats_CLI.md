## 46. Narzędzie CLI do Analizy Finansowej z Plików CSV (Financial Stats CLI)

**Szczegółowy opis i cele edukacyjne:**
Analiza statystyczna dużych zbiorów danych (Big Data) to chleb powszedni inżynierów oprogramowania pracujących w sektorze FinTech. Projekt polega na stworzeniu wydajnego narzędzia CLI, które wczytuje surowe dane transakcyjne z plików CSV i dokonuje zaawansowanej agregacji statystycznej.
Cele edukacyjne to zaawansowana praca na strumieniach plikowych, opanowanie operacji matematyczno-statystycznych w C# bez użycia gotowych bibliotek (np. wyliczanie odchylenia standardowego, mediany, percentyli 90/95/99 oraz współczynnika korelacji Pearsona między dwiema seriami danych) oraz optymalizacja agregacji LINQ pod kątem prędkości wykonania.

**Wymagane funkcje:**
- **Parsowanie i walidacja danych CSV:** Bezpieczne wczytywanie dużych plików z kwotami transakcji, walutami i znacznikami czasu.
- **Obliczenia statystyk opisowych:** Wyznaczanie średniej arytmetycznej, mediany (poprawne sortowanie serii danych), odchylenia standardowego (przebieg dwupasmowy lub algorytm Welforda) oraz percentyli.
- **Współczynnik korelacji Pearsona:** Obliczanie siły i kierunku zależności liniowej między dwoma zestawami danych (np. zależność wysokości zarobków od stażu pracy).
- **Grupowanie i analiza trendów (LINQ):** Wyliczanie miesięcznej stopy wzrostu, średniego koszyka zakupowego w różnych kategoriach oraz generowanie sformatowanego raportu tekstowego w CLI.

**Porady implementacyjne i dobre praktyki:**
Do wyznaczania odchylenia standardowego i średniej w jednym przejściu (co pozwala uniknąć dwukrotnego czytania strumienia pliku lub przechowywania wszystkich elementów w pamięci) zaimplementuj algorytm Welforda (Welford's algorithm for computing variance). Do obliczenia mediany i percentyli musisz posortować kolekcję danych – w przypadku dużych zbiorów tradycyjne `.OrderBy()` alokuje nową tablicę; rozważ użycie metod in-place `Array.Sort` lub `Span<T>.Sort` dla optymalizacji pamięci. Wyniki finansowe zaokrąglaj do odpowiednich miejsc po przecinku stosując typ `decimal` wszędzie tam, gdzie ma to znaczenie biznesowe.
