## 124. Zaawansowane Keszowanie z Zapobieganiem Cache Stampede (Advanced Redis Cache)

**Szczegółowy opis i cele edukacyjne:**
Wdrożenie cache (np. w pamięci RAM lub Redis) to najprostsza metoda na przyspieszenie zapytań o stałe dane (np. lista kategorii, cennik). Jednak przy dużym ruchu (np. tysiące zapytań na sekundę) wygaśnięcie klucza cache o wysokiej popularności generuje groźne zjawisko o nazwie Cache Stampede (lub Cache Avalanche) – wszystkie równoległe wątki jednocześnie zauważają brak danych w cache i wysyłają identyczne, ciężkie zapytanie do bazy SQL, co doprowadza do jej natychmiastowego przeciążenia i awarii.
Projekt polega na stworzeniu zaawansowanej klasy pomocniczej cache (`RedisCacheWrapper<T>`), która wdraża bezpieczne pobieranie danych zapobiegające Cache Stampede.
Cele edukacyjne to synchronizacja współbieżna w środowisku rozproszonym przy użyciu blokad rozproszonych (Distributed Locks), optymalizacja serializacji, implementacja wzorca Cache-Aside oraz technika odświeżania tła (Lazy/Background refresh).

**Wymagane funkcje:**
- **Silnik blokowania lokalnego i rozproszonego:** Gdy klucz cache wygaśnie, tylko pierwszy wątek (który uzyskał blokadę `SemaphoreSlim` lub blokadę rozproszoną w Redis za pomocą `RedLock`) wykonuje zapytanie do bazy SQL, a pozostałe czekają i pobierają gotową wartość z cache, gdy tylko pierwszy wątek ją tam zapisze.
- **Strategia wczesnego odświeżania (Probabilistic Early Expiration):** Dynamiczne przeliczanie czasu życia klucza w tle – system bada prawdopodobieństwo wygaśnięcia klucza i odświeża dane asynchronicznie, zanim klucz fizycznie wygaśnie i zostanie usunięty z Redis.
- **Serializacja binarna (MessagePack / Protobuf):** Zastąpienie powolnej i generującej duże pakiety serializacji JSON na rzecz ultrawydajnej serializacji binarnej przy użyciu biblioteki MessagePack lub Google Protocol Buffers.
- **Wycofywanie uszkodzeń (Fallback resiliency):** Jeśli serwer Redis jest nieaktywny, wrapper automatycznie ignoruje błędy (Fail-Silent) i przekierowuje zapytania bezpośrednio do bazy SQL, gwarantując ciągłość działania aplikacji.

**Porady implementacyjne i dobre praktyki:**
Do implementacji blokad w Redis wykorzystaj bibliotekę `RedLock.net`, która poprawnie implementuje algorytm Redlock zalecany przez twórców Redis do bezpiecznego blokowania w środowiskach rozproszonych. Do wstrzykiwania wrappera wykorzystaj generyczną rejestrację typu singleton. Metoda pobierania powinna przyjmować delegat asynchroniczny jako źródło prawdy, np.:
`var data = await _cache.GetOrSetAsync("catalog", () => _dbContext.Products.ToListAsync(), TimeSpan.FromMinutes(10));`.
Wzorzec projektowy: *Cache-Aside*, *Distributed Lock*, *Resilience Fallback*.
