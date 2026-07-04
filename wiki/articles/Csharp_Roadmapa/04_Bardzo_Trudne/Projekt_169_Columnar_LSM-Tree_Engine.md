## 169. Kolumnowy Silnik Magazynowania Danych na Bazie LSM (Columnar LSM-Tree Engine)

**Szczegółowy opis i cele edukacyjne:**
Tradycyjne bazy danych LSM (jak LevelDB) przechowują wiersze jako spójne bloki (Row-oriented). Jest to świetne do pobierania całych obiektów, ale przy zapytaniach analitycznych (OLAP, np. "oblicz średnią cenę ze wszystkich milionów zamówień") baza musi wczytać z dysku całe wiersze wraz z niepotrzebnymi kolumnami (np. opis, adres dostawy), co generuje gigantyczny narzut I/O. Rozwiązaniem jest Kolumnowy Zapis Danych (Column-oriented storage), gdzie każda kolumna jest zapisywana w osobnym, posortowanym i skompresowanym bloku na dysku (wzorce znane z formatów Parquet lub baz ClickHouse).
Projekt polega na zaimplementowaniu w C# od zera analitycznej bazy danych klucz-wartość łączącej zalety drzewa LSM z kolumnowym zapisem plików SSTable.
Cele edukacyjne to kolumnowe modelowanie struktur danych, implementacja zaawansowanych algorytmów kompresji danych (Run-Length Encoding - RLE, Dictionary Encoding, Delta Compression), oraz dynamiczny odczyt wektorowy (Vectorized Query Execution) pozwalający na przetwarzanie bloków kolumn bezpośrednio w pamięci RAM.

**Wymagane funkcje:**
- **Kolumnowa struktura SSTable:** Plik SSTable na dysku podzielony na bloki kolumn (Column Chunks). Każda kolumna (np. ID, Wiek, Cena) ma własną, osobną sekcję bajtów w pliku, spakowaną i posortowaną po kluczu głównym.
- **Kompresja kolumnowa w locie:** Zaimplementowanie algorytmów kompresji dopasowanych do typów danych:
  - *Run-Length Encoding (RLE)*: Pakowanie powtarzających się wartości (np. statusy `Active, Active, Active` zapisywane jako `3xActive`).
  - *Dictionary Encoding*: Zastępowanie powtarzających się długich tekstów krótkimi indeksami liczbowymi.
  - *Delta Encoding*: Zapisywanie różnic między kolejnymi liczbami (przydatne dla rosnących ID lub czasów).
- **Odczyt wektorowy (Vectorized Execution):** Silnik zapytań analitycznych (np. `SUM`, `AVG`) wczytuje z dysku wyłącznie bloki bajtów dla wymaganych kolumn bezpośrednio do pamięci tablicowej (`Span<T>` lub `Memory<T>`), przeprowadzając obliczenia w pętli zoptymalizowanej pod kątem cache procesora.
- **Background Compactor:** Proces scalający pliki SSTable z zachowaniem podziału kolumnowego i ponownym przeliczaniem kompresji i słowników encodujących.

**Porady implementacyjne i dobre praktyki:**
Projektowanie zapisu kolumnowego wymaga precyzyjnego planowania układu pliku (File Layout). Na końcu każdego pliku SSTable umieść sekcję metadanych (Footer), która zawiera tablicę przesunięć (Offsets) wskazujących początek i długość bloku dla każdej kolumny oraz statystyki (np. min/max wartość w bloku - Min/Max indexes, co pozwala na pomijanie odczytu całych bloków kolumn, jeśli poszukiwana wartość leży poza przedziałem). Do obliczeń analitycznych w pamięci wykorzystaj instrukcje wektorowe SIMD przy użyciu klas z przestrzeni `System.Runtime.Intrinsics`, co pozwala na wykonanie operacji matematycznych na wielu liczbach jednocześnie w jednym cyklu procesora.
Wzorzec projektowy: *Column-Oriented Storage*, *Flyweight*, *Strategy*.
