## 65. Symulator Układu Planetarnego z Fizyką Newtona (N-Body Orbit Simulator)

**Szczegółowy opis i cele edukacyjne:**
Symulacja oddziaływań grawitacyjnych wielu ciał (N-Body Simulation) to klasyczny problem fizyki i informatyki śledzący ruch planet, gwiazd czy satelitów pod wpływem wzajemnego przyciągania grawitacyjnego zgodnego z prawami Newtona.
Projekt polega na stworzeniu konsolowego symulatora układu planetarnego (np. Ziemia, Księżyc, Słońce oraz satelity).
Cele edukacyjne to modelowanie matematyczno-fizyczne (wektory 2D/3D), metody całkowania numerycznego (metoda Eulera oraz znacznie dokładniejsza metoda Rungego-Kutty czwartego rzędu - RK4), praca ze strukturami do obliczeń o wysokiej wydajności (unikanie alokacji obiektów w pętli fizycznej) oraz reprezentacja wyników w postaci dynamicznie aktualizowanego wykresu tekstowego lub logów pozycji.

**Wymagane funkcje:**
- **Model fizyczny ciał niebieskich:** Klasa lub struktura `CelestialBody` przechowująca masę, promień, wektor pozycji $\vec{r}$ oraz wektor prędkości $\vec{v}$ (wykorzystanie typu `System.Numerics.Vector3`).
- **Obliczanie sił grawitacyjnych:** Wyznaczanie wypadkowego wektora siły działającego na każde ciało ze strony wszystkich pozostałych ciał na podstawie prawa powszechnego ciążenia Newtona: $F = G \frac{m_1 m_2}{r^2}$.
- **Integracja numeryczna (Euler & RK4):** Implementacja dwóch silników całkowania równań ruchu różniczkowego do wyznaczania nowej pozycji i prędkości ciał w każdym kroku czasowym $dt$.
- **Wykrywanie kolizji:** Wykrywanie zderzeń ciał (gdy odległość między środkami jest mniejsza niż suma ich promieni) z obsługą łączenia mas (kolizja niesprężysta) lub niszczenia obiektów.

**Porady implementacyjne i dobre praktyki:**
Do zapisu wektorów 3D zamiast pisać własną klasę wykorzystaj wbudowany typ `System.Numerics.Vector3`. Jest on zoptymalizowany pod kątem instrukcji SIMD procesora (Single Instruction, Multiple Data), co pozwala na równoległe obliczenia na wektorach na poziomie sprzętowym (co drastycznie zwiększa wydajność symulacji). Zdefiniuj ciała niebieskie jako struktury (`struct`), a nie klasy, aby uniknąć fragmentacji sterty RAM przy milionach kroków obliczeniowych. Pamiętaj o problemie osobliwości grawitacyjnej – gdy dwa ciała znajdą się bardzo blisko siebie, siła grawitacji dąży do nieskończoności; aby temu zapobiec, dodaj mały współczynnik zmiękczający (gravitational softening factor) do mianownika wzoru.
Wzorzec projektowy: *Strategy (Strategia)* (do wyboru silnika integracji numerycznej: Euler vs RK4).
