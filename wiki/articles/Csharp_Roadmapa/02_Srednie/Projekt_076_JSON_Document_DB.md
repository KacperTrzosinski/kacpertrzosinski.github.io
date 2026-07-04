## 76. Baza Danych Dokumentowa JSON z Indeksami B-Drzewa (JSON Document DB)

**Szczegółowy opis i cele edukacyjne:**
Bazy dokumentowe (np. MongoDB) zapisują dane w postaci ustrukturyzowanych dokumentów (JSON/BSON) i wymagają wydajnego wyszukiwania po zindeksowanych właściwościach. Bez indeksów każde zapytanie wymaga pełnego skanowania kolekcji (Full Table Scan), co jest nieakceptowalne wydajnościowo.
Projekt polega na stworzeniu plikowej bazy danych dokumentów JSON.
Cele edukacyjne to implementacja zaawansowanej struktury danych indeksu B-Drzewa (B-Tree), która pozwala na wyszukiwanie, dodawanie i usuwanie kluczy w czasie logarytmicznym $O(\log N)$ przy zachowaniu zrównoważenia drzewa. Uczestnik uczy się również asynchronicznego zapisu dokumentów na dysku, dynamicznego parsowania ścieżek właściwości oraz mapowania indeksów w pamięci na fizyczne pozycje plików na dysku.

**Wymagane funkcje:**
- **Zapis dokumentów (Document Storage):** Dodawanie dokumentów JSON do kolekcji, generowanie unikalnych `Guid` jako identyfikatorów i zapisywanie ich w plikach na dysku (jeden plik na dokument lub struktura typu append-only log).
- **Indeks B-Drzewa w pamięci:** Własna, zrównoważona struktura B-Drzewa indeksująca wybrane właściwości dokumentów (np. indeks na polu `Age` przechowujący pary: `(AgeValue, DocumentId)`).
- **Silnik zapytań (Query Engine):** Obsługa zapytań filtrujących (np. wyszukiwanie dokumentów o wartościach w zadanym przedziale), które automatycznie wykorzystują indeks B-Drzewa (Range Query) zamiast przeszukiwania liniowego.
- **Transakcyjność zapisu (Commit Log):** Zapisywanie informacji o zmianach w pliku dziennika transakcji (Write-Ahead Log - WAL) przed dokonaniem fizycznego zapisu na dysku.

**Porady implementacyjne i dobre praktyki:**
B-Drzewo jest drzewem poszukiwań o dużym stopniu rozgałęzienia (parametr $M$), co czyni je idealnym do indeksowania, ponieważ minimalizuje głębokość drzewa. Każdy węzeł B-Drzewa powinien zawierać listę posortowanych kluczy i referencji do dzieci/dokumentów. Używaj algorytmu przeszukiwania binarnego (Binary Search) do wyszukiwania klucza wewnątrz pojedynczego węzła. Przy modyfikacji dokumentu upewnij się, że aktualizujesz wszystkie powiązane indeksy (np. usunięcie starej wartości z indeksu i wstawienie nowej).
Wzorzec projektowy: *B-Tree Indexing*, *Unit of Work*, *Memento*.
