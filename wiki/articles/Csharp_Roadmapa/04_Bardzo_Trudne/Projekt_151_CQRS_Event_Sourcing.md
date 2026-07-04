## 151. Serwis w Architekturze CQRS i Event Sourcing (CQRS Event Sourcing)

**Szczegółowy opis i cele edukacyjne:**
Tradycyjne bazy danych przechowują wyłącznie aktualny stan obiektów (np. status zamówienia to "Wysłane"). Tracimy w ten sposób całą historię zmian – nie wiemy, kiedy status się zmienił, kto go zmienił, ani jaki był stan poprzedni (chyba że implementujemy skomplikowane tabele logów). Alternatywą jest Event Sourcing – wzorzec, w którym jedynym źródłem prawdy (Source of Truth) jest sekwencyjna, niezmienny rejestr zdarzeń (Event Store). Aktualny stan obiektu (Aggregate) jest odtwarzany (rehydrated) poprzez wczytanie i sekwencyjne zaaplikowanie wszystkich zdarzeń z przeszłości.
Projekt polega na stworzeniu mikroserwisu obsługi kont bankowych w pamięci, opartego o wzorzec CQRS (Command Query Responsibility Segregation) oraz Event Sourcing.
Cele edukacyjne to zrozumienie pojęć Domain-Driven Design (DDD): Aggregate Root, Domain Event, implementacja własnego mechanizmu Event Store z obsługą optymistycznej kontroli współbieżności (Optimistic Concurrency Control / Event Versioning), oraz budowa niezależnych modeli odczytu (Read Models / Projections).

**Wymagane funkcje:**
- **Rejestr Zdarzeń (Event Store):** Interfejs zapisu i odczytu zdarzeń powiązanych z danym agregatem (np. `AccountId`). Każde zdarzenie posiada nazwę, unikalne ID, znacznik czasu, numer wersji (sekwencyjny) oraz ładunek danych (Payload).
- **Optymistyczna współbieżność (Optimistic Concurrency):** Przy zapisie nowych zdarzeń Event Store weryfikuje wersję agregatu – jeśli wersja w bazie różni się od wersji, na której klient dokonał operacji, rzucany jest wyjątek `ConcurrencyException` (ochrona przed wyścigami zapisu).
- **Rekonstrukcja stanu (Aggregate Rehydration):** Metoda wczytująca listę zdarzeń dla danego ID i wywołująca dla każdego z nich odpowiednie metody wewnętrzne agregatu (np. `OnAccountCreated`, `OnMoneyDeposited`) w celu odbudowania najnowszego stanu obiektu w pamięci.
- **Projektory modeli odczytu (Projections / Read Models):** Mechanizm asynchronicznie nasłuchujący na nowe zdarzenia i aktualizujący zoptymalizowaną pod kątem szybkich odczytów (np. wyszukiwanie) tabelę w bazie danych (np. saldo konta w SQLite / Redis).

**Porady implementacyjne i dobre praktyki:**
Unikaj modyfikowania stanu agregatu bezpośrednio w metodzie obsługującej komendę (np. `DepositMoney`). Metoda ta powinna wyłącznie walidować reguły biznesowe (np. czy kwota jest dodatnia) i – jeśli wszystko jest w porządku – emitować nowe zdarzenie `MoneyDepositedEvent`. Dopiero w metodzie `Apply(MoneyDepositedEvent)` następuje fizyczna zmiana salda w agregacie. Pozwoli to na identyczne zachowanie obiektu zarówno podczas wykonywania nowej transakcji, jak i podczas odtwarzania historii z bazy.
Wzorzec projektowy: *Event Sourcing*, *CQRS*, *State (Stan)*, *Snapshot Pattern* (do optymalizacji odtwarzania długich historii zdarzeń).
