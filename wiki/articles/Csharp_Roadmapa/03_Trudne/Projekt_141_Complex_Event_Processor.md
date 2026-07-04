## 141. Silnik Wykrywania Zdarzeń i Anomalii w Strumieniach (Complex Event Processor)

**Szczegółowy opis i cele edukacyjne:**
Przetwarzanie strumieniowe w czasie rzeczywistym wymaga analizy tysięcy zdarzeń (np. logi serwera, transakcje finansowe, sensory IoT) w locie, w celu wykrycia złożonych korelacji czasowych i anomalii (np. system wykrywania oszustw wykrywa "trzy nieudane próby logowania z różnych adresów IP, po których w ciągu 5 sekund następuje udana próba wypłaty środków"). Systemy takie nazywa się CEP (Complex Event Processing).
Projekt polega na stworzeniu asynchronicznego silnika CEP w pamięci.
Cele edukacyjne to modelowanie okien czasowych (Sliding Windows oraz Tumbling Windows), leksykalna analiza i wykonywanie deklaratywnych reguł czasowych (np. `pattern [Every Log(Status = Fail) -> Success within 5s]`), oraz bezpieczne zarządzanie wątkami w strumieniowym analizowaniu danych.

**Wymagane funkcje:**
- **Silnik strumieniowy (Event Stream):** Klasa przyjmująca asynchroniczne zdarzenia na wielu wątkach i przekazująca je do zarejestrowanych filtrów/reguł.
- **Obsługa okien czasowych (Temporal Windows):** Implementacja okien przesuwnych (Sliding Windows, np. "średnia temperatura z ostatnich 10 sekund") oraz okien skokowych (Tumbling Windows, np. "średnia temperatura obliczana co 10 sekund dla nieprzecinających się bloków czasu").
- **Parser reguł czasowych (CEP Rules):** Interpreter reguł definiujących wzorce powiązań między zdarzeniami (np. zdarzenie A po którym w ciągu $T$ sekund następuje zdarzenie B), parsujący tekstową definicję reguły do drzewa wykonawczego.
- **System alertów i detektor anomalii:** Silnik automatycznie generuje powiadomienia (Alerts), gdy napływający strumień danych spełni warunki zdefiniowanego wzorca anomalii.

**Porady implementacyjne i dobre praktyki:**
Zaimplementuj silnik w oparciu o strumienie reaktywne w .NET, np. bibliotekę `System.Reactive` (Rx.NET), która ułatwia operacje czasowe, takie jak windowing (`Window`), buffering (`Buffer`), czy throttling (`Throttle`). Do przechowywania historii zdarzeń wewnątrz okna czasowego o stałej długości wykorzystaj strukturę kolejki dwukierunkowej posortowanej po znacznikach czasu (`DateTimeOffset`). Zadbaj o automatyczne usuwanie (Eviction) z pamięci zdarzeń, które wyszły poza ramy czasowe zdefiniowane w oknach, zapobiegając wyciekom pamięci RAM.
Wzorzec projektowy: *Observer (Obserwator)*, *Interpreter*, *State (Stan)*.
