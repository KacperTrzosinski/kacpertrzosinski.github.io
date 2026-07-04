## 108. Zaawansowana Walidacja Potoków z FluentValidation (FluentValidation API)

**Szczegółowy opis i cele edukacyjne:**
Używanie atrybutów walidacyjnych w modelach (np. `[Required]`, `[StringLength]`) miesza reguły biznesowe z definicją danych i utrudnia dynamiczną walidację zależną od stanu bazy danych czy innych właściwości obiektu. Wzorcem projektowym dla czystego kodu jest rozdzielenie walidacji do osobnych klas za pomocą biblioteki `FluentValidation`.
Projekt polega na zaimplementowaniu w API zaawansowanego systemu walidacji danych wejściowych z dynamicznymi regułami, asynchronicznym sprawdzaniem unikalności danych w bazie oraz pełną integracją z potokiem ASP.NET Core.
Cele edukacyjne to konfiguracja FluentValidation, pisanie złożonych reguł warunkowych, wstrzykiwanie zależności (np. DbContext) do walidatorów w celu asynchronicznej walidacji (np. czy dany e-mail już istnieje w bazie danych), oraz spójna obsługa błędów walidacji w potoku HTTP.

**Wymagane funkcje:**
- **Klasy walidatorów (AbstractValidator):** Tworzenie dedykowanych klas walidujących dla modeli żądań (np. `RegisterUserRequestValidator` dziedziczący po `AbstractValidator<RegisterUserRequest>`).
- **Asynchroniczne walidacje bazodanowe:** Użycie reguły `.MustAsync()` do odpytywania bazy danych (np. sprawdzenie, czy wybrany ID kategorii istnieje w bazie przed dodaniem produktu).
- **Złożone reguły warunkowe:** Walidacja pól zależna od wartości innych pól, np. "Pole `CreditCardNumber` jest wymagane tylko wtedy, gdy `PaymentMethod` jest ustawiona na `CreditCard`".
- **Lokalizacja i customizacja komunikatów:** Zwracanie spersonalizowanych kodów błędów (ErrorCode) i sformatowanych komunikatów o błędach wraz z dynamicznym wstawianiem nazw właściwości i ich niepoprawnych wartości.

**Porady implementacyjne i dobre praktyki:**
Nigdy nie blokuj wątków wykonując zapytania bazodanowe synchronicznie wewnątrz metod walidacji – zawsze korzystaj z asynchroniczności (`MustAsync`). Zintegruj FluentValidation z kontrolerami ASP.NET Core za pomocą biblioteki `FluentValidation.DependencyInjectionExtensions`, co pozwoli na automatyczne rejestrowanie wszystkich walidatorów w kontenerze DI za pomocą jednej linijki: `builder.Services.AddValidatorsFromAssemblyContaining<IApplicationMarker>();`. Do przechwytywania błędów walidacji i zamiany ich na czytelny JSON o kodzie 400 Bad Request wykorzystaj globalny filtr wyjątków lub dedykowane zachowanie potoku MediatR.
Wzorzec projektowy: *Validation Pipeline*, *Chain of Responsibility*.
