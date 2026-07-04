## 179. Kolumnowy LSM z Dynamicznym Rzutowaniem Typów (Columnar LSM Schema-on-Read)

**Szczegółowy opis i cele edukacyjne:**
Klasyczne bazy kolumnowe wymagają sztywnego zdefiniowania struktury tabeli przed zapisem (Schema-on-Write). Przy dynamicznie zmieniających się danych (np. logi aplikacji, dokumenty JSON) to podejście utrudnia pracę. Rozwiązaniem stosowanym w nowoczesnych analitycznych bazach danych jest Schema-on-Read – baza przyjmuje surowe, niestrukturyzowane dane (np. obiekty JSON), a silnik bazy podczas zapisu do pliku SSTable automatycznie analizuje ich strukturę (Flattening), dzieli wartości na dynamicznie tworzone kolumny, kompresuje je osobno i nakłada strukturę typów dopiero w momencie odczytu (Read).
Projekt polega na zaimplementowaniu w C# od zera silnika bazodanowego łączącego kolumnowy zapis LSM z dynamicznym rzutowaniem i dopasowywaniem schematu w locie.
Cele edukacyjne to dynamiczna detekcja typów danych w niestrukturyzowanych obiektach, automatyczne spłaszczanie zagnieżdżonych struktur JSON do płaskiej struktury kolumnowej, wektorowe parsowanie i rzutowanie typów w fazie odczytu, oraz dynamiczna generacja schematów.

**Wymagane funkcje:**
- **Dynamiczny parser wejściowy (JSON Parser & Flattening):** Baza przyjmuje asynchronicznie obiekty typu `JsonDocument` lub dynamiczne słowniki. System automatycznie spłaszcza zagnieżdżone obiekty (np. `{"user": {"age": 30}}` staje się kolumną `user.age`).
- **Dynamiczne typowanie i konwersja (Schema Detection):** Przy zrzucie `MemTable` do `SSTable` baza analizuje typy wartości dla każdej wykrytej kolumny. Jeśli wiersz 1 ma w kolumnie `x` liczbę `10`, a wiersz 2 ma `"tekst"`, kolumna `x` zostaje podzielona na kolumnę liczbową i tekstową lub rzutowana na typ nadrzędny, a informacje te są zapisywane w nagłówku pliku.
- **Wektorowe rzutowanie typów (Schema-on-Read execution):** Podczas zapytania użytkownik definiuje schemat wyjściowy (np. "chcę kolumny `user.name` jako string oraz `age` jako int"). Silnik odczytuje surowe bloki kolumnowe, rzutuje je wektorowo w pamięci `Span<byte>` na pożądane typy .NET w locie, wykonując filtrowanie.
- **Zintegrowany CLI Benchmarker:** Porównanie czasu zapisu i odczytu dynamicznego schematu w Twojej bazie kolumnowej oraz w tradycyjnej bazie dokumentowej (np. SQLite z kolumną tekstową JSON).

**Porady implementacyjne i dobre praktyki:**
Spłaszczanie zagnieżdżeń JSON zrealizuj rekurencyjnie, budując ścieżki kolumn oddzielone kropkami. Przy rzutowaniu typów podczas odczytu (Schema-on-Read), do szybkiej konwersji typów prymitywnych (np. konwersja ciągu bajtów ASCII na liczbę `int` lub `float`) wykorzystaj metody `Utf8Parser.TryParse` z przestrzeni `System.Buffers.Text`. Są one znacznie szybsze i nie generują alokacji obiektów typu string, w przeciwieństwie do standardowych metod `int.Parse(string)` czy `Convert.ToInt32()`.
Wzorzec projektowy: *Schema-on-Read*, *Flattening*, *Vectorized Converter*.
