## 135. Koordynator Transakcji Rozproszonych Two-Phase Commit (2PC Coordinator)

**Szczegółowy opis i cele edukacyjne:**
W systemach rozproszonych (mikroserwisach) utrzymanie spójności danych między wieloma bazami danych w ramach jednej operacji (np. zakup towaru: mikroserwis zamówień zapisuje fakt, a mikroserwis płatności pobiera środki) to zaawansowany problem. Klasycznym algorytmem gwarantującym atomowość transakcji rozproszonej (zasada "wszystko albo nic") jest Protokół Zatwierdzania Dwufazowego (Two-Phase Commit - 2PC).
Projekt polega na stworzeniu asynchronicznego symulatora Koordynatora Transakcji Rozproszonych (Transaction Coordinator) komunikującego się z wieloma Uczestnikami (Participants / Resource Managers).
Cele edukacyjne to implementacja cyklu życia transakcji 2PC, obsługa fazy głosowania (Prepare Phase) oraz fazy zatwierdzania/wycofywania (Commit / Abort Phase), oraz zapewnienie odporności na awarie maszyn (Crash Recovery) za pomocą trwałego dziennika transakcji koordynatora (Write-Ahead Log - WAL).

**Wymagane funkcje:**
- **Silnik Koordynatora (2PC Coordinator):** Klasa koordynująca transakcję rozproszoną w dwóch fazach:
  - Faza 1 (Prepare): Wyślij zapytanie do wszystkich uczestników "Czy możecie zatwierdzić transakcję?". Zbierz głosy (VOTE_COMMIT / VOTE_ABORT).
  - Faza 2 (Commit/Rollback): Jeśli wszyscy zagłosowali na tak, wyślij komendę GLOBAL_COMMIT. Jeśli chociaż jeden zagłosował na nie (lub nie odpowiedział w zadanym czasie), wyślij GLOBAL_ABORT.
- **Odporność uczestników na awarie:** Uczestnicy implementują blokowanie zasobów w fazie Prepare (np. rezerwacja środków na koncie) i trwale zapisują swój głos. Po otrzymaniu GLOBAL_COMMIT dokonują fizycznego zapisu, po GLOBAL_ABORT zwalniają blokadę (Rollback).
- **Dziennik Koordynatora (Transaction Log):** Koordynator zapisuje każdy krok transakcji (np. START_2PC, PREPARED, COMMITTED) w pliku binarnym na dysku. Przy nagłym restarcie koordynatora (symulacja awarii), czyta on log i wznawia proces 2PC (odpytuje uczestników o ich statusy w celu zakończenia transakcji).
- **Zintegrowany CLI Simulator:** Konsolowy panel pozwalający na symulowanie awarii sieci (Packet Drop) lub nagłego wyłączenia serwera koordynatora / uczestników w różnych fazach protokołu, demonstrujący zachowanie spójności danych.

**Porady implementacyjne i dobre praktyki:**
Komunikację koordynatora z uczestnikami zrealizuj asynchronicznie przy użyciu klasy `Task.WhenAll`. Ustaw sztywny czas oczekiwania (Timeout) na głosy uczestników w fazie 1 – jeśli uczestnik nie odpowie w ciągu np. 5 sekund, koordynator musi założyć awarię i podjąć decyzję o wycofaniu całej transakcji (GLOBAL_ABORT). Zapis do pliku dziennika transakcji koordynatora musi być synchroniczny i zrzucany na dysk za pomocą metody `FileStream.Flush(true)` przed wysłaniem kolejnych wiadomości sieciowych, aby zagwarantować odporność na utratę zasilania.
Wzorzec projektowy: *Two-Phase Commit*, *State (Stan)*, *Write-Ahead Logging (WAL)*.
