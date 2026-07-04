## 7. Konwerter Plików Konfiguracyjnych INI to JSON (Config Converter CLI)

**Szczegółowy opis i cele edukacyjne:**
Konwersja formatów danych to częste wyzwanie inżynieryjne. W tym projekcie stworzysz narzędzie CLI, które przetwarza tradycyjne pliki konfiguracyjne `.ini` (podzielone na sekcje, klucze i wartości) na ustrukturyzowany plik `.json` (z obsługą zagnieżdżonych obiektów) i odwrotnie.
Projekt uczy pracy na plikach tekstowych, niskopoziomowego parsowania ciągów znaków (znaki komentarza `;` lub `#`, białe znaki, znaki ucieczki) oraz obsługi argumentów wejściowych wiersza poleceń. Cel edukacyjny to zrozumienie struktury drzewiastej (zagnieżdżanie konfiguracji za pomocą kropek w kluczach, np. `Database.Connection.Timeout = 30`) i dynamiczne budowanie obiektów w pamięci bez używania gotowych bibliotek parsujących INI.

**Wymagane funkcje:**
- **Parsowanie składni INI:** Własnoręcznie napisany parser analizujący plik linia po linii, ignorujący puste linie i komentarze, grupujący klucze pod odpowiednimi nagłówkami sekcji `[SectionName]`.
- **Obsługa zagnieżdżeń (Dot-Notation):** Mapowanie płaskich kluczy zawierających kropki (np. `App.Security.MaxRetries = 5`) na zagnieżdżoną strukturę słowników/obiektów w JSON.
- **Obsługa CLI (Argument Parser):** Obsługa parametrów wejściowych, takich jak ścieżka wejściowa (`-i`/`--input`), wyjściowa (`-o`/`--output`) oraz flaga nadpisania pliku docelowego (`-f`/`--force`).
- **Dwukierunkowość:** Możliwość konwersji w obie strony (INI -> JSON oraz JSON -> INI).

**Porady implementacyjne i dobre praktyki:**
Do przechowywania sparsowanej konfiguracji w pamięci użyj zagnieżdżonego słownika `Dictionary<string, object>`, gdzie wartością może być kolejny słownik lub string. Parsując klucze z kropkami, użyj rekurencji lub pętli przechodzącej po poziomach struktury danych w celu utworzenia zagnieżdżonych słowników. Zamiast pisać własną obsługę parametrów CLI od zera, warto zaznajomić się z biblioteką `System.CommandLine` (lub napisać prosty, czysty parser bazujący na tablicy `args` z obsługą switch-case). Zapewnij pełne wsparcie dla różnych kodowań plików (np. UTF-8 vs ANSI) za pomocą klasy `System.Text.Encoding`.
Wzorzec projektowy: *Composite* (do reprezentacji hierarchicznej struktury konfiguracji).
