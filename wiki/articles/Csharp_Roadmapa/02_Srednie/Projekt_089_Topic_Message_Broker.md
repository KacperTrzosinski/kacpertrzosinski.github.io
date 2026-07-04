## 89. Silnik Kolejkowy Pub-Sub z Obsługą Masek Tematów (Topic Message Broker)

**Szczegółowy opis i cele edukacyjne:**
Systemy kolejkowania wiadomości (np. RabbitMQ, ActiveMQ, MQTT) rozsyłają wiadomości na podstawie tematów (Topics). Niezwykle ważną funkcją jest możliwość subskrybowania tematów za pomocą masek ze znakami specjalnymi (Wildcards) – na przykład subskrypcja maski `sensors/+/temperature` łapie wiadomości z tematów `sensors/livingroom/temperature` oraz `sensors/kitchen/temperature`, a maska `sensors/#` łapie wszystko, co zaczyna się od `sensors/`.
Projekt polega na stworzeniu w pamięci silnika brokera wiadomości pub-sub wspierającego maskowanie tematów.
Cele edukacyjne to zaawansowana praca z algorytmami wyszukiwania napisów (Trie/Prefix Tree), bezpieczna współbieżność w wielowątkowej dystrybucji wiadomości oraz dopasowywanie wzorców tekstowych.

**Wymagane funkcje:**
- **Silnik routowania wiadomości:** Klasa `MessageBroker` z metodami `Publish(string topic, object message)` oraz `Subscribe(string topicFilter, Action<object> handler)`.
- **Obsługa Wildcardów (MQTT style):** Wsparcie dla znaków specjalnych: `+` (zastępuje dokładnie jeden poziom hierarchii tematu) oraz `#` (zastępuje dowolną liczbę poziomów na końcu hierarchii).
- **Struktura drzewa przedrostkowego (Topic Trie):** Zaimplementowanie wyszukiwania filtrów subskrypcji za pomocą drzewa Trie w celu uniknięcia powolnego sprawdzania każdego filtra wyrażeniem regularnym przy publikacji wiadomości.
- **Bezpieczeństwo współbieżne:** Zapewnienie, że dynamiczne dodawanie/usuwanie subskrybentów oraz jednoczesne publikowanie wiadomości na wielu wątkach nie powoduje błędów spójności kolekcji.

**Porady implementacyjne i dobre praktyki:**
Naiwne przeszukiwanie wszystkich zarejestrowanych filtrów subskrypcji za pomocą Regex ma złożoność $O(N)$ i drastycznie zwalnia wraz ze wzrostem liczby subskrypcji. Użycie dedykowanego drzewa Trie, gdzie każdy poziom drzewa reprezentuje pojedynczy poziom tematu (np. rozbity po znaku `/`), pozwala na dopasowanie filtrów w czasie zależnym wyłącznie od długości publikowanego tematu (złożoność $O(L)$, gdzie $L$ to liczba segmentów tematu). Kiedy wiadomość trafia na temat `a/b/c`, silnik przechodzi przez drzewo i wywołuje subskrybentów zarejestrowanych na: `a/b/c`, `a/+/c`, `a/b/+`, `a/#`, `#` itd.
Wzorzec projektowy: *Trie (Drzewo przedrostkowe)*, *Observer (Obserwator)*, *Mediator*.
