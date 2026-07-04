## 44. Silnik Arytmetyki Macierzowej i Równań Liniowych (Matrix Math Engine)

**Szczegółowy opis i cele edukacyjne:**
Matematyka macierzowa jest fundamentem grafiki 3D, silników fizycznych gier oraz algorytmów uczenia maszynowego. Projekt polega na stworzeniu biblioteki oraz narzędzia CLI do wykonywania zaawansowanych operacji na macierzach i rozwiązywania układów równań liniowych.
Cel edukacyjny to utrwalenie wiedzy z zakresu algebry liniowej oraz implementacja tych koncepcji w C#. Projekt uczy projektowania obiektowego struktur danych (macierze o zmiennych wymiarach), przeciążania operatorów matematycznych w C#, wydajnego indeksowania dwuwymiarowego oraz optymalizacji obliczeń numerycznych (unikanie błędów zaokrągleń i wydajne zarządzanie pętlami).

**Wymagane funkcje:**
- **Klasa macierzy z przeciążeniem operatorów:** Klasa `Matrix` reprezentująca macierz o wymiarach $M \times N$ z przeciążonymi operatorami dodawania (`+`), odejmowania (`-`), mnożenia macierzy (`*`) oraz mnożenia przez skalar.
- **Obliczanie wyznacznika (Determinant):** Implementacja algorytmu obliczania wyznacznika macierzy kwadratowej metodą Laplace'a lub rozkładu LU.
- **Odwracanie macierzy (Inverse Matrix):** Wyznaczanie macierzy odwrotnej przy użyciu metody dopełnień algebraicznych lub eliminacji Gaussa-Jordana.
- **Rozwiązywanie układów równań liniowych:** Moduł obliczający wartości zmiennych dla układu równań liniowych zapisanego w postaci macierzowej $Ax = B$ przy użyciu wzorów Cramera lub eliminacji Gaussa.

**Porady implementacyjne i dobre praktyki:**
Do przechowywania elementów macierzy użyj jednowymiarowej tablicy `double[]` o rozmiarze $M \cdot N$ zamiast tablicy dwuwymiarowej `double[,]`. Przechowywanie danych w tablicy jednowymiarowej (tzw. Flat Array) drastycznie poprawia wydajność obliczeniową dzięki lepszemu wykorzystaniu pamięci podręcznej procesora (locality of reference). Indeksowanie komórki $(i, j)$ realizuje się wzorem: `index = i * Columns + j`. Przy implementacji dzielenia lub odwracania macierzy zawsze sprawdzaj, czy wyznacznik nie jest bliski zeru (z uwzględnieniem precyzji maszynowej, np. `Math.Abs(det) < 1e-9`), i rzucaj wyjątek `SingularMatrixException` w przypadku macierzy osobliwych.
Wzorzec projektowy: *Builder* (do tworzenia macierzy rzadkich lub specjalnych typów macierzy, np. jednostkowych).
