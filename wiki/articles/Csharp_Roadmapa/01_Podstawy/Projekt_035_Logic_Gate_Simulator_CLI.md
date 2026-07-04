## 35. Symulator Cyfrowych Układów Logicznych (Logic Gate Simulator CLI)

**Szczegółowy opis i cele edukacyjne:**
Projektowanie i symulacja układów scalonych wymaga reprezentacji komponentów elektronicznych (bramek logicznych, przewodów, sygnałów) w kodzie zorientowanym obiektowo. Bramki logiczne wykonują elementarne operacje (AND, OR, NOT, XOR), a ich wyjścia mogą być łączone z wejściami innych bramek tworząc skomplikowane sieci (np. sumatory, przerzutniki).
Cel edukacyjny tego projektu to zaawansowane modelowanie obiektowe (hierarchia klas bramek), dynamiczne zarządzanie sygnałami logicznymi (`true`/`false`), budowanie sieci powiązań za pomocą grafów skierowanych acyklicznych (DAG) oraz implementacja algorytmu wyliczania stanów wyjściowych (propagacja sygnału). Projekt uczy również wykrywania niepoprawnych pętli (sprzężeń zwrotnych) w układach kombinacyjnych.

**Wymagane funkcje:**
- **Model bramek logicznych:** Abstrakcyjna klasa `LogicGate` oraz klasy pochodne dla konkretnych bramek (np. `AndGate`, `OrGate`, `NotGate`) z dynamicznie definiowaną liczbą wejść i jednym wyjściem.
- **Połączenia sygnałowe (Wires):** Klasa reprezentująca połączenie elektryczne (przewód), które przenosi stan logiczny z wyjścia jednej bramki na wejście innej bramki.
- **Ewaluacja układu (Signal Propagation):** Algorytm wyliczający stany wszystkich wyjść po zmianie wartości wejść głównych (źródeł sygnału), realizowany przez sortowanie topologiczne.
- **Weryfikacja spójności:** Wykrywanie cykli w układzie (niepoprawnych zamkniętych pętli bez opóźnienia czasowego), które uniemożliwiają jednoznaczne obliczenie stanów logicznych.

**Porady implementacyjne i dobre praktyki:**
Każde wejście bramki powinno mieć referencję do przewodu wejściowego `Wire`. Kiedy stan na przewodzie wejściowym ulega zmianie, bramka powinna recalculate swój stan wyjściowy i przekazać go dalej na przewód wyjściowy. Do poprawnego wyliczania wartości w układach bez pętli zastosuj sortowanie topologiczne (np. algorytm Kahna), co pozwoli ustalić kolejność ewaluacji bramek od wejść głównych do wyjść końcowych. Zabezpiecz symulator przed nieskończoną propagacją w przypadku wykrycia pętli rzucając wyjątek `InvalidCircuitException`.
Wzorzec projektowy: *Composite (Kompozyt)* (do reprezentowania złożonych układów scalonych złożonych z mniejszych bramek), *Observer (Obserwator)* (do automatycznego powiadamiania o zmianie stanu przewodu).
