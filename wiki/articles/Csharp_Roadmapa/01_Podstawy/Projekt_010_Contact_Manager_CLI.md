## 10. Konsolowy Menadżer Kontaktów z Zaawansowaną Walidacją (Contact Manager CLI)

**Szczegółowy opis i cele edukacyjne:**
Praca z danymi wprowadzonymi przez użytkownika zawsze niesie ze sobą ryzyko błędów lub złośliwego działania. W tym projekcie stworzysz zaawansowany menadżer kontaktów (książkę adresową) w wersji CLI. Aplikacja przechowuje informacje o osobach: imię, nazwisko, numery telefonów, adresy e-mail oraz datę urodzenia.
Głównym celem edukacyjnym jest opanowanie wyrażeń regularnych (`Regex`) w języku C# do dokładnej walidacji poprawności adresów e-mail (zgodnie ze standardem RFC 5322), numerów telefonów (obsługa prefiksów krajowych i spacji) oraz formatowania danych wyjściowych na konsoli. Dodatkowo projekt uczy bezpiecznej pracy z łańcuchami znaków (String Interpolation, unikanie niepotrzebnych alokacji pamięci przy łączeniu stringów) oraz sortowania danych według wielu kryteriów.

**Wymagane funkcje:**
- **Walidacja danych przy użyciu Regex:** Zastosowanie wyrażeń regularnych do walidacji poczty e-mail, numerów telefonów oraz poprawności kodu pocztowego.
- **Wyszukiwanie pełnotekstowe (Fuzzy Search):** Wyszukiwanie kontaktów po fragmencie imienia, nazwiska lub numeru telefonu (ignorując wielkość liter oraz spacje).
- **Formatowanie tabelaryczne (CLI Grid):** Renderowanie listy kontaktów w czytelnej tabeli konsolowej o stałej szerokości kolumn przy użyciu metod formatowania stringów.
- **Wielokryteriowe sortowanie:** Sortowanie kontaktów po nazwisku, a w przypadku takich samych nazwisk – po imieniu, przy użyciu metod LINQ (`OrderBy` oraz `ThenBy`).

**Porady implementacyjne i dobre praktyki:**
Do walidacji pól tekstowych utwórz statyczne, skompilowane obiekty `Regex` (używając opcji `RegexOptions.Compiled` lub nowego generatora źródłowego `[GeneratedRegex]` dostępnego w .NET 7+), aby uniknąć narzutu ponownej kompilacji wyrażenia przy każdym wywołaniu walidacji. Do łączenia wielu tekstów (np. budowania widoku tabeli w pamięci) zamiast prostego operatora `+` wykorzystaj klasę `StringBuilder`, co drastycznie zmniejsza fragmentację pamięci. Zabezpiecz wprowadzanie daty urodzenia przed podaniem daty z przyszłości oraz przed osobami, które mają "ponad 150 lat".
Wzorzec projektowy: *Builder* (do tworzenia obiektów kontaktu krok po kroku z walidacją pośrednią).
