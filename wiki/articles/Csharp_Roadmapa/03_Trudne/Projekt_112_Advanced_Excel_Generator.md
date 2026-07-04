## 112. Generator Zaawansowanych Raportów Excel w Pamięci (Advanced Excel Generator)

**Szczegółowy opis i cele edukacyjne:**
Raportowanie danych to standardowy wymóg aplikacji biznesowych. Generowanie dużych zestawień (np. miliony wierszy danych finansowych) bezpośrednio do formatu Excel (`.xlsx`) może prowadzić do przeciążenia pamięci RAM (Out Of Memory) oraz powolnego pobierania plików przez użytkowników, jeśli cały dokument jest tworzony i formatowany w pamięci przed wysłaniem.
Projekt polega na stworzeniu wydajnego generatora raportów Excel opartego o bibliotekę `EPPlus` lub `ClosedXML` zaimportowaną przez NuGet.
Cele edukacyjne to zaawansowana optymalizacja operacji I/O z użyciem strumieni (`Stream`), formatowanie warunkowe (Conditional Formatting) na bazie kryteriów, auto-dopasowanie szerokości kolumn (Auto-fit), oraz dynamiczne generowanie wykresów (Charts) osadzanych w arkuszach z poziomu kodu C#.

**Wymagane funkcje:**
- **Strumieniowe generowanie dużych zbiorów:** Tworzenie plików Excel przy użyciu minimalnej ilości pamięci RAM poprzez zapis danych w trybie strumieniowym (Stream Writer) bezpośrednio do strumienia wyjściowego HTTP (Response Stream).
- **Formatowanie i style komórek:** Programowanie stylów (czcionki, kolory, obramowania, formatowanie liczb - np. waluty, daty) oraz automatyczne dopasowywanie szerokości kolumn na podstawie zawartości.
- **Formatowanie warunkowe (Conditional Formatting):** Automatyczne nakładanie stylów na komórki spełniające określone reguły (np. komórki z ujemnym zyskiem podświetlane na czerwono).
- **Generowanie wykresów (Embedded Charts):** Dynamiczne dodawanie wykresów (np. wykres kolumnowy pokazujący sprzedaż w ujęciu miesięcznym) pobierających dane bezpośrednio z wygenerowanej tabeli arkusza.

**Porady implementacyjne i dobre praktyki:**
W przypadku korzystania z biblioteki EPPlus pamiętaj o ustawieniu kontekstu licencyjnego w kodzie startupu: `ExcelPackage.LicenseContext = LicenseContext.NonCommercial;`. Przy generowaniu bardzo dużych raportów (powyżej 100 000 wierszy) unikaj budowania głębokich struktur obiektowych w pamięci. Zamiast tego skorzystaj z niskopoziomowego zapisu XML przez `OpenXmlWriter` (w pakiecie DocumentFormat.OpenXml), co pozwala zapisać wiersz po wierszu bezpośrednio na dysk/do sieci ze stałym zużyciem pamięci RAM rzędu kilkunastu kilobajtów.
Wzorzec projektowy: *Builder (Budowniczy)*, *Flyweight*.
