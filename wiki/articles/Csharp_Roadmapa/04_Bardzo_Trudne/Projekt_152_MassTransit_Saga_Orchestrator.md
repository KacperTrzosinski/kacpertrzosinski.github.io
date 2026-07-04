## 152. Orkiestrator Transakcji SAGA z MassTransit (MassTransit Saga Orchestrator)

**Szczegółowy opis i cele edukacyjne:**
W architekturze rozproszonej mikroserwisów transakcje klasyczne (ACID) realizowane przez dwufazowe zatwierdzanie (2PC) są wolne i blokują zasoby sieciowe. Nowoczesnym i skalowalnym standardem zarządzania transakcjami biznesowymi przechodzącymi przez wiele mikroserwisów jest wzorzec SAGA. SAGA dzieli transakcję rozproszoną na serię lokalnych transakcji w poszczególnych serwisach. Jeśli któraś z lokalnych transakcji się nie powiedzie, SAGA uruchamia transakcje kompensujące (Compensating Transactions) w celu wycofania zmian i przywrócenia spójności systemu.
Projekt polega na zaimplementowaniu orkiestratora transakcji SAGA dla procesu rezerwacji wycieczek (Order, Payment, Hotel Booking, Flight Booking) przy użyciu maszyny stanów biblioteki `MassTransit` (`MassTransit State Machine / Automat`).
Cele edukacyjne to wdrożenie wzorca Saga Orchestrator, definiowanie stanów, zdarzeń i przejść w maszynie stanów MassTransit, zarządzanie trwałym stanem instancji sagi (Saga Repository) oraz implementacja transakcji kompensujących.

**Wymagane funkcje:**
- **Maszyna Stanów Sagi (Saga State Machine):** Klasa dziedzicząca po `MassTransitStateMachine<TripReservationState>`, definiująca kompletny przepływ procesu (np. `During(Submitting, When(PaymentApproved)...)`).
- **Zarządzanie stanem (Saga State):** Definicja klasy stanu instancji sagi (State Instance) przechowującej m.in. `CorrelationId` (unikalny identyfikator łączący wszystkie zdarzenia), aktualny stan (np. `PaymentPending`, `Completed`) oraz dane pośrednie.
- **Odporność na błędy (Compensating Actions):** Jeśli krok rezerwacji hotelu zwróci błąd (zdarzenie `HotelBookingFailed`), orkiestrator automatycznie wysyła zdarzenie `RefundPayment` i `CancelFlight` w celu wycofania wykonanych wcześniej operacji w innych serwisach.
- **Trwałość Sagi (Persistence):** Integracja z bazą danych (np. Entity Framework Core z SQLite) do automatycznego odczytu i zapisu stanu sagi między asynchronicznymi zdarzeniami płynącymi z brokera wiadomości.

**Porady implementacyjne i dobre praktyki:**
Unikaj wzorca Saga Chorography (gdzie mikroserwisy same decydują o kolejnych krokach na podstawie odbieranych zdarzeń) w złożonych procesach biznesowych, ponieważ prowadzi to do chaosu i trudnego w debugowaniu kodu. Wybierz podejście Saga Orchestration z centralnym orkiestratorem (napisanym w MassTransit). Komunikaty przesyłaj asynchronicznie za pomocą RabbitMQ. Pamiętaj o obsłudze idempotentności – jeśli to samo zdarzenie (np. `PaymentApproved`) dotrze do sagi dwukrotnie, orkiestrator musi je zignorować, nie wywołując kolejnego kroku rezerwacji po raz drugi.
Wzorzec projektowy: *Saga Orchestrator*, *State Machine*, *Command/Query*.
