## 140. Silnik Kolejek Pub-Sub na Bazie Protokołu AMQP (Custom AMQP Broker)

**Szczegółowy opis i cele edukacyjne:**
Advanced Message Queuing Protocol (AMQP) to binarny protokół warstwy aplikacji służący do przesyłania wiadomości w systemach rozproszonych. Stanowi fundament działania systemów takich jak RabbitMQ. Protokół ten standaryzuje mechanizmy routingu za pomocą central wymiany (Exchanges), powiązań (Bindings) oraz kolejek (Queues).
Projekt polega na zaimplementowaniu w C# uproszczonego brokera wiadomości obsługującego binarną komunikację sieciową zgodną z protokołem AMQP (w wersji 0-9-1 lub 1.0).
Cele edukacyjne to niskopoziomowe parsowanie binarnych ramek protokołu AMQP (Frame Header, Payload, Frame End), zarządzanie stanem kanałów (Channels) na jednym połączeniu TCP (Multiplexing), oraz implementacja logiki routingu wiadomości na podstawie kluczy (Routing Keys).

**Wymagane funkcje:**
- **Parser binarnych ramek AMQP:** Dekodowanie nagłówków połączenia, ramek typu `Method` (komendy protokołu), `Content Header` (metadane wiadomości) oraz `Content Body` (surowe bajty wiadomości).
- **Obsługa silnika Exchange (Routing Engine):** Zaimplementowanie trzech typów central wymiany (Exchanges):
  - `Direct Exchange`: Przesyła wiadomość do kolejki, której nazwa odpowiada dokładnie kluczowi routingu (Routing Key).
  - `Fanout Exchange`: Kopiuje i przesyła wiadomość do wszystkich powiązanych kolejek bez badania klucza.
  - `Topic Exchange`: Rozsyła wiadomości na podstawie masek tekstowych (np. `sport.*` lub `#.error`).
- **Multipleksowanie połączeń (Channels):** Obsługa otwierania i zamykania wielu logicznych kanałów wewnątrz jednego fizycznego połączenia TCP, co zapobiega potrzebie tworzenia wielu kosztownych gniazd sieciowych.
- **Bezpieczny dispatcher (Queue Dispatcher):** Zapewnienie trwałego dostarczania wiadomości do podłączonych konsumentów (z obsługą potwierdzeń dostarczenia - Basic.Ack).

**Porady implementacyjne i dobre praktyki:**
Protokół AMQP przesyła liczby w formacie Big-Endian. Do parsowania binarnego nagłówka ramki (8 bajtów: type, channel, size, payload...) użyj struktur `Span<byte>` i klasy `BinaryPrimitives`. Logika routingu w Topic Exchange opiera się o drzewo przedrostkowe lub precyzyjnie skompilowane wyrażenia regularne. Pamiętaj, aby silnik brokera działał w pełni asynchronicznie, a dostęp do poszczególnych kolejek w pamięci był chroniony przed wyścigami wątków za pomocą współbieżnych kolekcji (`ConcurrentQueue` / `Channel`).
Wzorzec projektowy: *Mediator*, *Chain of Responsibility*, *Topic-Based Routing*.
