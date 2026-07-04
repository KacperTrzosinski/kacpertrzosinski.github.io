## 189. Partycjonowany Kolumnowy Silnik Magazynowania LSM (Partitioned Columnar LSM Engine)

**Szczegółowy opis i cele edukacyjne:**
Wielkie bazy danych przechowujące terabajty danych nie mogą trzymać wszystkich informacji w jednej globalnej tabeli ani w jednym potężnym pliku na dysku. Aby zachować wydajność I/O oraz umożliwić równoległe skanowanie danych, baza stosuje Partycjonowanie Horyzontalne (Horizontal Sharding/Partitioning). Dane są dzielone na mniejsze logiczne zakresy (np. partycje oparte na zakresie klucza - Range Partitioning, lub haszu klucza - Hash Partitioning), a każda partycja działa jako niezależna instancja drzewa LSM z własnymi plikami kolumnowymi SSTable.
Projekt polega na zaimplementowaniu w C# partycjonowanego silnika kolumnowego LSM.
Cele edukacyjne to projektowanie rozproszonych i dzielonych struktur danych, implementacja zaawansowanego routingu zapytań (Query Routing), równoległe asynchroniczne skanowanie wielu partycji (Parallel Scan Engine), oraz wydajne zarządzanie pamięcią RAM w środowiskach wielowątkowych.

**Wymagane funkcje:**
- **Silnik partycjonowania horyzontalnego:** Podział globalnej tabeli na $N$ niezależnych partycji (Partitions) na podstawie zakresów kluczy (np. zakresy $A-E$, $F-J$ itp.). Każda partycja posiada własną strukturę `MemTable` i oddzielne katalogi plików `SSTable`.
- **Ruter Zapisów i Odczytów (Query Router):**
  - *Zapis*: Dynamiczne wyliczanie, do której partycji powinien trafić klucz na podstawie reguły zakresu (Range Partitioning). Zapis jest kierowany bezpośrednio do `MemTable` odpowiedniej partycji.
  - *Odczyt*: Analiza filtrów zapytania (np. `WHERE Key >= 'A' AND Key <= 'C'`) i kierowanie odczytu wyłącznie do partycji, które mogą zawierać te klucze (Partition Pruning), co drastycznie ogranicza operacje I/O.
- **Równoległy skaner kolumnowy (Parallel Column Scan):** Zapytania analityczne skanujące całą bazę (np. "oblicz SUM ze wszystkich wierszy") uruchamiają asynchroniczne skanowanie kolumnowe wszystkich partycji jednocześnie w wątkach roboczych z puli `.NET ThreadPool`.
- **Niezależne procesy Compaction:** Każda partycja ma własny wątek tła wykonujący scalanie (Compaction) plików SSTable, dzięki czemu operacje I/O są rozproszone w czasie i nie blokują całej bazy.

**Porady implementacyjne i dobre praktyki:**
Aby zaimplementować wektorowe i równoległe skanowanie bez blokowania wątków, używaj struktur asynchronicznych strumieni `IAsyncEnumerable<T>` w C#. Podczas skanowania dynamicznie przydzielaj zadania do wątków roboczych za pomocą klasy `Task.WhenAll`. Unikaj współdzielenia jakichkolwiek struktur blokujących między partycjami – każda partycja powinna działać w myśl zasady Shared-Nothing Architecture, co pozwala na liniowe skalowanie wydajności bazy danych w miarę dodawania nowych rdzeni procesora.
Wzorzec projektowy: *Shared-Nothing Architecture*, *Partition Pruning*, *Parallel Iterator*.
