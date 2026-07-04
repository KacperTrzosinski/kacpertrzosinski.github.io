## 42. Symulator Gry w Życie Conwaya w Konsoli (Conway's Game of Life CLI)

**Szczegółowy opis i cele edukacyjne:**
Gra w Życie Conwaya to najsłynniejszy przykład automatu komórkowego. Na dwuwymiarowej siatce komórki rodzą się, żyją lub umierają w kolejnych krokach czasowych (generacjach) według prostych reguł określających liczbę żywych sąsiadów.
Projekt polega na stworzeniu wydajnego, konsolowego symulatora Gry w Życie.
Cele edukacyjne to praca z dwuwymiarowymi tablicami, optymalizacja algorytmiczna obliczania stanów (unikanie alokacji pamięci w każdym kroku pętli symulacji), implementacja planszy toroidalnej (gdzie krawędzie planszy są połączone – komórka wychodząca za prawą krawędź pojawia się z lewej) oraz techniki podwójnego buforowania (Double Buffering) w celu płynnego odświeżania ekranu w konsoli.

**Wymagane funkcje:**
- **Inicjalizacja planszy toroidalnej:** Tworzenie siatki o zadanych wymiarach z możliwością wczytania wzorców startowych (np. glider, pulsar, blinker) z plików tekstowych lub losowego rozrzucenia żywych komórek.
- **Obliczanie nowej generacji:** Implementacja reguł Conwaya (mniej niż 2 sąsiadów -> śmierć z samotności, 2-3 sąsiadów -> przeżycie, dokładnie 3 sąsiadów -> narodziny, ponad 3 -> śmierć z przeludnienia) przy zachowaniu toroidalności planszy.
- **Wydajne renderowanie:** Aktualizacja widoku konsoli tylko dla tych komórek, które zmieniły swój stan w stosunku do poprzedniej generacji, co drastycznie przyspiesza działanie symulacji.
- **Sterowanie symulacją:** Opcje pauzy, ręcznego kroku w przód, zmiany prędkości symulacji oraz zapisu aktualnego stanu planszy do pliku tekstowego.

**Porady implementacyjne i dobre praktyki:**
Aby uniknąć ciągłej alokacji nowych tablic `bool[,]` dla każdej nowej generacji (co doprowadzi do natychmiastowego zapchania pamięci i częstego uruchamiania GC), zdefiniuj dwie tablice na początku działania programu: `bool[,] currentGrid` oraz `bool[,] nextGrid`. W każdym kroku obliczaj stan z tabeli `currentGrid`, zapisuj wynik do `nextGrid`, a na koniec zamień referencje obu tablic (Double Buffering) – to klasyczna, optymalna technika z zakresu grafiki komputerowej i symulacji. Do precyzyjnego odczytu sąsiadów na planszy toroidalnej użyj operatora modulo `%` do zawijania indeksów, np. `int neighborX = (x + dx + width) % width`.
Wzorzec projektowy: *State (Stan)*, *Double Buffer*.
