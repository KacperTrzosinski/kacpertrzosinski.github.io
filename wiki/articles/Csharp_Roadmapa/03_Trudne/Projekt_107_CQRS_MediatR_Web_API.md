## 107. Usługa Web API z CQRS i Biblioteką MediatR (CQRS MediatR Web API)

**Szczegółowy opis i cele edukacyjne:**
W klasycznych systemach kontrolery API bezpośrednio wywołują serwisy biznesowe, co prowadzi do ciasnego powiązania (tight coupling) oraz rozrostu klas serwisowych (tzw. "Fat Services"). Standardem w nowoczesnym .NET jest stosowanie wzorca CQRS (Command Query Responsibility Segregation) wraz z biblioteką `MediatR` implementującą wzorzec mediatora w pamięci procesu.
Projekt polega na przepisaniu lub stworzeniu od zera logiki biznesowej Web API w oparciu o CQRS i MediatR.
Cele edukacyjne to całkowite odseparowanie logiki zapytań (Queries - odczyt) od logiki modyfikacji (Commands - zapis), wdrożenie luźnego powiązania za pomocą obiektów żądań (`IRequest<T>`) i ich obsługi (`IRequestHandler<TRequest, TResponse>`), oraz implementacja zachowań potoku MediatR (Pipeline Behaviors) do automatycznego logowania, walidacji oraz zarządzania transakcjami.

**Wymagane funkcje:**
- **Podział na Commands i Queries:** Implementacja operacji jako osobne klasy (np. `CreateProductCommand` zwracający ID oraz `GetProductByIdQuery` zwracający DTO), z których każda ma swój dedykowany Handler.
- **Konfiguracja MediatR w ASP.NET Core:** Rejestracja MediatR w kontenerze wtryskiwania zależności, redukująca rolę kontrolerów Web API wyłącznie do przekazywania żądań mediatorowi (np. `return Ok(await _mediator.Send(command));`).
- **MediatR Pipeline Behaviors (Cross-cutting Concerns):** Zaimplementowanie zachowań potoku:
  - `ValidationBehavior`: Automatyczna walidacja komend przy użyciu `FluentValidation` przed wykonaniem Handlera.
  - `LoggingBehavior`: Logowanie każdego żądania wejściowego i wyjściowego.
  - `TransactionBehavior`: Automatyczne otwieranie transakcji bazodanowej dla wszystkich Commands (zapisów) i zatwierdzanie jej tylko w przypadku sukcesu.
- **Wydajny model odczytu (Queries Fast Path):** Handler dla Queries (odczytów) może bezpośrednio wykorzystywać Dapper lub zoptymalizowany pod kątem braku śledzenia DbContext, co maksymalizuje prędkość odpowiedzi.

**Porady implementacyjne i dobre praktyki:**
Unikaj tworzenia jednego Handlera obsługującego wiele różnych komend. Zasada Single Responsibility Principle (SRP) w CQRS mówi, że każda komenda/zapytanie oraz ich handler powinny być zdefiniowane w jednym osobnym pliku (podejście Vertical Slice Architecture). Pipeline Behaviors implementują interfejs `IPipelineBehavior<TRequest, TResponse>`. Zapewnia to działanie podobne do ASP.NET Core Middleware, ale na poziomie mediatora wewnątrz logiki aplikacyjnej, co ułatwia testowanie jednostkowe (nie wymaga kontekstu HTTP).
Wzorzec projektowy: *Mediator*, *CQRS*, *Command*, *Decorator*.
