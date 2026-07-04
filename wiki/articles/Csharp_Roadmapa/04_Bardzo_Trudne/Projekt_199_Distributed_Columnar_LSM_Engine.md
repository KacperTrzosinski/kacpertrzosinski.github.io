## 199. Rozproszony Kolumnowy Silnik Magazynowania Danych LSM (Distributed Columnar LSM Engine)

**Szczegółowy opis i cele edukacyjne:**
Gdy dane są rozproszone na wielu maszynach (węzłach klastra), zapytania analityczne (OLAP) wymagają zaawansowanego orkiestratora, który roześle zapytanie do odpowiednich węzłów, zbierze wyniki cząstkowe i dokona ich ostatecznej agregacji. W architekturze rozproszonych baz kolumnowych (jak ClickHouse) stosuje się model Map-Reduce do dynamicznego rozpraszania obliczeń. Węzeł główny (Coordinator) dzieli zapytanie, przesyła je sieciowo do węzłów przechowujących odpowiednie partycje kolumnowe (Map), a te wykonują filtrowanie i agregację lokalnie, odsyłając skompresowane dane wektorowe do koordynatora, który dokonuje scalenia (Reduce).
Projekt polega na zaimplementowaniu w C# rozproszonego silnika zapytań analitycznych dla partycjonowanej bazy kolumnowej LSM.
Cele edukacyjne to projektowanie systemów rozproszonego przetwarzania danych (Distributed Query Execution), optymalizacja przesyłu dużych zbiorów danych (Data Streaming/Chunking), oraz dynamiczna agregacja i łączenie danych z wielu źródeł (Distributed Merge-Join).

**Wymagane funkcje:**
- **Koordynator zapytań rozproszonych (Query Coordinator):** Węzeł przyjmujący zapytanie SQL/analityczne (np. `SELECT Country, SUM(Sales) GROUP BY Country`). System analizuje schemat partycjonowania i generuje plan wykonania zapytania rozproszonego (Execution Plan).
- **Potok Map-Reduce w klastrze:**
  - *Faza Map*: Koordynator wysyła asynchroniczne żądania wykonania pod-zapytań do węzłów przechowujących partycje. Każdy węzeł skanuje swoje lokalne kolumnowe pliki SSTable i wykonuje lokalne grupowanie oraz agregację.
  - *Faza Reduce*: Węzły odsyłają wektorowe wyniki cząstkowe. Koordynator odbiera strumienie danych i w locie scala je (np. sumuje sumy cząstkowe z różnych węzłów), zwracając ostateczny wynik.
- **Rozproszony mechanizm łączenia (Distributed Broadcast Join):** Obsługa łączenia dużej tabeli faktów z małą tabelą wymiarów poprzez rozesłanie (Broadcast) małej tabeli do wszystkich węzłów wykonujących zapytanie lokalnie.
- **Obsługa awarii w trakcie zapytania (Query Fault Tolerance):** Jeśli jeden z węzłów klastra przestanie odpowiadać w trakcie wykonywania zapytania, koordynator automatycznie przekierowuje zapytanie do węzła repliki, zapobiegając przerwaniu działania całego systemu.

**Porady implementacyjne i dobre praktyki:**
Do asynchronicznego przesyłania strumieniowego wyników z węzłów do koordynatora wykorzystaj technologię gRPC ze strumieniowaniem odpowiedzi (Server Streaming) lub surowe gniazda TCP obsługiwane za pomocą `System.IO.Pipelines`. Przesyłane dane binarne powinny być skompresowane szybkim algorytmem (np. LZ4), co zminimalizuje użycie pasma sieciowego. Wykorzystanie `IAsyncEnumerable<T>` w C# pozwala koordynatorowi na rozpoczęcie fazy Reduce i scalanie wyników zanim wszystkie węzły zakończą fazę Map (Pipelined Execution), co dramatycznie przyspiesza czas odpowiedzi (Time-to-First-Byte).
Wzorzec projektowy: *Map-Reduce*, *Distributed Coordinator*, *Broadcast Join*.
