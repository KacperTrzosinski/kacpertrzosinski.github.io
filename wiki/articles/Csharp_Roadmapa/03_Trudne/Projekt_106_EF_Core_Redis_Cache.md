## 106. EF Core z Cache Drugiego Poziomu w Redis (EF Core Redis Cache)

**Szczegółowy opis i cele edukacyjne:**
W aplikacjach o wysokim obciążeniu bezpośrednie odpytywanie bazy relacyjnej (SQL Server/PostgreSQL) przy każdym zapytaniu użytkownika prowadzi do przeciążenia bazy. Rozwiązaniem jest Cache Drugiego Poziomu (Second-Level Cache) – wyniki zapytań bazodanowych są zapisywane w szybkiej pamięci podręcznej (np. Redis), a kolejne identyczne zapytania są obsługiwane z cache z pominięciem bazy SQL.
Projekt polega na zaimplementowaniu w pełni funkcjonalnego mechanizmu Second-Level Cache dla Entity Framework Core z wykorzystaniem serwera Redis.
Cele edukacyjne to integracja z Redisem (`StackExchange.Redis`), interceptory zapytań w EF Core (`DbCommandInterceptor`), automatyczna invalidacja cache przy modyfikacjach tabel bazodanowych (operacje `INSERT`/`UPDATE`/`DELETE`), oraz transakcyjne zarządzanie spójnością danych.

**Wymagane funkcje:**
- **Interceptor zapytań EF Core:** Autorski interceptor dziedziczący po `DbCommandInterceptor`, który przechwytuje zapytania SELECT wygenerowane przez EF Core, sprawdza czy wynik znajduje się w Redis i jeśli tak, zwraca dane bezpośrednio z cache (zapobiegając uderzeniu do bazy).
- **Serializacja wyników (DbDataReader serialization):** Zaimplementowanie mechanizmu serializacji surowych wyników zapytania (`DbDataReader`) do postaci binarnej lub JSON w celu ich przechowania w Redis.
- **Strategie invalidacji (Cache Eviction):** Automatyczne śledzenie modyfikowanych tabel (np. za pomocą metody `ReaderExecuted` przy zapytaniach modyfikujących) i usuwanie z Redisa kluczy cache powiązanych z tymi tabelami, aby zapobiec serwowaniu nieaktualnych danych.
- **Dynamiczne włączanie cache (Query Tagging):** Możliwość określenia, które zapytania LINQ mają być cache'owane przy użyciu tagów (np. `dbContext.Products.TagWith("use-cache").ToList()`).

**Porady implementacyjne i dobre praktyki:**
Aby interceptor przechwytywał zapytania, musisz zarejestrować go w konfiguracji DbContext, np. `options.AddInterceptors(new RedisCacheInterceptor(redisConnection))`. Unikaj ręcznego czyszczenia całego cache Redis przy każdej edycji danych. Zamiast tego przechowuj w Redis dla każdej tabeli wersję znacznika czasu (tzw. Table Versioning). Klucz cache dla zapytania powinien zawierać sumę kontrolną SQL oraz aktualne wersje tabel w nim uczestniczących. Gdy tabela $T$ zostaje zmodyfikowana, inkrementujesz jej wersję w Redis, co automatycznie sprawia, że wszystkie stare klucze cache dla tej tabeli stają się nieaktywne (invalidated).
Wzorzec projektowy: *Decorator (Dekorator)*, *Proxy (Pełnomocnik)*, *Cache-Aside*.
