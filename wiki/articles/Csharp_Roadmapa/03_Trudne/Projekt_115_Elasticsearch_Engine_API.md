## 115. Silnik Wyszukiwania Pełnotekstowego z Elasticsearch (Elasticsearch Engine API)

**Szczegółowy opis i cele edukacyjne:**
Klasyczne bazy relacyjne SQL nie radzą sobie wydajnie z wyszukiwaniem pełnotekstowym (Full-text search), zwłaszcza gdy wymagane jest wyszukiwanie rozmyte (Fuzzy matching - dopasowanie mimo literówek), podświetlanie pasujących fraz (Highlighting), synonimy czy zaawansowane agregacje (Facets) w czasie rzeczywistym. Standardem w tym obszarze jest wyszukiwarka `Elasticsearch` (oparta o bibliotekę Lucene).
Projekt polega na stworzeniu serwisu API wyszukiwarki produktów lub artykułów zintegrowanego z serwerem Elasticsearch przy użyciu oficjalnego klienta .NET (`NEST` lub `Elastic.Clients.Elasticsearch`).
Cele edukacyjne to modelowanie dokumentów i indeksów w Elasticsearch, automatyczna synchronizacja zmian z bazy SQL do Elasticsearch (wzorzec CQRS Read-Model / Dual Write), oraz budowanie złożonych zapytań wyszukiwania (Boolean queries, Fuzzy queries, Wildcards).

**Wymagane funkcje:**
- **Inicjalizacja i mapowanie indeksu:** Tworzenie indeksu z odpowiednimi analizatorami tekstu (np. analizator języka polskiego obsługujący odmianę słów/lematyzację) z poziomu kodu C#.
- **Zapytania pełnotekstowe (Search Queries):** Endpoint wyszukiwania obsługujący: frazę główną, wyszukiwanie rozmyte (Fuzziness), paginację, sortowanie oraz filtrowanie po kategoriach.
- **Filtrowanie fasetowe (Faceted Search / Aggregations):** Wyliczanie statystyk dynamicznych dla filtrów bocznych (np. "pokaż ile produktów w wynikach wyszukiwania należy do poszczególnych przedziałów cenowych lub marek").
- **Synchronizacja danych (SQL -> Elasticsearch):** Implementacja mechanizmu nasłuchującego na zdarzenia zapisu/edycji w bazie SQL (np. za pomocą EF Core Interceptor lub Events) i automatycznie aktualizującego dokumenty w indeksie Elasticsearch.

**Porady implementacyjne i dobre praktyki:**
W najnowszych wersjach biblioteki dla C# nazwa pakietu zmieniła się z `NEST` na `Elastic.Clients.Elasticsearch`. Do definiowania zapytań wykorzystuj Fluent API klienta Elasticsearch, co pozwala pisać zapytania w czytelny sposób. Zabezpiecz system przed awarią Elasticsearch – jeśli wyszukiwarka przestanie działać, aplikacja powinna to wykryć (np. za pomocą wzorca Circuit Breaker z biblioteki Polly) i automatycznie przełączyć się na prostsze (choć wolniejsze) wyszukiwanie awaryjne w bazie SQL, informując administratorów o problemie.
Wzorzec projektowy: *CQRS*, *Repository*, *Fallback Pattern*.
