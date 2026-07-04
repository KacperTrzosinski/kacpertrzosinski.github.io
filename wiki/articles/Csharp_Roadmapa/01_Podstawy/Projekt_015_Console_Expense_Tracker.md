## 15. System Budżetu Domowego z Porównywaniem Okresów (Console Expense Tracker)

**Szczegółowy opis i cele edukacyjne:**
Śledzenie finansów osobistych wymaga zbierania transakcji przychodów i rozchodów, kategoryzowania ich oraz generowania raportów. Projekt polega na stworzeniu zaawansowanej aplikacji konsolowej do zarządzania budżetem domowym.
Głównym celem edukacyjnym jest nauka zaawansowanych technik dopasowywania wzorców (Pattern Matching w C# 9.0+), agregacji danych finansowych oraz pracy z różnymi strukturami danych i typami. Student dowie się, jak pisać wysoce ekspresywny kod bez zagnieżdżonych struktur `if-else` dzięki zastosowaniu instrukcji switch expression, relacyjnych wzorców (relational patterns) i wzorców logicznych (logical patterns).

**Wymagane funkcje:**
- **Rejestracja transakcji z kategoriami:** Dodawanie wydatków i przychodów z przypisaniem do kategorii (np. Jedzenie, Rozrywka, Rachunki, Wynagrodzenie).
- **Zasady inteligentnego kategoryzowania (Auto-categorization rules):** Automatyczna zmiana kategorii lub nakładanie ostrzeżeń o budżecie na podstawie reguł Pattern Matching analizujących kwotę oraz tytuł transakcji.
- **Porównywanie budżetów miesiąc-do-miesiąca:** Agregacja wydatków i porównywanie bieżącego miesiąca z poprzednim, wraz z procentowym wyliczeniem wzrostu/spadku wydatków w poszczególnych kategoriach.
- **Zarządzanie celami oszczędnościowymi:** Moduł pozwalający definiować cele (np. "Na wakacje - 5000 zł") i śledzący postęp odkładania środków na podstawie nadwyżek budżetowych.

**Porady implementacyjne i dobre praktyki:**
Do walidacji limitów budżetowych i kategoryzacji wykorzystaj konstrukcję switch expression z dopasowywaniem wzorców, na przykład:
```csharp
string status = transaction switch {
    { Amount: > 1000, Category: "Entertainment" } => "Warning: High entertainment cost!",
    { Amount: <= 0 } => "Error: Amount must be positive",
    _ => "Normal"
};
```
Zapobiega to rozrastaniu się kodu i ułatwia jego modyfikację. Do reprezentacji kategorii użyj typu `enum` lub stwórz hierarchię klas/rekordów. Dane przechowuj w pamięci w uporządkowany sposób, a do wyliczeń okresowych (np. grupowania po miesiącu i roku) wykorzystaj metody LINQ `GroupBy`. Do obsługi walut pamiętaj o zachowaniu formatowania regionalnego przy użyciu odpowiednich specyfikatorów formatu (np. `ToString("C")`), co automatycznie dostosuje symbol waluty do ustawień systemu.
