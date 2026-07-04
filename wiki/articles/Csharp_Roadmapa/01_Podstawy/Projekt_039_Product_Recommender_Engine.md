## 39. Silnik Rekomendacji Produktowych w Pamięci (Product Recommender Engine)

**Szczegółowy opis i cele edukacyjne:**
Systemy rekomendacji są sercem nowoczesnych platform takich jak Netflix czy Amazon. Projekt polega na zaimplementowaniu w pamięci silnika rekomendacji, który sugeruje użytkownikowi produkty na podstawie jego historii ocen oraz ocen innych użytkowników o podobnych gustach (tzw. filtrowanie współdziałające - Collaborative Filtering).
Cele edukacyjne to zaawansowana praca z kolekcjami oraz zastosowanie matematyki (wektorów i miar podobieństwa) w języku C#. Uczestnik dowiaduje się, jak obliczyć podobieństwo cosinusowe (Cosine Similarity) lub indeks Jaccarda (Jaccard Index) między wektorami ocen użytkowników przy użyciu zapytań LINQ, jak wydajnie grupować dane oraz jak optymalizować wyszukiwanie sąsiadów w pamięci RAM.

**Wymagane funkcje:**
- **Baza ocen w pamięci:** Przechowywanie danych o użytkownikach, produktach i ocenach (skala 1-5) w strukturze słownikowej `Dictionary<Guid, Dictionary<Guid, int>>` (User -> Product -> Rating).
- **Wyliczanie podobieństwa użytkowników:** Funkcja obliczająca współczynnik podobieństwa między dwoma profilami przy użyciu metryki Cosine Similarity na ich wspólnych ocenach.
- **Generowanie rekomendacji (Prediction Engine):** Algorytm wyliczający przewidywaną ocenę dla produktów, których dany użytkownik jeszcze nie ocenił, na podstawie ocen podobnych użytkowników (k-najbliższych sąsiadów - kNN).
- **Filtrowanie i ranking:** Zwracanie posortowanej listy top $N$ produktów o najwyższej prognozowanej ocenie z pominięciem produktów już zakupionych/ocenionych.

**Porady implementacyjne i dobre praktyki:**
Unikaj wielokrotnego alokowania tablic przy obliczeniach matematycznych – zapytania LINQ typu `.Sum()` i `.Zip()` są bardzo czytelne, ale w pętli obliczeniowej dla tysięcy produktów mogą generować narzut na Garbage Collector. Przeprowadź mikro-optymalizację krytycznych metod za pomocą klasycznych pętli `for` operujących na tablicach. Do wyliczenia pierwiastków kwadratowych wykorzystaj klasę `System.Math.Sqrt`. Zabezpiecz silnik przed sytuacją braku wspólnych ocen (dzielenie przez zero w mianowniku wzoru na podobieństwo cosinusowe).
Wzorzec projektowy: *Strategy (Strategia)* (do przełączania algorytmów podobieństwa, np. Cosine vs Jaccard vs Pearson).
