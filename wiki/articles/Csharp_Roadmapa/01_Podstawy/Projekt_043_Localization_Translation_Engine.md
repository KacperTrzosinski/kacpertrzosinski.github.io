## 43. Kompilator i Generator Plików Tłumaczeń (Localization Translation Engine)

**Szczegółowy opis i cele edukacyjne:**
Zarządzanie internacjonalizacją (i18n) w dużych systemach wymaga narzędzi, które łączą elastyczność formatów edycyjnych (jak pliki JSON/CSV dla tłumaczy) z wydajnością i bezpieczeństwem typów w kodzie (strongly-typed localization keys).
Projekt polega na stworzeniu konsolowego generatora kodu (Code Generator), który wczytuje hierarchiczne pliki JSON z tłumaczeniami w różnych językach (np. `pl.json`, `en.json`), waliduje czy wszystkie klucze są spójne we wszystkich wersjach językowych, a następnie automatycznie generuje klasę w języku C# (plik `.cs`), zawierającą statyczne, silnie typowane właściwości ułatwiające dostęp do tłumaczeń z poziomu kodu bez używania "magic strings".

**Wymagane funkcje:**
- **Analiza i walidacja plików językowych:** Wczytanie plików JSON z tłumaczeniami i weryfikacja, czy w każdym pliku istnieją dokładnie te same klucze (np. wykrywanie brakujących tłumaczeń w wersji angielskiej).
- **Generowanie kodu źródłowego C# (Codegen):** Dynamiczne budowanie kodu klasy w języku C# na podstawie wykrytej struktury JSON przy użyciu klasy `StringBuilder` i zapisywanie jej do pliku `.cs`.
- **Obsługa parametrów w tłumaczeniach:** Jeśli wartość tłumaczenia zawiera tokeny (np. `Witaj {name}!`), wygenerowana metoda w C# powinna przyjmować parametr `Witaj(string name)`.
- **Wielojęzyczny silnik uruchomieniowy (Runtime Provider):** Klasa zarządzająca aktualną kulturą aplikacji (`CultureInfo`) i zwracająca odpowiednie teksty na podstawie wygenerowanych struktur.

**Porady implementacyjne i dobre praktyki:**
Zaimplementuj generator jako narzędzie CLI, które można uruchomić np. w procesie przed-kompilacji projektu (Pre-build event). Użyj `StringBuilder` do poprawnego formatowania generowanego kodu C# (pamiętaj o zachowaniu wcięć za pomocą spacji i nawiasów klamrowych klasy). Generowana klasa powinna mieć strukturę podobną do automatycznie generowanych plików `.designer.cs` w .NET. Aby zapobiec błędom kompilacji, zaimplementuj walidator sprawdzający, czy klucze w pliku JSON mogą być poprawnymi nazwami zmiennych w C# (np. nie mogą zaczynać się od cyfr ani zawierać spacji).
Wzorzec projektowy: *Flyweight (Pyłek)* dla mechanizmu cache'owania tłumaczeń w pamięci, *Code Generation*.
