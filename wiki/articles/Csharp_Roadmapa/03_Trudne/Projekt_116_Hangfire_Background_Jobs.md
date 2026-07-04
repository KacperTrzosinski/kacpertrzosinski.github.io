## 116. Rozproszone Harmonogramowanie Zadań z Hangfire (Hangfire Background Jobs)

**Szczegółowy opis i cele edukacyjne:**
W aplikacjach biznesowych wiele operacji (np. codzienne generowanie raportów o północy, czyszczenie nieaktywnych koszyków, wysyłka newsletterów) musi być wykonywanych asynchronicznie, w określonych odstępach czasu lub natychmiast, ale bez spowalniania wątków serwera HTTP. Standardem w .NET do zarządzania takimi zadaniami z gwarancją wykonania (durability) jest biblioteka `Hangfire`.
Projekt polega na zaimplementowaniu w systemie e-commerce platformy przetwarzania zadań Hangfire, zintegrowanej z bazą danych SQL Server lub SQLite jako magazynem stanów (Storage).
Cele edukacyjne to integracja z biblioteką Hangfire, konfiguracja różnych typów zadań (Fire-and-forget, Delayed, Recurring, Continuations), zabezpieczanie panelu administratora (Hangfire Dashboard) autoryzacją na bazie ról, oraz obsługa skalowania przetwarzania zadań za pomocą wielu serwerów roboczych (Hangfire Workers).

**Wymagane funkcje:**
- **Zadania natychmiastowe i opóźnione (Fire-and-Forget & Delayed):** Dodawanie zadań do natychmiastowego przetworzenia w tle (np. generowanie faktury) lub uruchamianych po zadanym opóźnieniu (np. wysłanie maila przypominającego o porzuconym koszyku po 2 godzinach).
- **Zadania cykliczne (Recurring Jobs):** Konfiguracja powtarzalnych zadań wyzwalanych wyrażeniem Cron (np. codzienna synchronizacja stanów magazynowych o godzinie 02:00).
- **Zabezpieczenie Dashboardu:** Wdrożenie filtra autoryzacyjnego (`IDashboardAuthorizationFilter`) dopuszczającego do panelu administratora Hangfire wyłącznie zalogowanych użytkowników z rolą `Admin` (weryfikacja ciasteczek sesji lub nagłówków JWT).
- **Obsługa zależności i awarii (Continuations & Retries):** Tworzenie łańcuchów zadań (np. zadanie B uruchamia się automatycznie po pomyślnym zakończeniu zadania A) wraz z konfiguracją automatycznego ponawiania przy błędach z zapisem historii w bazie.

**Porady implementacyjne i dobre praktyki:**
Zadania przekazywane do Hangfire powinny być definiowane za pomocą interfejsów i wyrażeń lambda (np. `BackgroundJob.Enqueue<IEmailService>(x => x.SendWelcomeEmail(userId));`). Nie przekazuj do zadań ciężkich obiektów biznesowych jako parametrów – Hangfire serializuje argumenty do formatu JSON i zapisuje w bazie. Przekazuj wyłącznie proste identyfikatory (np. `userId` typu `Guid` lub `int`), a sam worker w tle powinien pobrać świeże dane z bazy na początku wykonania zadania.
Wzorzec projektowy: *Scheduler*, *Job Queue*, *Worker*.
