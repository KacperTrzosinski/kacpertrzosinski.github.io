## 60. Symulator Giełdy w Czasie Rzeczywistym (Real-time Stock Simulator)

**Szczegółowy opis i cele edukacyjne:**
Systemy transakcyjne na giełdach muszą błyskawicznie reagować na fluktuacje cenowe i dystrybuować aktualizacje do tysięcy inwestorów.
Projekt polega na stworzeniu symulatora giełdy działającego w czasie rzeczywistym. Symulacja generuje zmiany cen dla kilkunastu spółek (używając modeli matematycznych typu błądzenie losowe - Random Walk lub Geometryczny Ruch Browna) i dystrybuuje te zmiany za pomocą zdarzeń do modułów klienckich (wykresy konsolowe, systemy automatycznego zakupu).
Cele edukacyjne to praca z licznikami czasu czasu rzeczywistego (`System.Timers.Timer` lub asynchroniczny `PeriodicTimer`), zaawansowane wykorzystanie wzorca Pub-Sub za pomocą delegatów i zdarzeń, oraz rozdzielenie (decoupling) silnika symulacji od logiki prezentacji danych (UI).

**Wymagane funkcje:**
- **Silnik symulacji cen (Volatility Engine):** Wyliczanie nowej ceny akcji w każdym takcie zegara (np. co 500ms) z uwzględnieniem historycznej zmienności spółki i losowych informacji rynkowych (zdarzenia losowe typu "fuzja", "krach").
- **Dystrybucja zdarzeń (Pub-Sub):** Klasa `StockExchange` rozsyłająca zdarzenie `OnPriceChanged` zawierające strukturę danych z nowym kursem akcji.
- **Automatyczne boty inwestycyjne (Auto-Traders):** Moduły reprezentujące boty giełdowe, które subskrybują zdarzenia cenowe i automatycznie podejmują decyzję o kupnie/sprzedaży na podstawie wskaźników (np. średnia krocząca - Simple Moving Average).
- **Dashboard w CLI:** Interfejs konsoli rysujący tabelę aktualnych cen, wolumenu obrotu oraz kierunku zmiany (zielone strzałki w górę / czerwone w dół).

**Porady implementacyjne i dobre praktyki:**
Zdarzenia giełdowe powinny być rozsyłane asynchronicznie, aby wolniejszy odbiorca (np. bot wykonujący skomplikowane analizy) nie blokował silnika symulacji cen. Możesz to zaimplementować wywołując delegat poprzez `Task.Run` lub używając kolejki pośredniczącej (Message Queue). Do bezpiecznej modyfikacji cen akcji przez wątek symulatora przy jednoczesnym odczycie przez wątek UI wykorzystaj typy bezpieczne wątkowo lub blokadę `lock` wokół obiektów akcji. Zaprojektuj boty w taki sposób, aby przyjmowały interfejs `IStockExchange` (Dependency Inversion Principle), co ułatwi ich testowanie za pomocą mocków.
Wzorzec projektowy: *Observer (Obserwator)*, *Publisher-Subscriber*, *Strategy* (dla różnych strategii inwestycyjnych botów).
