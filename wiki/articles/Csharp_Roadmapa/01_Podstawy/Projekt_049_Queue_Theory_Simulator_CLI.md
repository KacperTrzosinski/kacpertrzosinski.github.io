## 49. Symulator Kolejki Jednokanałowej M/M/1 (Queue Theory Simulator CLI)

**Szczegółowy opis i cele edukacyjne:**
Teoria kolejek (Queueing Theory) zajmuje się matematycznym badaniem linii oczekiwania. Symulatory kolejek są kluczowe przy projektowaniu serwerów sieciowych (np. obsługa zapytań HTTP), systemów logistycznych i procesów produkcyjnych. Model M/M/1 oznacza: proces napływu zgłoszeń zgodny z rozkładem Poissona (M), czas obsługi zgodny z rozkładem wykładniczym (M) oraz jeden kanał obsługi (1).
Projekt polega na stworzeniu konsolowej symulacji dyskretnej (Discrete Event Simulation - DES) kolejki M/M/1.
Cele edukacyjne to implementacja pętli symulacji sterowanej zdarzeniami (Event-Driven Simulation), generowanie liczb losowych o zadanych rozkładach prawdopodobieństwa (metoda odwracania dystrybuanty - Inverse Transform Sampling) w C# oraz zbieranie i obliczanie statystyk: średniego czasu oczekiwania w kolejce, stopnia obciążenia serwera i średniej długości kolejki.

**Wymagane funkcje:**
- **Generowanie rozkładów wykładniczych:** Klasa pomocnicza przekształcająca pseudolosowe liczby o rozkładzie jednostajnym (`Random.NextDouble()`) na wartości o rozkładzie wykładniczym dla zadanych parametrów $\lambda$ (napływ) oraz $\mu$ (obsługa).
- **Lista zdarzeń (Event List / Priority Queue):** Przechowywanie przyszłych zdarzeń symulacji (np. `ArrivalEvent`, `DepartureEvent`) posortowanych chronologicznie za pomocą kolejki priorytetowej.
- **Pętla symulacji zdarzeniowej:** Krok po kroku przesuwanie zegara symulacji do momentu zajścia najbliższego zdarzenia z kolejki i aktualizacja stanu kolejki.
- **Raport statystyczny symulacji:** Wyliczanie i prezentowanie na koniec symulacji wskaźników wydajności systemu w porównaniu do teoretycznych wyników analitycznych (formuł Little'a).

**Porady implementacyjne i dobre praktyki:**
Wzór na wygenerowanie losowej zmiennej o rozkładzie wykładniczym z parametrem intensywności $L$ przy użyciu zmiennej losowej $U$ z przedziału $(0, 1)$ to: $X = -\ln(U) / L$. W C# zapiszesz to jako `-Math.Log(random.NextDouble()) / lambda`. Do zarządzania listą zdarzeń wykorzystaj klasę `PriorityQueue<SimulationEvent, double>`, gdzie kluczem (priorytetem) jest czas zajścia zdarzenia. Zapobiega to kosztownemu sortowaniu listy w każdym kroku symulacji. Wszystkie obliczenia czasu wykonuj na liczbach zmiennoprzecinkowych podwójnej precyzji (`double`).
Wzorzec projektowy: *State (Stan)* (do opisu stanów systemu: IDLE, BUSY), *Command (Polecenie)* (reprezentacja zdarzeń jako obiekty wykonywalne).
