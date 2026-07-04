## 18. System Oceny Kandydatów do Pracy na Delegatach (Candidate Evaluator)

**Szczegółowy opis i cele edukacyjne:**
Działy HR w dużych korporacjach technologicznych filtrują setki CV dziennie. Projekt polega na stworzeniu systemu, który automatycznie ocenia i punktuje profile kandydatów (lata doświadczenia, znajomość technologii, oczekiwania finansowe, wykształcenie) na podstawie dynamicznie definiowanych reguł kwalifikacyjnych.
Głównym celem edukacyjnym jest nauka pracy z wbudowanymi typami delegatów w platformie .NET: `Predicate<T>` (do testowania warunków logicznych), `Func<T, TResult>` (do obliczania wag i punktów) oraz `Action<T>` (do logowania i raportowania). Uczestnik uczy się, jak dynamicznie łączyć reguły za pomocą operacji logicznych (np. łączenie predykatów metodami `And()` i `Or()`) oraz jak pisać kod wysoce reużywalny.

**Wymagane funkcje:**
- **Silnik reguł filtrujących:** Możliwość definiowania kryteriów jako predykatów, np. `Predicate<Candidate> isSenior = c => c.ExperienceYears >= 5`.
- **System punktacji:** Przypisywanie wag i wyliczanie wyniku punktowego za pomocą delegatów `Func<Candidate, int>`, które analizują profil kandydata.
- **Dynamiczne łańcuchy reguł (Rule Chaining):** Klasa `RuleEngine` umożliwiająca dynamiczne rejestrowanie zestawów reguł przy starcie aplikacji i uruchamianie ich w określonej sekwencji.
- **Raport kwalifikacyjny:** Wypluwanie listy zakwalifikowanych kandydatów wraz z informacją o regułach, które zostały spełnione (wzorzec pipeline).

**Porady implementacyjne i dobre praktyki:**
Zaimplementuj metody rozszerzające (Extension Methods) dla `Predicate<T>`, które pozwolają na łączenie reguł bez modyfikacji obiektów bazowych, np.:
```csharp
public static Predicate<T> And<T>(this Predicate<T> left, Predicate<T> right) =>
    val => left(val) && right(val);
```
Używaj delegata `Action<Candidate>` do wywoływania efektów ubocznych (np. wysyłania powiadomienia konsolowego o pomyślnym przejściu etapu pierwszego). Rekomendowane jest unikanie pisania własnych, niestandardowych typów delegatów, jeśli w przestrzeni nazw `System` istnieją pasujące typy `Func`, `Action` lub `Predicate` – ułatwia to integrację z ekosystemem .NET i LINQ.
Wzorzec projektowy: *Specification (Specyfikacja)*, *Chain of Responsibility (Łańcuch odpowiedzialności)* realizowany dynamicznie poprzez delegaty.
