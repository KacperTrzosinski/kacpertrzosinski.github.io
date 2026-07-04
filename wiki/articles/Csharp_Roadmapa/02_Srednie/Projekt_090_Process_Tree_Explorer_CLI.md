## 90. Narzędzie CLI do Eksploracji Drzewa Procesów (Process Tree Explorer CLI)

**Szczegółowy opis i cele edukacyjne:**
Systemy operacyjne uruchamiają programy w postaci procesów. Każdy proces (poza pierwszym) jest tworzony przez inny proces (proces rodzica - Parent Process), tworząc hierarchiczną strukturę drzewa.
Projekt polega na stworzeniu konsolowej aplikacji, która skanuje aktywne procesy systemowe, buduje ich hierarchiczne drzewo i wizualizuje je w czytelny sposób (podobnie do programu htop lub Process Explorer), monitorując zużycie procesora (CPU) oraz pamięci (RAM) dla poszczególnych gałęzi.
Cele edukacyjne to integracja z diagnostyką systemową w C# (`System.Diagnostics.Process`), wywołania systemowe (P/Invoke) na systemach Windows/Linux w celu pobrania identyfikatorów rodziców procesów (Parent Process ID - PPID, którego brakuje w domyślnej klasie `Process` w .NET Framework/.NET Core), budowanie struktur drzewiastych z cyklami (wykrywanie sierot i procesów zombie) oraz projektowanie dynamicznych interfejsów konsolowych.

**Wymagane funkcje:**
- **Pobieranie PPID za pomocą P/Invoke lub WMI:** Wywołanie niskopoziomowych funkcji systemowych systemu operacyjnego (np. `NtQueryInformationProcess` w systemie Windows lub parsowanie `/proc` w Linuxie) w celu powiązania procesów z ich rodzicami.
- **Konstrukcja drzewa procesów:** Algorytm budujący strukturę drzewiastą z listy procesów, obsługujący procesy bez aktywnych rodziców (umieszczane w korzeniu drzewa).
- **Monitorowanie zasobów w czasie rzeczywistym:** Cykliczny odczyt (np. co 1s) zużycia procesora i pamięci operacyjnej (Working Set) dla wybranego procesu oraz sumowanie zużycia całej gałęzi potomnej (np. proces przeglądarki Chrome i wszystkie jego procesy pomocnicze).
- **Zabijanie procesów z gałęzią (Tree Kill):** Opcja wysłania sygnału zatrzymania procesu (`Kill`) do wybranego węzła, która automatycznie i rekurencyjnie zabija wszystkie procesy potomne, zapobiegając powstawaniu procesów bezdomnych (sierot).

**Porady implementacyjne i dobre praktyki:**
Klasa `System.Diagnostics.Process` w .NET nie udostępnia właściwości `ParentId`. Aby uzyskać tę informację w systemie Windows, zadeklaruj zewnętrzną strukturę i wywołaj funkcję `CreateToolhelp32Snapshot` z biblioteki `kernel32.dll` poprzez mechanizm P/Invoke, lub wykorzystaj zapytania WMI (`System.Management`). Monitorując CPU, pamiętaj, że jednorazowy odczyt czasu procesora (`TotalProcessorTime`) nie wskazuje aktualnego zużycia – musisz dokonać dwóch odczytów w odstępie czasu $dt$ i obliczyć zmianę czasu procesora w stosunku do czasu rzeczywistego, podzieloną przez liczbę rdzeni logicznych CPU.
Wzorzec projektowy: *Composite (Kompozyt)* (reprezentacja drzewa procesów), *Observer*.
