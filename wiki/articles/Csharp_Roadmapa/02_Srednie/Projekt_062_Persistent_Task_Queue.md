## 62. Trwała Kolejka Zadań z Zapisem w SQLite (Persistent Task Queue)

**Szczegółowy opis i cele edukacyjne:**
Kolejki zadań w pamięci (np. `Channel<T>`) tracą wszystkie dane w przypadku awarii zasilania lub restartu aplikacji. W systemach produkcyjnych (np. wysyłanie e-maili aktywacyjnych, przetwarzanie płatności) zadania muszą być trwałe (persistent), co oznacza konieczność ich zapisu w bazie danych.
Projekt polega na stworzeniu asynchronicznej kolejki zadań z trwałym zapisem w bazie danych SQLite przy użyciu biblioteki Dapper. Zadania są dodawane przez procesy klienckie, zapisywane w tabeli bazy danych ze statusem "Pending", a dedykowane procesy robocze (Workers) w tle bezpiecznie pobierają zadania, blokują je przed pobraniem przez inne wątki (status "Processing"), wykonują je i oznaczają jako "Completed" lub "Failed".
Cele edukacyjne to synchronizacja rozproszona na poziomie bazy danych, obsługa współbieżnego pobierania zadań bez ich duplikowania (Avoid double-processing), oraz implementacja mechanizmów wznawiania przerwanych zadań po restarcie aplikacji.

**Wymagane funkcje:**
- **Trwałe dodawanie zadań (Enqueue):** Zapisanie typu zadania oraz ładunku danych (payload w formacie JSON) do tabeli `QueueTasks` w bazie SQLite.
- **Bezpieczne pobieranie (Locking & Dequeue):** Wątek roboczy pobiera najstarsze oczekujące zadanie i atomowo zmienia jego status na "Processing", zapisując unikalny identyfikator workera, aby żaden inny wątek nie pobrał tego samego zadania w tym samym czasie.
- **Obsługa błędów i ponowienia (Retry Policy):** W przypadku awarii wykonania zadania system zwiększa licznik prób i odkłada zadanie do ponownego wykonania po czasie (Exponential Backoff).
- **Wznawianie po awarii (Crash Recovery):** Przy starcie aplikacji system wyszukuje zadania o statusie "Processing" (które zostały przerwane z powodu restartu) i zmienia ich status z powrotem na "Pending" lub przenosi do kolejki błędów (Dead Letter Queue).

**Porady implementacyjne i dobre praktyki:**
Aby zapobiec wyścigom w momencie pobierania zadań przez wiele wątków jednocześnie, w bazie SQLite zastosuj transakcję z odpowiednim poziomem izolacji lub wykonaj operację pobrania i blokady w jednym, atomowym zapytaniu SQL, na przykład:
```sql
UPDATE QueueTasks 
SET Status = 'Processing', WorkerId = @WorkerId, LockedAt = @Now
WHERE Id = (
    SELECT Id FROM QueueTasks 
    WHERE Status = 'Pending' 
    ORDER BY CreatedAt LIMIT 1
);
```
Jeśli zapytanie zmodyfikowało rekord, pobierz go za pomocą `WorkerId`. Zaimplementuj klasę `QueueWorker` jako usługę tła opartą na klasie `BackgroundService` w .NET.
Wzorzec projektowy: *Producer-Consumer*, *Outbox Pattern*.
