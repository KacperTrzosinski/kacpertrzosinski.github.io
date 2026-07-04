## 101. Usługa REST API w Architekturze Clean Architecture (Clean Web API)

**Szczegółowy opis i cele edukacyjne:**
Budowanie aplikacji klasy Enterprise wymaga modularnej architektury gwarantującej testowalność i uniezależnienie logiki biznesowej od technologii zewnętrznych (baz danych, interfejsu sieciowego). Standardem branżowym w .NET jest Czysta Architektura (Clean Architecture / Onion Architecture).
Projekt polega na stworzeniu serwisu REST API w technologii ASP.NET Core obsługującego np. system zarządzania projektami (Project Management System).
Głównym celem edukacyjnym jest zrozumienie i wdrożenie podziału na warstwy: Domain (reguły biznesowe, encje, wartości logiczne), Application (przypadki użycia, interfejsy repozytoriów, DTO), Infrastructure (implementacja baz danych, integracja z zewnętrznymi API) oraz Web/API (kontrolery, middleware, konfiguracja DI). Student opanuje konfigurację kontenera wstrzykiwania zależności (Dependency Injection) z uwzględnieniem cykli życia obiektów (`Transient`, `Scoped`, `Singleton`).

**Wymagane funkcje:**
- **Struktura Clean Architecture:** Podział rozwiązania (Solution) na cztery osobne projekty (Class Libraries + Web API) z poprawnie skonfigurowanymi referencjami (żaden projekt wewnętrzny nie zależy od zewnętrznego).
- **Obsługa przypadków użycia (Services):** Zaimplementowanie logiki biznesowej w warstwie Application przy użyciu wzorca CQRS (Command Query Responsibility Segregation) lub klasycznych serwisów aplikacyjnych.
- **Automatyczne mapowanie i walidacja:** Konfiguracja biblioteki `AutoMapper` lub `Mapster` do przepisywania encji na DTO oraz wstrzykiwanie walidatorów żądań wejściowych przy użyciu biblioteki `FluentValidation`.
- **Globalna obsługa wyjątków (Exception Middleware):** Custom middleware przechwytujący wszystkie nieobsługiwane błędy i zwracający spójną strukturę JSON o statusie zgodnym ze standardem RFC 7807 (Problem Details).

**Porady implementacyjne i dobre praktyki:**
Zadbaj o to, aby warstwa Domain nie zawierała żadnych zależności do bibliotek zewnętrznych (w tym do Entity Framework Core). Encje powinny być czystymi klasami C#. Wstrzykiwanie zależności konfiguruj w warstwie API, ale logiczne rejestracje (metody rozszerzające typu `AddApplicationServices()`, `AddInfrastructureServices()`) zaimplementuj w odpowiednich projektach w celu zachowania modularności kodu. Zrozumienie cyklu życia ma kluczowe znaczenie: repozytoria i DbContext powinny być rejestrowane jako `Scoped` (jeden obiekt na żądanie HTTP), serwisy bezstanowe jako `Transient`, a współdzielone mechanizmy (jak cache czy kolejka w pamięci) jako `Singleton`.
Wzorzec projektowy: *Clean Architecture*, *Repository*, *Dependency Injection*.
