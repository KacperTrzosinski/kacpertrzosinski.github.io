## 58. Demon Harmonogramowania Zadań typu Cron (Cron Scheduler Daemon)

**Szczegółowy opis i cele edukacyjne:**
Wiele systemów biznesowych wymaga wykonywania zadań w określonych odstępach czasu (np. wysyłanie raportów o 23:00, czyszczenie bazy danych co godzinę). Standardem uniksowym do definiowania takich harmonogramów są wyrażenia Cron.
Projekt polega na stworzeniu demona (aplikacji działającej w tle), który potrafi parsować wyrażenia Cron (np. `*/5 * * * *` oznacza: "co 5 minut") i zarządzać harmonogramem wykonywania zarejestrowanych delegatów (zadań) w C#.
Cele edukacyjne to parsowanie i interpretacja formatu Cron, praca z nowoczesnymi mechanizmami odliczania czasu w .NET (`PeriodicTimer` wprowadzony w .NET 6 lub klasyczne liczniki czasu `System.Threading.Timer`), asynchroniczne wywoływanie zadań oraz odporność na błędy (błąd w jednym zadaniu nie może zatrzymać wykonywania innych zadań ani wywalić demona).

**Wymagane funkcje:**
- **Parser wyrażeń Cron:** Własnoręcznie zaimplementowany parser analizujący 5 pól specyfikacji Cron (minuta, godzina, dzień miesiąca, miesiąc, dzień tygodnia) z obsługą znaków specjalnych: gwiazdki `*`, list rozdzielanych przecinkami `,` oraz kroków `/`.
- **Rejestracja zadań:** API umożliwiające rejestrację zadań w postaci delegatów asynchronicznych: `RegisterTask(string cronExpression, Func<Task> job)`.
- **Silnik czasu rzeczywistego (Execution Engine):** Wewnętrzny zegar sprawdzający co minutę (lub obliczający optymalny czas do następnego uruchomienia), które z zadań powinny zostać wywołane.
- **System raportowania i logowania:** Śledzenie historii uruchomień zadań (czas startu, czas trwania, status wykonania: Sukces/Błąd) i zapis statystyk.

**Porady implementacyjne i dobre praktyki:**
Do odliczania czasu w pętli asynchronicznej zamiast przestarzałego `Thread.Sleep` wykorzystaj klasę `PeriodicTimer`, która jest znacznie bardziej stabilna i nie alokuje pamięci przy każdym takcie zegara. Każde zadanie uruchamiaj w osobnym wątku/zadaniu przy użyciu `Task.Run` – dzięki temu zadania długo działające nie będą blokować głównego wątku demona ani opóźniać startu innych procesów. Całą pętlę wywoławczą opakuj w blok `try-catch`, aby zabezpieczyć demona przed awarią w przypadku nieobsłużonego wyjątku wewnątrz zarejestrowanego zadania użytkownika.
Wzorzec projektowy: *Scheduler*, *Observer*.
