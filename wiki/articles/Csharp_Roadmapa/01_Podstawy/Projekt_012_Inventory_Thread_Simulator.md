## 12. Symulator Transakcji Magazynowych (Inventory Thread Simulator)

**Szczegółowy opis i cele edukacyjne:**
Aplikacje biznesowe często działają w środowiskach wielowątkowych, gdzie wiele procesów jednocześnie próbuje modyfikować te same zasoby (np. stan magazynowy produktu). Bez odpowiedniej synchronizacji dochodzi do błędów typu "Race Condition", co może skutkować np. sprzedażą większej liczby przedmiotów, niż faktycznie znajduje się w magazynie.
Projekt polega na stworzeniu konsolowej symulacji magazynu, w którym wiele wątków (symulujących koszyki klientów oraz dostawców) jednocześnie próbuje rezerwować, kupować lub uzupełniać stany magazynowe produktów. Cel edukacyjny to zapoznanie się z podstawami współbieżności (Concurrency) w C# i .NET: instrukcją `lock`, bezpiecznymi wątkowo kolekcjami (`ConcurrentDictionary`) oraz radzeniem sobie z zakleszczeniami (deadlocks).

**Wymagane funkcje:**
- **Równoległa symulacja zakupów:** Uruchomienie wielu wątków tła (np. za pomocą `Task.Run` lub bezpośrednio `Thread`) symulujących klientów losowo kupujących wybrane produkty.
- **Bezpieczne transakcje na stanie magazynowym:** Zapewnienie, że stan magazynowy żadnego produktu nigdy nie spadnie poniżej zera, a operacje odejmowania i dodawania są atomowe.
- **Zintegrowany system rezerwacji:** Blokowanie danej liczby sztuk na określony czas (np. 5 sekund). Jeśli klient nie dokona zakupu, zarezerwowane sztuki automatycznie wracają do puli dostępnych zasobów.
- **Raport o wyścigach i niespójnościach:** Narzędzie audytowe, które na koniec symulacji sumuje wszystkie dostawy i zakupy, sprawdzając, czy końcowy stan magazynu zgadza się ze stanem początkowym co do joty (audyt poprawności).

**Porady implementacyjne i dobre praktyki:**
Unikaj stosowania blokady `lock` na obiektach publicznych lub na typach wartościowych (jak string). Zamiast tego zdefiniuj prywatny obiekt dedykowany do synchronizacji: `private readonly object _lock = new();`. Do sprawdzania i modyfikacji stanów magazynowych w strukturach słownikowych idealnie nadaje się `ConcurrentDictionary<TKey, TValue>`, jednak pamiętaj, że wywołania wielu metod na słowniku współbieżnym jedno po drugim NIE są automatycznie atomowe jako całość – w takich przypadkach konieczna jest dodatkowa synchronizacja. Do automatycznego zwalniania rezerwacji po czasie wykorzystaj lekki mechanizm `CancellationTokenSource` powiązany z opóźnieniem czasowym (`Task.Delay`).
Wzorzec projektowy: *Monitor (Synchronized Block)*, *Thread-Safe Wrapper*.
