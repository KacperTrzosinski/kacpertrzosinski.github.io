## 159. Silnik Magazynowania Danych na Bazie Drzewa LSM (Disk LSM-Tree Engine)

**Szczegółowy opis i cele edukacyjne:**
Bazy danych oparte o drzewa B-Tree (np. SQLite, PostgreSQL) świetnie radzą sobie z odczytami, ale przy intensywnych zapisach generują losowe operacje I/O na dysku, co spowalnia system. Alternatywą zoptymalizowaną pod kątem szybkich zapisów (Write-heavy workloads) jest LSM-Tree (Log-Structured Merge-Tree), stosowany w bazach takich jak Cassandra, RocksDB czy LevelDB.
Projekt polega na stworzeniu od zera trwałego silnika bazy danych klucz-wartość opartego o strukturę LSM-Tree.
Cele edukacyjne to implementacja struktur danych w pamięci (MemTable w postaci zbalansowanego drzewa AVL lub tablicy SkipList), obsługa dziennika zapisu wyprzedzającego (Write-Ahead Log - WAL), serializacja i zapis posortowanych struktur do plików na dysku (SSTables - Sorted String Tables), implementacja filtrów Blooma (Bloom Filters) do optymalizacji odczytów, oraz asynchroniczne porządkowanie i scalanie plików w tle (Compaction / Merge-sort).

**Wymagane funkcje:**
- **MemTable & WAL:** Nowe zapisy trafiają najpierw do trwałego logu `wal.log` (zapis sekwencyjny na końcu pliku), a następnie do struktury `MemTable` w pamięci RAM.
- **Zrzut SSTable (Flushing):** Gdy rozmiar `MemTable` przekroczy określony limit (np. 1MB), baza blokuje MemTable, tworzy nowy pusty MemTable, a stary asynchronicznie sortuje i zrzuca na dysk jako plik `SSTable` (posortowane pary klucz-wartość) oraz usuwa stary plik WAL.
- **Filtry Blooma (Bloom Filters):** Każdy plik SSTable posiada skojarzony w pamięci RAM filtr Blooma (tablica bitowa z haszowaniem). Przed odczytaniem pliku z dysku program bada filtr Blooma – jeśli filtr wykaże, że klucza nie ma w pliku, program całkowicie pomija odczyt tego pliku, co oszczędza operacje I/O.
- **Asynchroniczny proces scalania (Compaction Worker):** Usługa w tle scalająca wiele mniejszych plików SSTable w jeden większy plik za pomocą algorytmu sortowania przez scalanie (Merge Sort), usuwająca przestarzałe lub usunięte wiersze (Tombstones).

**Porady implementacyjne i dobre praktyki:**
Struktura SSTable powinna zawierać sekcję danych (posortowane klucze i wartości) oraz indeks na końcu pliku (Mapowanie kluczy na przesunięcia bajtowe w pliku - Offset Index), co pozwala na szybkie wyszukiwanie binarne wewnątrz pojedynczego pliku. Klasa filtra Blooma wykorzystuje kilka niezależnych funkcji haszujących (np. MurmurHash3 z różnymi ziarnami - Seeds) w celu zminimalizowania prawdopodobieństwa wyników fałszywie dodatnich (False Positives). Zadbaj o transakcyjne wznawianie bazy po awarii – jeśli program zostanie nagle wyłączony, przy starcie wczytuje dane z pliku `wal.log` w celu odbudowania stanu MemTable przed wyłączeniem.
Wzorzec projektowy: *LSM-Tree*, *Write-Ahead Logging*, *Compactor*, *Flyweight*.
