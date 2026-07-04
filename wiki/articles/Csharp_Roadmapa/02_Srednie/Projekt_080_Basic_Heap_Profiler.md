## 80. Narzędzie CLI do Analizy Alokacji i Profilowania Sterty (Basic Heap Profiler)

**Szczegółowy opis i cele edukacyjne:**
Optymalizacja aplikacji pod kątem zużycia pamięci wymaga profilowania steraty. W środowisku .NET Garbage Collector wykonuje świetną robotę, ale nieodpowiednie zarządzanie obiektami (np. wycieki pamięci przez silne referencje zdarzeń, nadmierne alokacje w pętli) może doprowadzić do degradacji wydajności.
Projekt polega na stworzeniu konsolowego profilera pamięci, który monitoruje alokacje pamięci dla wybranego wątku lub całego procesu w trakcie wykonywania określonych operacji testowych.
Cele edukacyjne to praca z diagnostyką systemową .NET (`System.Diagnostics`), pobieranie informacji o generacjach GC (Gen 0, Gen 1, Gen 2, LOH), zliczanie alokacji pamięci na wątek przy użyciu `GC.GetAllocatedBytesForCurrentThread()`, oraz wykrywanie potencjalnych wycieków pamięci za pomocą analizy zmian rozmiaru sterty w czasie.

**Wymagane funkcje:**
- **Pomiar alokacji operacji:** API w postaci klasy `AllocationTracker`, które pozwala owinąć dowolną operację (np. wyrażenie lambda) i zmierzyć dokładną liczbę bajtów zaalokowanych na stercie w trakcie jej wykonywania.
- **Monitorowanie GC (Garbage Collection Monitoring):** Zliczanie liczby uruchomień poszczególnych generacji GC w trakcie testu za pomocą `GC.CollectionCount(generation)`.
- **Weryfikacja wycieków pamięci (Leak Detector):** Narzędzie, które uruchamia operację wielokrotnie, wymusza pełne Garbage Collection (`GC.Collect()`) i bada, czy po zebraniu niepotrzebnych obiektów baza pamięci procesu stale rośnie (co wskazuje na wyciek referencyjny).
- **Raport profilowania w CLI:** Generowanie statystyk w postaci tabeli pokazującej zaalokowane bajty, czas trwania operacji, współczynnik alokacji na milisekundę oraz zużycie pamięci RAM procesu (Working Set).

**Porady implementacyjne i dobre praktyki:**
Pomiary alokacji za pomocą `GC.GetAllocatedBytesForCurrentThread()` są bardzo precyzyjne, ale mierzą tylko alokacje dokonane przez bieżący wątek. Jeśli profilowana operacja uruchamia zadania w tle (`Task.Run`), musisz śledzić alokacje całego procesu lub zsumować alokacje na zaangażowanych wątkach. Przed rozpoczęciem pomiaru wykonaj tzw. rozgrzewkę (Warmup) kodu, aby wyeliminować narzut kompilatora JIT (Just-In-Time compilation), który alokuje pamięć na struktury wewnętrzne przy pierwszym uruchomieniu metody.
Wzorzec projektowy: *Proxy (Pełnomocnik)* (do wstrzykiwania kodu profilującego), *Diagnostic Profiler*.
