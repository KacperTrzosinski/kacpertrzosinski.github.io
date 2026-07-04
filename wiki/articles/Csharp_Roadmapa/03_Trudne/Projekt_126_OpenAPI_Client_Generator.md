## 126. Generator Klientów API C# na Podstawie OpenAPI (OpenAPI Client Generator)

**Szczegółowy opis i cele edukacyjne:**
Podczas integracji między serwisami (lub frontendu z backendem) ręczne pisanie klas klientów HTTP (razem z modelami DTO i obsługą endpointów) jest żmudne i podatne na błędy. Standardem branżowym jest automatyczne generowanie kodu klienta na podstawie pliku specyfikacji OpenAPI/Swagger (JSON/YAML).
Projekt polega na napisaniu generatora kodu C#, który wczytuje plik specyfikacji `openapi.json`, parsuje ścieżki (paths) oraz schematy modeli (schemas), a następnie generuje w pełni asynchroniczną klasę klienta HTTP w C#.
Cele edukacyjne to zaawansowane parsowanie dokumentów JSON, dynamiczne mapowanie typów danych OpenAPI (np. `string` z formatem `date-time` staje się `DateTimeOffset` w C#), oraz automatyczne generowanie kodu źródłowego (Code Generation) z zachowaniem odpowiedniego formatowania i przestrzeni nazw.

**Wymagane funkcje:**
- **Parser specyfikacji OpenAPI JSON:** Wczytywanie i analiza struktury OpenAPI (wyodrębnienie listy adresów URL, metod HTTP `GET`/`POST`/etc, nagłówków oraz parametrów zapytań).
- **Generowanie modeli DTO (Schema to Class):** Dynamiczne generowanie klas C# reprezentujących schematy danych (żądania i odpowiedzi API) z zachowaniem odpowiednich typów danych platformy .NET.
- **Generowanie klasy klienckiej (HTTP Client):** Budowanie kodu klasy z metodami (np. `public async Task<UserDto> GetUserAsync(int id, CancellationToken cancellationToken = default)`), które pod spodem używają `HttpClient` i poprawnie serializują/deserializują dane.
- **Eksport do pliku .cs (CLI Generator):** Narzędzie wiersza poleceń generujące plik wyjściowy (np. `ApiClient.cs`), gotowy do bezpośredniego dołączenia do projektu C#.

**Porady implementacyjne i dobre praktyki:**
Zamiast gotowych generatorów (jak NSwag), napisz własny transpiler. Wczytaj specyfikację do obiektu `JsonDocument`. Ścieżki w OpenAPI mogą zawierać parametry (np. `/users/{id}`). Musisz napisać metodę, która zamienia je na interpolowane ciągi znaków w C# (np. `$"users/{id}"`). Przy generowaniu kodu dbaj o czystość formatowania – dodawaj odpowiednie wcięcia (indentation) wynoszące 4 spacje, grupuj klasy w odpowiednich przestrzeniach nazw (Namespaces) i dołączaj komentarze XML wyciągnięte z pól `description` w specyfikacji.
Wzorzec projektowy: *Code Generation*, *Interpreter*, *Builder*.
