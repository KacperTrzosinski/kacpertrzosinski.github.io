## 193. Silnik Fizyki Wielokątów 3D z Tarciem i Odbiciem (3D Polygon BSP Physics Friction)

**Szczegółowy opis i cele edukacyjne:**
Podstawowe silniki fizyki 3D często cierpią na brak stabilności – obiekty ślizgają się po powierzchniach bez końca lub drgają, gdy leżą na sobie w stosach (Unstable Stacking). Aby uzyskać realistyczne zachowanie spadających pudełek czy toczących się wielościanów, silnik fizyki musi wdrożyć zaawansowane modele tarcia statycznego i kinetycznego (Coulomb Friction Model), współczynnik restytucji (odbicia) oraz mechanizm usypiania obiektów w spoczynku (Rigid Body Sleep State).
Projekt polega na rozbudowaniu napisanego wcześniej silnika fizyki wielokątów 3D o precyzyjne obliczenia sił tarcia, tłumienia ruchu oraz optymalizację stanów spoczynku.
Cele edukacyjne to implementacja impulsowych modeli tarcia (Impulse-based Contact Solver), wyliczanie tarcia stycznego (Friction Anchors / Tangent Impulses), oraz projektowanie algorytmów wykrywania bezruchu ciał sztywnych (Sleeping/Waking logic).

**Wymagane funkcje:**
- **Impulsowy model tarcia Coulomba (Impulse Friction Solver):** Dla każdego punktu styku wielościanów silnik oblicza impuls normalny (siła odbicia) oraz powiązane z nim impulsy styczne (siła tarcia). Wektor tarcia leży na płaszczyźnie stycznej do kolizji, a jego maksymalna wartość jest ograniczona prawem Coulomba: $F_{friction} \le \mu \cdot F_{normal}$.
- **Tarcie statyczne i kinetyczne:** Rozróżnienie sytuacji, w której siła jest zbyt mała, aby poruszyć obiekt (tarcie statyczne blokujące ruch), od sytuacji, w której obiekt ślizga się spowalniany tarciem kinetycznym.
- **Współczynnik Restytucji (Restitution Coefficient):** Parametr określający sprężystość zderzenia – od zderzeń idealnie sprężystych (odbicie z zachowaniem prędkości) do idealnie niesprężystych (brak odbicia, pochłonięcie energii).
- **Zintegrowany moduł deaktywacji ciał (Sleeping Engine):** Gdy prędkość liniowa i kątowa bryły sztywnej spada poniżej zadanego progu przez określony czas, obiekt zostaje oznaczony jako "śpiący" (Asleep) i jest wyłączany z pętli obliczeń kolizji (ogromna oszczędność CPU), dopóki inne poruszające się ciało go nie uderzy.

**Porady implementacyjne i dobre praktyki:**
Rozwiązywanie kolizji ze stosem obiektów zrealizuj za pomocą iteracyjnego solvatora (Sequential Impulses Solver), wykonującego $M$ iteracji na sekundę dla wszystkich zderzeń na scenie. Do obsługi sił tarcia w 3D, po wyliczeniu normalnej kolizji $N$, wyznacz dwa prostopadłe do siebie wektory styczne $T_1$ i $T_2$ leżące na płaszczyźnie kolizji. Następnie oblicz impulsy tarcia wzdłuż obu tych kierunków. Podczas deaktywacji ciał (Sleeping), upewnij się, że algorytm automatycznie budzi (Wake up) wszystkie sąsiednie, śpiące bryły stykające się z nowo wybudzonym obiektem (propagacja impulsu ruchu w grafie kolizji).
Wzorzec projektowy: *Sequential Impulses Solver*, *Graph Propagation (Wake-up)*, *State*.
