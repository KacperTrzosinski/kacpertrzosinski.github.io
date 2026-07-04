## 130. Silnik Kolejek Pub-Sub z Podziałem na Partycje (Partitioned Message Broker)

**Szczegółowy opis i cele edukacyjne:**
W klasycznych systemach kolejkowych pojedynczy temat (Topic) obsługuje wiadomości sekwencyjnie. Przy ogromnym obciążeniu przetwarzanie wiadomości przez jednego konsumenta tworzy wąskie gardło, a rozdzielenie pracy na wielu konsumentów bez utraty kolejności wiadomości (Message Ordering) jest trudne. Rozwiązaniem znanym z Apache Kafka jest podział tematów na partycje (Partitions). Każda partycja to oddzielny, uporządkowany dziennik wiadomości.
Projekt polega na stworzeniu w pamięci brokera wiadomości pub-sub, w którym tematy są podzielone na partycje, z dystrybucją opartą o haszowanie kluczy.
Cele edukacyjne to zaawansowana architektura kolejek, implementacja algorytmów partycjonowania (Round-robin oraz Hash-based partitioning), wdrożenie mechanizmów grup konsumenckich (Consumer Groups) do równoległego przetwarzania partycji, oraz zachowanie kolejności wiadomości w obrębie jednej partycji.

**Wymagane funkcje:**
- **Partycjonowane tematy:** Klasa `Topic` składająca się z $N$ niezależnych partycji (fizycznych kolejek/dzienników).
- **Ruter wiadomości (Partitioner):** Algorytm określający, do której partycji trafi wiadomość. Jeśli podano klucz (np. `CustomerId`), ruter oblicza hasz klucza (`Hash(Key) % N`) gwarantując, że wszystkie wiadomości dotyczące jednego klienta trafią do tej samej partycji (co zapewnia lokalną kolejność przetwarzania). Jeśli brak klucza, ruter działa w trybie karuzelowym (Round-Robin).
- **Grupy konsumentów (Consumer Groups):** Wdrożenie mechanizmu pozwalającego wielu konsumentom z jednej grupy na podział pracy – każdy konsument w grupie otrzymuje na wyłączność przypisane partycje (np. przy 4 partycjach i 2 konsumentach w grupie, każdy konsument obsługuje po 2 partycje).
- **Zapis postępu (Offset Commit):** Konsumenci raportują swój postęp (przetworzone offsety) niezależnie dla każdej partycji, co pozwala na bezpieczne wznawianie pracy po restarcie bez duplikacji wiadomości.

**Porady implementacyjne i dobre praktyki:**
Zaimplementuj partycje jako niezależne, trwale chronione kolekcje wątkowo bezpieczne (`ConcurrentQueue<Message>`). Podczas dystrybucji partycji w grupie konsumentów napisz algorytm rebalansowania (Rebalance Algorithm) – po dołączeniu nowego konsumenta do grupy lub rozłączeniu starego, partycje są dynamicznie rozdzielane na nowo. Do obliczania haszy klucza wykorzystaj szybki algorytm niekryptograficzny, np. MurmurHash3 lub wbudowany `string.GetHashCode()`.
Wzorzec projektowy: *Kafka-like Partitioning*, *Iterator*, *Strategy*.
