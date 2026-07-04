## 191. JIT Kompilator Szablonów HTML z Buforowaniem w Pamięci (HTML Template JIT Cache)

**Szczegółowy opis i cele edukacyjne:**
Gdy kompilujemy szablony HTML w locie do dynamicznego kodu IL (JIT), każda modyfikacja kodu szablonu (np. przy wdrożeniach lub podczas edycji na żywo w trybie deweloperskim - Hot-Reload) wymaga ponownej kompilacji. Bez odpowiedniego mechanizmu zwalniania pamięci, wielokrotne generowanie i ładowanie dynamicznych zespołów (Dynamic Assemblies) powoduje wyciek pamięci (Assembly Leak), ponieważ raz załadowany zespół nie może zostać zwolniony z pamięci RAM przez standardowy proces Garbage Collector.
Projekt polega na rozbudowaniu optymalizującego kompilatora JIT szablonów HTML o zaawansowany moduł zarządzania pamięcią cache z obsługą zwalniania załadowanych typów.
Cele edukacyjne to implementacja zwalnialnych kontekstów ładowania zespołów (`AssemblyLoadContext` - ALC), dynamiczny Hot-Reload szablonów bez wycieków pamięci na stercie .NET, oraz implementacja mechanizmów wygaszania (LIRS / LRU caching) skompilowanych delegatów.

**Wymagane funkcje:**
- **Zwalnialny Kontekst Zespołów (Collectible AssemblyLoadContext):** Kompilacja dynamicznych metod i typów odbywa się wewnątrz dedykowanej instancji klasy `AssemblyLoadContext` oznaczonej jako `isCollectible: true`.
- **Moduł Hot-Reload z detekcją zmian plików:** Monitorowanie plików szablonów na dysku. Przy zmianie pliku, silnik automatycznie kompiluje nowy kod w osobnym kontekście ALC, kieruje nowe żądania do nowego kodu, a stary ALC zwalnia (`Unload()`), umożliwiając usunięcie go z RAM-u przez Garbage Collector.
- **Szybki Cache Skompilowanych Szablonów (High-Performance Compilation Cache):** Słownik przechowujący skompilowane delegaty w pamięci, kluczowany haszem MD5 zawartości szablonu, zapobiegający ponownym kompilacjom tych samych struktur.
- **Detekcja wycieków pamięci (GC Leak Monitor):** Narzędzie diagnostyczne wbudowane w CLI pokazujące liczbę aktywnych załadowanych ALC oraz informujące o zwolnieniu pamięci po wymuszeniu GC.

**Porady implementacyjne i dobre praktyki:**
Aby zwalnialny `AssemblyLoadContext` mógł zostać poprawnie zebrany przez GC po wywołaniu metody `Unload()`, nie mogą do niego prowadzić żadne silne referencje (Strong References) z głównego programu. Oznacza to, że delegat do renderowania szablonu zwrócony z ALC musi być trzymany w pamięci głównej za pomocą słabej referencji `WeakReference`, a wywołanie kodu powinno odbywać się za pośrednictwem dynamicznego interfejsu lub metody refleksyjnej. Użycie bezpiecznych wskaźników i profilowanie pamięci za pomocą liczników `AppDomain.CurrentDomain` lub `GC.GetTotalAllocatedBytes` ułatwi weryfikację braku wycieków.
Wzorzec projektowy: *Flyweight*, *Collectible AssemblyLoadContext*, *Observer*.
