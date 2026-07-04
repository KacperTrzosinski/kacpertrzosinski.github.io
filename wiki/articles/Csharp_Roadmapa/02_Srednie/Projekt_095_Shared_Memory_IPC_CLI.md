## 95. System Komunikacji IPC przez Pamięć Współdzieloną (Shared Memory IPC CLI)

**Szczegółowy opis i cele edukacyjne:**
Komunikacja międzyprocesowa (IPC - Inter-Process Communication) pozwala dwóm niezależnym programom działającym w tym samym systemie operacyjnym na szybką wymianę danych. Najszybszą metodą IPC jest użycie Pamięci Współdzielonej (Shared Memory), w której oba procesy mapują ten sam obszar fizycznej pamięci RAM do swojej przestrzeni adresowej, unikając narzutu związanego z siecią czy zapisem na dysk.
Projekt polega na stworzeniu dwóch niezależnych aplikacji konsolowych (Proces Nadawcy i Proces Odbiorcy), które komunikują się za pomocą plików mapowanych w pamięci (Memory-Mapped Files).
Cele edukacyjne to praca z pamięcią współdzieloną (`MemoryMappedFile`), synchronizacja procesów systemowych przy użyciu muteksów (`Mutex`) i semaforów (`Semaphore`), oraz niskopoziomowa organizacja układu bajtów w pamięci niezarządzanej.

**Wymagane funkcje:**
- **Inicjalizacja segmentu pamięci (Shared Buffer):** Tworzenie nazwanego segmentu pamięci współdzielonej o stałym rozmiarze (np. 1MB) przy użyciu `MemoryMappedFile.CreateOrOpen`.
- **System synchronizacji (IPC Handshake):** Użycie nazwanych muteksów systemowych (`Mutex`) w celu uniemożliwienia jednoczesnego zapisu i odczytu tego samego segmentu pamięci przez oba procesy (ochrona sekcji krytycznej procesów).
- **Protokół Ring Buffer w RAM:** Zaimplementowanie struktury kolejki kołowej (Circular Buffer) bezpośrednio w surowych bajtach pamięci współdzielonej (pierwsze bajty to wskaźniki zapisu/odczytu, po których następują bufory danych).
- **Asynchroniczne powiadomienia (Signals):** Wykorzystanie systemowych semaforów lub zdarzeń (`EventWaitHandle`) do natychmiastowego wybudzania procesu odbiorcy w momencie, gdy nadawca zapisze nowe dane w pamięci (brak aktywnego oczekiwania).

**Porady implementacyjne i dobre praktyki:**
Do tworzenia współdzielonej pamięci wykorzystaj klasę `System.IO.MemoryMappedFiles.MemoryMappedFile`. Nazwane obiekty synchronizacji (Mutex, Semaphore) oznacz unikalną nazwą systemową zaczynającą się np. od `Global\MyIPCMutex`, co pozwoli na ich widoczność między różnymi procesami użytkowników. Aby odczytać lub zapisać dane w pamięci współdzielonej, stwórz widok `MemoryMappedViewAccessor` lub pobierz wskaźnik do pamięci niezarządzanej za pomocą `SafeMemoryMappedViewHandle.AcquirePointer` i operuj na surowych bajtach przy użyciu kodu `unsafe` i wskaźników, co da najwyższą możliwą wydajność.
Wzorzec projektowy: *Ring Buffer*, *IPC Channel*.
