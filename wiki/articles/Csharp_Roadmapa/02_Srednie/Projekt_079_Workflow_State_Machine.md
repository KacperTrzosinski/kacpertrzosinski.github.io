## 79. Silnik Maszyny Stanów Workflow z Zapisem Historii (Workflow State Machine)

**Szczegółowy opis i cele edukacyjne:**
Wiele procesów biznesowych (np. akceptacja faktury, proces rekrutacyjny, obsługa zamówień w sklepie) przechodzi przez określone stany według sztywnych reguł. Taki przepływ (Workflow) najlepiej zamodelować za pomocą maszyny stanów (State Machine), co eliminuje skomplikowaną logikę warunkową rozproszoną po całym kodzie.
Projekt polega na stworzeniu silnika maszyny stanów z trwałym zapisem stanu i historii przejść (Audit Trail) w bazie danych SQLite przy użyciu Dapper.
Cele edukacyjne to implementacja wzorca projektowego *State* oraz konfiguracja przejść (Transitions) za pomocą płynnego interfejsu (Fluent API), dynamiczne sprawdzanie uprawnień do zmiany stanu, oraz automatyczne wywoływanie akcji przed i po przejściu (Hooks / Triggers).

**Wymagane funkcje:**
- **Fluent State Configurator:** API pozwalające na definicję maszyny stanów w czytelny sposób, np.:
  `Configure(State.Draft).Permit(Trigger.Submit, State.UnderReview)`
  `Configure(State.UnderReview).OnEntry(SendEmailNotification)`.
- **Trwałość stanu (State Persistence):** Zapisywanie aktualnego stanu obiektu biznesowego (np. zamówienia o ID 123) w bazie SQLite i wczytywanie go przed aplikacją wyzwalacza (Triggera).
- **Zapis historii (Audit Trail):** Automatyczne tworzenie logów w tabeli `WorkflowHistory` przy każdym przejściu (kto zmienił stan, kiedy, z jakiego na jaki, jaki trigger wywołał zmianę).
- **Obsługa warunków przejść (Guards):** Funkcje warunkowe (`Func<bool>`), które mogą zablokować przejście do innego stanu, jeśli dane kryteria nie są spełnione (np. dokument nie może zostać wysłany, jeśli nie ma załącznika).

**Porady implementacyjne & dobre praktyki:**
Zaimplementuj stany i wyzwalacze jako typy generyczne `TState` oraz `TTrigger`, co pozwoli na używanie dowolnych typów (np. enumów lub stringów). Wewnętrznie przechowuj konfigurację w strukturze `Dictionary<TState, StateRepresentation>`, która dla każdego stanu przechowuje listę dozwolonych przejść i powiązane z nimi akcje. Zmiany stanu powinny być wykonywane wewnątrz transakcji SQL, aby zapewnić, że aktualizacja stanu obiektu oraz zapis w historii (Audit Trail) nastąpią atomowo (zasada ACID).
Wzorzec projektowy: *State (Stan)*, *Fluent Builder*, *Command*.
