## 97. Ewaluator Formuł Statystycznych w Arkuszu (Advanced Spreadsheet Solver)

**Szczegółowy opis i cele edukacyjne:**
Wzbogacenie reaktywnego arkusza kalkulacyjnego o zaawansowane funkcje matematyczno-statystyczne wymaga parsowania i ewaluacji zakresów komórek (np. `=SUM(A1:B3)` lub `=AVERAGE(C1:C10) * STDEV(D1:D10)`).
Projekt polega na rozbudowaniu silnika formuł arkusza o obsługę funkcji agregujących, zakresów dwuwymiarowych oraz dynamiczną walidację typów danych w komórkach.
Cele edukacyjne to zaawansowana analiza składniowa (wyrażenia regularne i parsowanie gramatyki przedziałów komórek typu `KolumnaWiersz:KolumnaWiersz`), implementacja algorytmów agregujących (średnia, odchylenie standardowe, wariancja) działających na dynamicznych zbiorach danych, oraz integracja logiki statystycznej z reaktywnym propagowaniem zmian.

**Wymagane funkcje:**
- **Obsługa zakresów dwuwymiarowych:** Parser potrafi poprawnie zidentyfikować zakres komórek podany jako argument funkcji (np. `A1:C3` reprezentuje zbiór 9 komórek w prostokącie od A1 do C3) i wyodrębnić ich aktualne wartości.
- **Silnik funkcji statystycznych:** Implementacja funkcji: `SUM`, `AVERAGE`, `MIN`, `MAX`, `COUNT` oraz `STDEV` (odchylenie standardowe) operujących na wartościach liczbowych z zakresów.
- **Dynamiczna walidacja typów (Coercion):** Automatyczna konwersja wartości tekstowych komórek na liczby zmiennoprzecinkowe w trakcie obliczeń statystycznych (lub ignorowanie komórek nieliczbowych z rzuceniem ostrzeżenia).
- **Złożone wyrażenia zagnieżdżone:** Obsługa zagnieżdżania funkcji wewnątrz innych operacji matematycznych, np. `=SUM(A1:A5) / AVERAGE(B1:B5)`.

**Porady implementacyjne i dobre praktyki:**
Zaimplementuj parser zakresów, który rozbija napis `A1:C3` na parę współrzędnych lewego górnego rogu (0, 0) i prawego dolnego rogu (2, 2), a następnie w pętli pobiera referencje do komórek z siatki. W silniku parsowania wyrażeń (zstępującym lub Shunting-Yard) dodaj obsługę wywołań funkcji jako oddzielnych tokenów. Zabezpiecz wyliczenia przed pustymi komórkami wewnątrz zakresów (które powinny być traktowane jako `0` lub ignorowane w zależności od funkcji, np. `COUNT` vs `SUM`).
Wzorzec projektowy: *Composite*, *Visitor (Wizytator)* (do przechodzenia drzewa składniowego formuły), *Interpreter*.
