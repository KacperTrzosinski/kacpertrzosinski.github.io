## 72. Generyczny Cache Dyskowej Pamięci z Zasadą LRU (Generic Disk Cache LRU)

**Szczegółowy opis i cele edukacyjne:**
Wyszukiwanie danych w bazie danych lub zapytania sieciowe są kosztowne. Gdy dane nie mieszczą się w pamięci RAM, optymalnym rozwiązaniem jest posiadanie warstwy pośredniej zapisu na szybkim dysku (np. SSD) z polityką zwalniania pamięci Least Recently Used (LRU) – najdawniej używane elementy są usuwane jako pierwsze, gdy rozmiar cache przekroczy zadany limit.
Projekt polega na stworzeniu w pełni generycznej biblioteki cache dyskowego (`DiskCache<TKey, TValue>`).
Cele edukacyjne to zaawansowane programowanie generyczne w C#, serializacja i deserializacja obiektów o nieznanym typie (za pomocą JSON lub protokołów binarnych), synchroniczny i asynchroniczny zapis strumieni plikowych, oraz implementacja wydajnej struktury danych LRU w pamięci (łączenie listy dwukierunkowej `LinkedList<T>` oraz słownika `Dictionary<TKey, TValue>` w celu uzyskania złożoności $O(1)$ dla operacji odczytu, zapisu i usuwania).

**Wymagane funkcje:**
- **Generyczny zapis i odczyt:** Klasa `DiskCache<TKey, TValue>` pozwalająca na zapisywanie i pobieranie obiektów z dysku. Klucz to string/int, a wartość to dowolny typ POCO (serializowany na dysk).
- **Polityka czyszczenia LRU (Least Recently Used):** Limit rozmiaru pamięci podręcznej (np. max 100MB lub max 1000 plików). Przy przekroczeniu limitu, cache automatycznie usuwa pliki, które były najdawniej odczytywane/zapisywane.
- **Bezpieczeństwo wątkowe (Concurrent access):** Blokowanie dostępu do pojedynczych plików cache na poziomie wątków (np. za pomocą `ReaderWriterLockSlim`), aby zapobiec konfliktom odczytu/zapisu.
- **Odporność na uszkodzenia danych:** Automatyczna walidacja sum kontrolnych plików cache przy odczycie w celu wykrycia uszkodzeń i ich ignorowania.

**Porady implementacyjne i dobre praktyki:**
Aby zaimplementować politykę LRU o złożoności $O(1)$, użyj `Dictionary<TKey, LinkedListNode<CacheItemInfo>>` do szybkiego wyszukiwania informacji o elementach w pamięci oraz `LinkedList<CacheItemInfo>` do śledzenia kolejności użycia. Przy każdym odczycie elementu przenieś powiązany węzeł listy na jej początek (most recently used). Elementy na końcu listy (least recently used) są przeznaczone do usunięcia, gdy cache się zapełni. Do zapisu obiektów na dysk użyj dynamicznej serializacji do strumienia JSON za pomocą `System.Text.Json` w trybie asynchronicznym.
Wzorzec projektowy: *Proxy*, *Least Recently Used Cache Pattern*.
