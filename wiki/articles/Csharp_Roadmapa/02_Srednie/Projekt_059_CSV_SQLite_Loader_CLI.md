## 59. Masowy Importer Danych CSV do Bazy SQLite (CSV SQLite Loader CLI)

**Szczegółowy opis i cele edukacyjne:**
Wczytanie dużego pliku CSV (np. 1 000 000 wierszy) i zapisanie go do bazy danych linia po linii za pomocą pojedynczych zapytań SQL zajmie niesamowicie dużo czasu (nawet kilka godzin) ze względu na narzut operacji sieciowych i dyskowych I/O.
Projekt polega na stworzeniu wydajnego narzędzia CLI do masowego importu (Bulk Insert) danych z CSV do lokalnej bazy SQLite.
Głównym celem edukacyjnym jest nauka optymalizacji zapisu do baz danych. Student dowiaduje się, jak drastycznie zwiększyć wydajność operacji bazodanowych za pomocą grupowania w transakcje (Transaction Batching), tworzenia zapytań sparametryzowanych w postaci pojedynczych transakcji masowych, oraz optymalizacji konfiguracji samej bazy SQLite (znaki pragmatyczne, np. `PRAGMA synchronous = OFF`).

**Wymagane funkcje:**
- **Szybkie czytanie CSV:** Zaimplementowanie strumieniowego parsera CSV wczytującego porcje danych (np. po 10 000 wierszy).
- **Inicjalizacja schematu:** Dynamiczne tworzenie tabeli SQLite na podstawie struktury kolumn pierwszego wiersza pliku CSV (automatyczne dopasowanie typów danych: liczba vs tekst).
- **Optymalny Bulk Insert:** Zapis paczek danych (batching) przy użyciu Dappera i transakcji SQL (`IDbTransaction`).
- **Tuning SQLite (Pragmas):** Wykorzystanie poleceń konfiguracyjnych SQLite do wyłączenia synchronicznego zapisu na dysk i użycia pamięci podręcznej w celu maksymalizacji prędkości zapisu.

**Porady implementacyjne i dobre praktyki:**
Zmierzenie czasu ładowania danych przed i po optymalizacji to kluczowy element projektu. Zastosowanie transakcji SQL jest najważniejszym krokiem – SQLite bez otwartej transakcji wykonuje jawny zapis na dysk po każdym poleceniu `INSERT` (co ogranicza prędkość do kilkudziesięciu wstawień na sekundę). Po zgrupowaniu np. 50 000 insertów w jedną transakcję prędkość wzrośnie do kilkudziesięciu tysięcy wstawień na sekundę. Uruchom polecenia konfiguracyjne przed importem:
```sql
PRAGMA journal_mode = MEMORY;
PRAGMA synchronous = OFF;
PRAGMA cache_size = 100000;
```
Porównaj wydajność Dappera z czystym ADO.NET (`SqliteCommand`) pod kątem szybkości importu masowego.
Wzorzec projektowy: *Unit of Work*, *Batcher*.
