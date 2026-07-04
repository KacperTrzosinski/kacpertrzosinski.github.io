## 103. Testy Jednostkowe i Integracyjne xUnit z Mockowaniem (xUnit Testing Suite)

**Szczegółowy opis i cele edukacyjne:**
Jakość kodu w systemach inżynierskich jest bezpośrednio związana z pokryciem testami automatycznymi. Testy dają pewność, że refaktoryzacja kodu lub dodanie nowej funkcji nie zepsuły istniejących mechanizmów.
Projekt polega na stworzeniu kompletnego środowiska testowego dla aplikacji Web API (np. systemu bankowego).
Głównym celem edukacyjnym jest opanowanie technik testowania w C#. Student uczy się pisać testy jednostkowe (Unit Tests) z użyciem frameworka `xUnit`, mockować zależności za pomocą biblioteki `Moq` (lub `NSubstitute`), pisać czytelne asercje przy użyciu `FluentAssertions`, oraz tworzyć pełne testy integracyjne (Integration Tests) z wykorzystaniem `Microsoft.AspNetCore.Mvc.Testing` i klasy `WebApplicationFactory`, które testują punkty końcowe (endpoints) API wykonując rzeczywiste zapytania w pamięci wraz z testową bazą danych.

**Wymagane funkcje:**
- **Testy jednostkowe logiki biznesowej:** Testowanie czystych algorytmów i serwisów z izolacją od baz danych przy użyciu mocków (np. mockowanie repozytoriów zwracających testowe zestawy danych).
- **Testowanie wyjątków i parametrów:** Wykorzystanie mechanizmów parametryzacji testów w xUnit: atrybuty `[Theory]`, `[InlineData]`, `[MemberData]` oraz `[ClassData]` do uruchamiania jednego testu z różnymi zestawami danych wejściowych.
- **Mockowanie HttpClient (Integracje zewnętrzne):** Zaimplementowanie testów dla usług integrujących się z zewnętrznymi API (np. bramka płatnicza) poprzez mockowanie klasy `HttpMessageHandler` w `HttpClient`.
- **Testy integracyjne API (In-Memory Host):** Uruchomienie aplikacji w pamięci przy użyciu `WebApplicationFactory<Program>`, z podmienionym kontekstem bazy danych na SQLite w pamięci (`DataSource=:memory:`) lub bazę EF Core In-Memory w celu przetestowania pełnej ścieżki HTTP (Controller -> Service -> DB).

**Porady implementacyjne i dobre praktyki:**
Pisz testy zgodnie ze strukturą AAA (Arrange - przygotowanie danych, Act - wykonanie operacji, Assert - weryfikacja wyników). Nazwy metod testowych powinny jasno określać co jest testowane i jakiego zachowania się spodziewamy (np. `Withdraw_ShouldThrowException_WhenAmountIsNegative`). Unikaj testowania wewnętrznych detali implementacji – testuj zachowanie publiczne (kontrakt). Używając bazy SQLite w pamięci do testów integracyjnych, pamiętaj, że połączenie `SqliteConnection` musi być otwarte przez cały czas trwania testu, inaczej baza zostanie automatycznie usunięta z pamięci RAM.
Wzorzec projektowy: *Mocking*, *Test Data Builder*.
