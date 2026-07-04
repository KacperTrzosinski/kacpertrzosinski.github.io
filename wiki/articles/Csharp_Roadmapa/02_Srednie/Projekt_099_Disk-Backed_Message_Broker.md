## 99. Silnik Kolejkowy Pub-Sub z Buforem Plikowym (Disk-Backed Message Broker)

**Szczegółowy opis i cele edukacyjne:**
Klasyczny broker wiadomości działający w pamięci RAM traci wszystkie dane przy awarii. Chcąc zachować trwałość danych, broker musi zapisywać wiadomości na dysku (np. tak jak Apache Kafka, który zapisuje wiadomości do plików dziennika typu append-only log).
Projekt polega na stworzeniu wydajnego brokera wiadomości pub-sub, w którym wiadomości są trwale buforowane na dysku w plikach binarnych z szybkim indeksowaniem w pamięci RAM w celu zachowania wysokiej przepustowości.
Cele edukacyjne to zaawansowana praca z binarnym zapisem plików, strukturyzacja danych w postaci Append-Only Commit Log, dynamiczne odczytywanie wiadomości z dysku na podstawie przesunięć (Offsets), oraz optymalizacja zapisu (unikanie natychmiastowego zapisu na dysk fizyczny dla każdej wiadomości poprzez grupowanie zapisów w buforze pamięciowym).

**Wymagane funkcje:**
- **Append-Only Commit Log:** Zapisywanie nadchodzących wiadomości binarnych sekwencyjnie na końcu jednego dużego pliku dziennika (`commit.log`). Każda wiadomość otrzymuje kolejny numer indeksu (Offset).
- **Indeksowanie pozycji w RAM:** Przechowywanie w pamięci RAM tablicy lub słownika przesunięć `Dictionary<long, long>` (Offset -> Pozycja bajtowa w pliku), co pozwala na błyskawiczne pobranie dowolnej historycznej wiadomości w czasie $O(1)$.
- **Segmentacja plików:** Automatyczne dzielenie dziennika na mniejsze pliki (segmenty, np. po 50MB) po przekroczeniu limitu rozmiaru, w celu łatwiejszego usuwania starych danych (retention policy).
- **Subskrybenci z odczytem od offsetu:** Konsumenci mogą subskrybować kolejkę i wskazać, od którego momentu (offsetu) chcą czytać historię (np. czytaj od początku, czytaj od najnowszych, czytaj od wybranego numeru wiadomości).

**Porady implementacyjne i dobre praktyki:**
Do zapisu sekwencyjnego wykorzystaj `FileStream` otwarty w trybie dopisywania. Aby drastycznie zwiększyć wydajność zapisu na procesorach wielordzeniowych, zaimplementuj buforowanie w pamięci RAM (np. zbiór wiadomości jest zbierany w pamięci i zapisywany na dysk za pomocą pojedynczej operacji `WriteAsync` raz na 100ms lub po zebraniu 1000 wiadomości). Pamiętaj o wywołaniu metody `Flush(true)` w celu wymuszenia fizycznego zapisu danych na dysku przed zatwierdzeniem operacji nadawcy.
Wzorzec projektowy: *Commit Log*, *Batcher*, *Flyweight*.
