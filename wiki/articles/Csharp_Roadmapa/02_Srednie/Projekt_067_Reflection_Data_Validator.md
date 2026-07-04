## 67. Walidator Danych na drodze Refleksji i Atrybutów (Reflection Data Validator)

**Szczegółowy opis i cele edukacyjne:**
W aplikacjach biznesowych walidacja obiektów wejściowych (np. danych z formularzy lub żądań HTTP API) jest kluczowa dla zachowania spójności. Zamiast pisać powtarzalne, twardo kodowane instrukcje `if` dla każdej klasy, w ekosystemie .NET powszechnie stosuje się atrybuty deklaratywne (Metadata Data Annotations).
Projekt polega na stworzeniu własnego silnika walidacji, który analizuje obiekty w czasie wykonywania programu (Runtime) przy użyciu mechanizmu refleksji i sprawdza ich zgodność z nałożonymi atrybutami.
Cele edukacyjne to projektowanie i definiowanie własnych atrybutów (`Custom Attributes`), pobieranie metadanych typów i pól za pomocą refleksji, dynamiczne wywoływanie walidatorów oraz agregacja błędów walidacji w spójną strukturę.

**Wymagane funkcje:**
- **Własne atrybuty walidacji:** Definicje klas atrybutów, takich as: `[Required]` (pole nie może być puste), `[Range(min, max)]` (weryfikacja granic liczbowych), `[EmailAddress]` (poprawność e-maila) oraz `[StringLength(max)]`.
- **Serwis walidacyjny (Object Validator):** Klasa `ValidatorEngine` z metodą `ValidationResult Validate(object obj)` badająca typ obiektu, jego pola oraz właściwości i uruchamiająca powiązane walidatory.
- **Obsługa zagnieżdżonych obiektów:** Możliwość rekurencyjnej walidacji obiektów powiązanych (np. obiekt `Order` zawiera obiekt `Customer`, który również powinien zostać sprawdzony, jeśli oznaczono go atrybutem `[ValidateNested]`).
- **Agregacja błędów:** Wynik walidacji musi zawierać słownik `Dictionary<string, List<string>>` mapujący nazwy niepoprawnych pól na listy komunikatów o błędach.

**Porady implementacyjne i dobre praktyki:**
Zdefiniuj klasę bazową dla swoich atrybutów walidacyjnych, np. `ValidationAttribute` z metodą abstrakcyjną `bool IsValid(object? value)`. Każdy własny atrybut powinien dziedziczyć po tej klasie bazowej. W silniku walidacji użyj metody `Type.GetProperties()` do odczytania właściwości obiektu, a następnie `PropertyInfo.GetCustomAttributes()` do pobrania atrybutów walidacyjnych nałożonych na to pole. Keszuj definicje reguł walidacyjnych dla typów obiektów (Type Caching) – jednorazowe zbadanie refleksją struktury klasy i zapisanie reguł w słowniku `ConcurrentDictionary<Type, List<PropertyValidationRule>>` drastycznie przyspieszy kolejne wywołania walidacji tych samych typów obiektów.
Wzorzec projektowy: *Strategy (Strategia)* (każdy atrybut reprezentuje inną strategię walidacji), *Composite* (agregacja błędów).
