## 93. Asynchroniczny Serwer i Klient NTP od Zera (Async Custom NTP Server)

**Szczegółowy opis i cele edukacyjne:**
Network Time Protocol (NTP) to protokół sieciowy służący do precyzyjnej synchronizacji zegarów komputerowych w sieciach pakietowych o zmiennej latencji. Precyzyjny czas jest kluczowy dla systemów rozproszonych, baz danych, logowania zdarzeń oraz transakcji giełdowych.
Projekt polega na zaimplementowaniu asynchronicznego serwera NTP (nasłuchującego na porcie UDP 123) oraz klienta NTP. Klient wysyła pakiet zapytania, serwer nanosi znaczniki czasu odebrania i odesłania, a klient na podstawie 4 znaczników czasu wyznacza opóźnienie sieciowe (Round-Trip Delay) oraz przesunięcie zegara lokalnego (Clock Offset) względem serwera z dokładnością do ułamków milisekund.
Cele edukacyjne to niskopoziomowa manipulacja czasem systemowym, obliczenia matematyczne na ułamkach sekund reprezentowanych w formacie binarnym NTP, oraz asynchroniczna komunikacja UDP.

**Wymagane funkcje:**
- **Parser pakietów binarnych NTP:** Przetwarzanie 48-bajtowego nagłówka NTP (mode, leap indicator, version, stratum, poll, precision, root delay, reference identifier, timestamps).
- **Format czasu NTP (NTP Timestamp):** Konwersja czasu .NET (`DateTime`/`DateTimeOffset`) na 64-bitowy format czasu NTP (32 bity określające sekundy od 1 stycznia 1900 roku, oraz 32 bity reprezentujące ułamkową część sekundy) i odwrotnie.
- **Wyliczanie opóźnienia i przesunięcia (NTP Algorithms):** Zaimplementowanie wzorów matematycznych NTP do wyznaczania parametrów $d$ (round-trip delay) oraz $t$ (local clock offset) na podstawie 4 timestampów: $T_1$ (wysłanie zapytania), $T_2$ (odebranie przez serwer), $T_3$ (odesłanie przez serwer), $T_4$ (odebranie odpowiedzi).
- **Zintegrowany serwer z Forwardingiem:** Serwer nasłuchuje na UDP 123, podaje czas lokalny lub odpytuje nadrzędny serwer czasu (np. `pool.ntp.org`) w przypadku braku lokalnego źródła synchronizacji.

**Porady implementacyjne i dobre praktyki:**
Czas w standardzie NTP płynie od 1 stycznia 1900 roku, podczas gdy w .NET czas systemowy (`DateTime`) jest mierzony w "ticks" od 1 stycznia 1 roku (lub od epoki UNIX 1970). Musisz poprawnie uwzględnić te przesunięcia (Epoch offset) przy konwersji, np. różnica między rokiem 1900 a 1970 wynosi dokładnie `2208988800` sekund. Do wyliczenia części ułamkowej sekundy (32 bity) pomnóż część ułamkową sekundy przez $2^{32}$ (czyli `4294967296`) i zaokrąglij do liczby całkowitej.
Wzorzec projektowy: *Adapter*, *Diagnostic Engine*.
