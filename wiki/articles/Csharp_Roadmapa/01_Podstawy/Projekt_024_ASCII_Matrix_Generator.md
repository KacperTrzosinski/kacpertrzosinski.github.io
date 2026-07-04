## 24. Generator Kodów Kreskowych i QR w ASCII (ASCII Matrix Generator)

**Szczegółowy opis i cele edukacyjne:**
Wizualizacja danych bez interfejsu graficznego to spore wyzwanie. Ten projekt polega na stworzeniu konsolowego generatora uproszczonych kodów kreskowych (np. standardu Code 39 lub EAN-8) oraz kodów dwuwymiarowych (typu mini-QR) renderowanych na ekranie konsoli za pomocą znaków ASCII (np. spacji i pełnych bloków `█`).
Cele edukacyjne to praca z dwuwymiarowymi tablicami logicznymi (`bool[,]`), implementacja algorytmów obliczania cyfr kontrolnych (np. Modulo 10 lub sumy ważone) w celu weryfikacji poprawności wejściowego kodu, a także transformacja strumienia bitów na reprezentację tekstową w określonej rozdzielczości (pixel aspect ratio na konsoli).

**Wymagane funkcje:**
- **Kodowanie tekstu na bity (EAN/Code39):** Zamiana podanego ciągu cyfr na sekwencję pasków (ciemnych i jasnych) zgodnie ze specyfikacją kodowania danego standardu.
- **Obliczanie cyfry kontrolnej:** Algorytm walidujący poprawność wprowadzonego kodu (np. wyliczanie ostatniej cyfry dla kodu EAN-8).
- **Generowanie mini-matrycy QR:** Implementacja uproszczonego algorytmu kodowania tekstu w macierz 2D (np. matryca o rozmiarze 21x21 z naniesieniem stałych markerów pozycjonujących w rogach).
- **Renderowanie konsolowe (ASCII Canvas):** Klasa rysująca macierz logiczną na ekranie, biorąca pod uwagę wysokość znaku w konsoli (szerokość linii w znakach ASCII często musi być podwojona, aby paski kodu kreskowego były kwadratowe).

**Porady implementacyjne i dobre praktyki:**
Zaimplementuj klasę `AsciiCanvas`, która działa jak bufor ekranu – przechowuje stan pikseli w tablicy dwuwymiarowej `bool[,]` i udostępnia metody takie jak `DrawPixel(int x, int y)`, `DrawRectangle(...)` oraz `Clear()`. Na sam koniec jedna metoda renderująca powinna przekształcić stan bufora w jeden duży ciąg tekstowy za pomocą `StringBuilder` i wypisać go za pomocą `Console.Write`. Unikaj wielokrotnego wywoływania `Console.Write` dla każdego piksela z osobna, ponieważ operacje I/O konsoli systemowej są skrajnie wolne i spowodują migotanie obrazu oraz duże opóźnienia.
Wzorzec projektowy: *Bridge (Most)* (rozdzielający reprezentację logiczną kodu od sposobu jego rysowania).
