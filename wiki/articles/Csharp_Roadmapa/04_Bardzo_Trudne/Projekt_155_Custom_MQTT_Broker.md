## 155. Silnik Kolejek Pub-Sub na Bazie Protokołu MQTT (Custom MQTT Broker)

**Szczegółowy opis i cele edukacyjne:**
Message Queuing Telemetry Transport (MQTT) to lekki, binarny protokół transmisji danych przeznaczony dla urządzeń o ograniczonej mocy obliczeniowej oraz sieci o niskiej przepustowości (np. IoT, smart home). Komunikacja opiera się na wzorcu Publish/Subscribe i przesyłana jest przez protokół TCP.
Projekt polega na zaimplementowaniu w C# od zera asynchronicznego brokera wiadomości obsługującego binarną komunikację sieciową zgodną ze specyfikacją MQTT (np. wersja 3.1.1 lub 5.0).
Cele edukacyjne to niskopoziomowe parsowanie binarnych nagłówków MQTT, obsługa trzech poziomów jakości usług (QoS 0, QoS 1, QoS 2) z potwierdzeniami (PUBACK, PUBREC, PUBREL, PUBCOMP), utrzymywanie aktywnych sesji klientów z podtrzymywaniem połączeń (Keep-Alive / PINGREQ / PINGRESP), oraz implementacja hierarchicznych filtrów tematów z maskami (np. `sensors/+/temperature` lub `sensors/#`).

**Wymagane funkcje:**
- **Parser binarnych pakietów MQTT:** Odczytywanie i kodowanie struktury pakietów: `CONNECT` (nawiązanie połączenia, walidacja hasła i identyfikatora klienta), `SUBSCRIBE` (subskrypcja tematów), `PUBLISH` (wysłanie wiadomości) oraz `DISCONNECT`.
- **Dopasowywanie tematów (Topic Matching Engine):** System rozsyłania wiadomości do subskrybentów obsługujący wielopoziomowe maski typu wildcard:
  - `+` (zastępuje dokładnie jeden poziom, np. `a/+/c` pasuje do `a/b/c`).
  - `#` (zastępuje wszystkie podrzędne poziomy, np. `a/#` pasuje do `a/b/c/d`).
- **Obsługa poziomów QoS (Quality of Service):**
  - *QoS 0*: Wyślij i zapomnij (At most once).
  - *QoS 1*: Dostarczenie z potwierdzeniem (At least once) przy użyciu pakietu `PUBACK`.
  - *QoS 2*: Gwarantowane jednokrotne dostarczenie (Exactly once) przy użyciu dwufazowego uścisku dłoni (`PUBREC` -> `PUBREL` -> `PUBCOMP`).
- **Zarządzanie sesją i wiadomościami zatrzymanymi (Retained Messages):** Zapamiętywanie ostatniej wiadomości wysłanej na dany temat z flagą Retain i automatyczne przesyłanie jej nowym subskrybentom zaraz po podłączeniu.

**Porady implementacyjne i dobre praktyki:**
Nagłówek pakietu MQTT zawiera bajt typu pakietu oraz zakodowane pole określające długość pozostałą (Remaining Length). Długość ta zapisywana jest za pomocą zmiennej liczby bajtów (od 1 do 4), gdzie najbardziej znaczący bit każdego bajtu informuje, czy następuje kolejny bajt długości. Do parsowania tych pól napisz dedykowaną, asynchroniczną pętlę odczytu bajtów z gniazda TCP. Wykorzystuj kolekcje wątkowo bezpieczne i w pełni asynchroniczne strumienie do zarządzania połączeniami tysięcy urządzeń IoT.
Wzorzec projektowy: *Observer (Obserwator)*, *Exactly-Once Delivery Pattern*, *Trie Tree* (do optymalnego dopasowywania tematów).
