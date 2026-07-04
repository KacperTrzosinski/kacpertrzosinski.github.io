## 53. Lokalny Menedżer Bazy SQLite i Dapper (SQLite Dapper Repository)

**Szczegółowy opis i cele edukacyjne:**
Dla lokalnych aplikacji desktopowych lub prostych systemów narzędziowych, pełnowymiarowy serwer bazy danych (np. SQL Server, PostgreSQL) to zbyt duże obciążenie. Standardem branżowym w takich przypadkach jest plikowa baza SQLite połączona z lekkim mapowaniem obiektowo-relacyjnym (Micro-ORM) za pomocą biblioteki Dapper.
Projekt polega na stworzeniu warstwy dostępu do danych (Data Access Layer - DAL) dla prostego systemu magazynowego.
Cele edukacyjne to wdrożenie wzorca projektowego *Repository* oraz *Unit of Work*, instalacja i konfiguracja zewnętrznych paczek NuGet (`Microsoft.Data.Sqlite`, `Dapper`), pisanie sparametryzowanych zapytań SQL chroniących przed atakami typu SQL Injection, oraz zarządzanie połączeniami do bazy danych i transakcjami.

**Wymagane funkcje:**
- **Inicjalizacja i migracje bazy:** Automatyczne tworzenie pliku bazy danych SQLite przy starcie oraz uruchamianie skryptów SQL tworzących tabele i indeksy (mechanizm prostych migracji).
- **Asynchroniczny CRUD (Dapper):** Implementacja operacji dodawania, odczytu, modyfikacji i usuwania produktów oraz kategorii przy użyciu metod rozszerzających Dappera (np. `QueryAsync`, `ExecuteAsync`).
- **Wyszukiwanie z parametrami:** Bezpieczne wyszukiwanie produktów po nazwie i cenie przy użyciu parametrów zapytania (np. `new { Name = "%" + search + "%" }`).
- **Zarządzanie transakcjami (Unit of Work):** Zapewnienie spójności przy wielotabelowych operacjach (np. złożenie zamówienia odejmuje stan magazynowy i tworzy rekord zamówienia w jednej transakcji SQL).

**Porady implementacyjne i dobre praktyki:**
Zdefiniuj interfejsy `IProductRepository` oraz `IUnitOfWork`. Zapewni to pełną niezależność logiki biznesowej od konkretnego silnika bazy danych (co ułatwi testowanie). Połączenie do bazy danych `SqliteConnection` powinno być otwierane bezpośrednio przed wykonaniem zapytania i zamykane zaraz po jego zakończeniu (użycie bloku `using`). Dapper automatycznie mapuje nazwy kolumn tabeli na właściwości klas w C# (np. kolumna `created_at` na właściwość `CreatedAt`), pod warunkiem poprawnej konfiguracji lub aliasów w zapytaniach SQL.
Wzorzec projektowy: *Repository (Repozytorium)*, *Unit of Work (Jednostka pracy)*.
