## 134. Narzędzie CLI do Synchronizacji Baz w Czasie Rzeczywistym (Real-time SQL Sync)

**Szczegółowy opis i cele edukacyjne:**
Replikacja danych w bazach danych polega na ciągłym kopiowaniu zmian (operacje INSERT/UPDATE/DELETE) z bazy źródłowej (Master) do bazy docelowej (Replica) w celu zapewnienia wysokiej dostępności i rozłożenia ruchu odczytów. Ręczne napisanie wydajnego systemu synchronizacji to cenne wyzwanie inżynieryjne.
Projekt polega na stworzeniu narzędzia CLI, które monitoruje zmiany w bazie danych SQLite (lub SQL Server) w czasie rzeczywistym i natychmiast synchronizuje je z inną bazą danych.
Cele edukacyjne to praca z systemami śledzenia zmian (Change Data Capture - CDC), asynchroniczny odczyt tabel systemowych lub logów transakcyjnych bazy danych, dynamiczne generowanie poleceń SQL do replikacji (Dynamic SQL query generation), transakcyjna atomowość zapisu, oraz wykrywanie i automatyczne rozwiązywanie konfliktów spójności (Conflict Resolution).

**Wymagane funkcje:**
- **Mechanizm detekcji zmian (CDC Engine):** Skanowanie tabel w poszukiwaniu nowych modyfikacji (np. przy użyciu tabeli dziennika zmian `AuditLog` zasilanej przez triggery bazodanowe lub odpytywanie kolumn typu `RowVersion` / `Timestamp`).
- **Dynamiczny Generator Zapytań SQL:** Program generuje pasujące zapytania SQL dla bazy docelowej na podstawie wykrytej operacji (np. wykrycie zmiany wiersza w bazie źródłowej generuje odpowiednie zapytanie `UPDATE` ze wszystkimi wartościami kolumn).
- **Zapis transakcyjny (Batch Replication):** Zbieranie zmian w paczki (Batches) i wgrywanie ich do bazy docelowej wewnątrz jednej transakcji, co zapobiega rozjechaniu się stanów baz przy nagłym braku prądu czy sieci.
- **Strategie rozwiązywania konfliktów (Conflict Resolution):** Scenariusz, w którym ten sam rekord został zmodyfikowany w obu bazach. Program oferuje konfigurację strategii: *Source Wins* (nadpisanie bazą źródłową), *Target Wins* (zignorowanie zmiany) lub *Latest Wins* (porównanie daty modyfikacji).

**Porady implementacyjne i dobre praktyki:**
Aby śledzić zmiany w bazie SQLite bez obciążania aplikacji ciągłym odpytywaniem SELECT (Polling), możesz użyć specjalnych hooków w sterowniku .NET SQLite (`Microsoft.Data.Sqlite`), takich jak zdarzenia `Connection.Update` wywoływane przy każdej operacji w bazie na poziomie połączenia. Przy replikacji danych wyłącz klucze obce (Foreign Keys) na czas transakcji w bazie docelowej lub posortuj wiersze do wstawienia topologicznie (najpierw tabele nadrzędne, potem podrzędne), aby zapobiec błędom naruszenia integralności referencyjnej.
Wzorzec projektowy: *Unit of Work*, *Strategy (Strategia)*, *Change Data Capture*.
