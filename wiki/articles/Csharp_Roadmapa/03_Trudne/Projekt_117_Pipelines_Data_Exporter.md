## 117. Szybki Eksport Danych z Użyciem System.IO.Pipelines (Pipelines Data Exporter)

**Szczegółowy opis i cele edukacyjne:**
Wysokowydajny eksport danych z bazy do formatu CSV lub JSON (np. w systemach analitycznych) często napotyka barierę alokacji pamięci. Tradycyjne metody (czytanie całej tabeli z bazy do pamięci RAM, konwersja na stringi i zapis do strumienia) generują ogromny narzut na Garbage Collector, spowalniając aplikację.
Projekt polega na stworzeniu wydajnego narzędzia CLI do eksportu danych, które przetwarza strumień rekordów bazodanowych (przy użyciu `IAsyncEnumerable<T>`) bezpośrednio do pliku wyjściowego, wykorzystując nowoczesną przestrzeń `System.IO.Pipelines` do bezalokacyjnego zarządzania pamięcią buforową.
Cele edukacyjne to zaawansowana praca z potokami systemowymi (`Pipe`, `PipeReader`, `PipeWriter`), zarządzanie buforami pamięci niezarządzanej przy użyciu `ReadOnlySequence<byte>` oraz `Memory<byte>`, oraz unikanie alokacji napisów (String allocation) przez bezpośrednie zapisywanie sformatowanych danych binarnych UTF-8.

**Wymagane funkcje:**
- **Zasilanie asynchroniczne (Data Streaming):** Pobieranie danych z bazy SQL Server/SQLite wiersz po wierszu jako strumień obiektów `IAsyncEnumerable<T>`, co gwarantuje stałe i minimalne zużycie pamięci niezależnie od liczby rekordów.
- **Zapis przez System.IO.Pipelines:** Użycie `PipeWriter` do pobierania wolnych buforów pamięci bezpośrednio z systemowej puli (`ArrayPool<byte>`), formatowania danych rekordu jako bajty UTF-8 i automatycznego asynchronicznego wypychania ich na dysk.
- **Zero-allocation Parser:** Zastąpienie konwersji `object.ToString()` na rzecz niskopoziomowych metod strukturalnych (np. `Utf8Formatter.TryFormat` z biblioteki `System.Buffers.Text`), piszących liczby i daty bezpośrednio do pamięci bufora.
- **Zintegrowany tester wydajności:** Narzędzie raportujące czas eksportu, zużycie pamięci RAM (GC allocated memory) oraz liczbę operacji odśmiecania (Gen 0/1/2 collection counts) w porównaniu do klasycznego zapisu strumieniowego `StreamWriter`.

**Porady implementacyjne i dobre praktyki:**
`System.IO.Pipelines` pozwala na rozdzielenie logiki zapisu (Producer) od logiki fizycznej transmisji danych na dysk/sieć (Consumer). W metodzie producenckiej pobieraj bufor za pomocą `PipeWriter.GetMemory(minSize)`, zapisuj do niego sformatowane bajty, a następnie wywołaj `PipeWriter.Advance(bytesWritten)` i asynchronicznie powiadamiaj konsumenta przez `PipeWriter.FlushAsync()`. Zapewnia to maksymalne wykorzystanie wątków i eliminuje blokowanie I/O.
Wzorzec projektowy: *Producer-Consumer (Producent-Konsument)*, *Flyweight*.
