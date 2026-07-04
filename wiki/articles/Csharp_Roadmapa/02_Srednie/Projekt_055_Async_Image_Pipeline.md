## 55. Potok Przetwarzania Obrazów w Tle (Async Image Pipeline)

**Szczegółowy opis i cele edukacyjne:**
W aplikacjach przetwarzających duże wolumeny danych (np. serwisy społecznościowe generujące miniatury zdjęć, systemy OCR) przetwarzanie pojedynczo w głównym wątku powoduje zamrożenie aplikacji. Rozwiązaniem jest potok przetwarzania (Processing Pipeline) oparty na architekturze producent-konsument.
Projekt polega na stworzeniu asynchronicznego potoku przetwarzania obrazów (np. nakładanie filtrów czarno-białych, skalowanie, dodawanie znaków wodnych). Obrazy są wrzucane do kolejki przez wątki producenta (np. skaner folderu wejściowego), a wątki konsumenta pobierają je i przetwarzają w tle.
Cele edukacyjne to zaawansowana praca z asynchronicznymi kolejkami blokującymi (`BlockingCollection<T>` lub `System.Threading.Channels`), przetwarzanie potokowe (Pipeline processing), synchronizacja wątków roboczych oraz wdrażanie mechanizmów anulowania długich zadań (`CancellationToken`).

**Wymagane funkcje:**
- **Kanał danych (Data Channel):** Użycie klasy `Channel<T>` (dostępnej w bibliotece systemowej) do przesyłania zadań przetwarzania (ścieżka pliku, operacja do wykonania) między producentami a konsumentami.
- **Równolegli konsumenci (Workers):** Pula asynchronicznych procesów roboczych działających w tle, pobierających zadania z kanału i wykonujących przetwarzanie graficzne (np. przy użyciu biblioteki `SixLabors.ImageSharp`).
- **Wieloetapowy potok (Multi-stage Pipeline):** Podział procesu na etapy: wczytanie -> modyfikacja -> kompresja -> zapis na dysk, gdzie każdy etap działa jako osobny zestaw workerów komunikujący się przez oddzielne kanały.
- **Zarządzanie zasobami i anulowanie:** Możliwość bezpiecznego zatrzymania całego potoku w dowolnym momencie (Graceful Shutdown) bez uszkadzania aktualnie zapisywanych plików.

**Porady implementacyjne i dobre praktyki:**
Zamiast starszej klasy `BlockingCollection<T>` zaleca się stosowanie nowoczesnego i wysoce wydajnego typu `System.Threading.Channels.Channel<T>`. Użycie `Channel.CreateBounded<T>(capacity)` zapobiega niekontrolowanemu wzrostowi zużycia pamięci w sytuacji, gdy producenci generują zadania szybciej, niż konsumenci są w stanie je przetworzyć (zjawisko Backpressure). Pamiętaj o przekazywaniu `CancellationToken` do wszystkich asynchronicznych operacji odczytu i zapisu strumieni. Do manipulacji na pikselach obrazu wykorzystaj bezpłatną bibliotekę NuGet `SixLabors.ImageSharp`.
Wzorzec projektowy: *Producer-Consumer (Producent-Konsument)*, *Pipes and Filters (Rury i filtry)*.
