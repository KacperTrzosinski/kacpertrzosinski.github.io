## 85. Generator i Render Gantta / Osi Czasu w ASCII (ASCII Timeline Renderer)

**Szczegółowy opis i cele edukacyjne:**
Wizualizacja harmonogramów zadań (np. wykresy Gantta, osie czasu logów zdarzeń, plany projektów) w interfejsie konsolowym CLI ułatwia szybką analizę bez konieczności otwierania przeglądarki internetowej czy generowania ciężkich grafik.
Projekt polega na stworzeniu biblioteki oraz narzędzia CLI, które przyjmuje kolekcję zadań/zdarzeń (każde z określoną datą początkową, końcową, nazwą oraz statusem) i generuje przejrzysty, skalowalny wykres osi czasu renderowany za pomocą znaków graficznych ASCII (lub znaków specjalnych Unicode box-drawing).
Cele edukacyjne to implementacja algorytmów układu graficznego (Layout Algorithms) – mapowanie przedziałów czasu na stałe współrzędne ekranu (siatka kolumn i wierszy), obsługa przewijania i skalowania (Zoom In/Out) widoku osi czasu, oraz dynamiczne wykrywanie i zapobieganie nakładaniu się etykiet tekstowych w jednym wierszu (Collision detection in grid layouts).

**Wymagane funkcje:**
- **Dynamiczne mapowanie czasu na kolumny:** Algorytm obliczający szerokość pojedynczej kolumny w znakach konsoli w zależności od wybranego zakresu czasu (np. 1 kolumna = 1 dzień, 1 godzina lub 1 tydzień).
- **Rysowanie pasków zadań (Gantt bars):** Renderowanie pasków reprezentujących czas trwania zadań przy użyciu znaków typu `█`, `░`, `▒` lub obramowań Unicode, z sformatowaną etykietą tekstową wewnątrz lub obok paska.
- **Wielowierszowy układ bez kolizji:** Jeśli zadania nakładają się w czasie, system automatycznie rozsuwa je i umieszcza w osobnych wierszach (wyznaczanie wysokości wykresu).
- **Zintegrowany CLI Viewer ze skalowaniem:** Interfejs konsoli z obsługą klawiszy (np. `+`/`-` do przybliżania/oddalania zakresu czasu, strzałki do przewijania w lewo/prawo).

**Porady implementacyjne i dobre praktyki:**
Zaimplementuj klasę bufora graficznego `AsciiGrid`, która reprezentuje wirtualny ekran tekstowy o wymiarach $X \times Y$. Metody rysujące powinny modyfikować stan tego bufora. Do rozstrzygania nakładania się przedziałów zadań (Interval scheduling algorithm) posortuj zadania według daty rozpoczęcia, a następnie dla każdego zadania szukaj pierwszego wiersza na wykresie, w którym nie występuje konflikt czasu z już umieszczonymi tam zadaniami. Zabezpiecz renderowanie przed wyjściem poza granice bufora konsoli systemowej (`Console.WindowWidth`).
Wzorzec projektowy: *Composite*, *Strategy* (dla różnych stylów renderowania, np. Simple ASCII vs Fancy Unicode).
