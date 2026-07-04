## 100. Sieciowy Silnik Gry w Czasie Rzeczywistym opartej o UDP (UDP Network Game Engine)

**Szczegółowy opis i cele edukacyjne:**
Gry sieciowe czasu rzeczywistego (np. strzelanki wieloosobowe, gry akcji) wymagają minimalnych opóźnień (latencji). Protokół TCP jest zbyt wolny ze względu na narzut mechanizmu retransmisji utraconych pakietów (Head-of-Line Blocking). Zamiast tego stosuje się protokół UDP z własnym systemem kontroli przepustowości oraz predykcji ruchu.
Projekt polega na stworzeniu szkieletu sieciowego silnika gry (serwer i klient), komunikującego się przez gniazda UDP.
Głównym celem edukacyjnym na zakończenie etapu "Średnie" jest opanowanie technik synchronizacji czasu w sieci, implementacja algorytmu predykcji ruchu po stronie klienta (Client-Side Prediction) w celu eliminacji wpływu opóźnień sieciowych na płynność gry, oraz wdrażanie interpolacji stanów (State Interpolation) do wygładzania ruchu przeciwników przy gubieniu pakietów sieciowych (Packet Loss).

**Wymagane funkcje:**
- **Asynchroniczny serwer i klient UDP:** Komunikacja za pomocą gniazd UDP, przesyłanie informacji o pozycji graczy w postaci małych pakietów binarnych (Network Ticks, np. 20-60 razy na sekundę).
- **Zapewnienie niezawodności wybiórczej:** Implementacja na bazie UDP własnego, lekkiego protokołu potwierdzania odbioru pakietów krytycznych (np. strzał, śmierć, zmiana mapy) za pomocą numerów sekwencyjnych i masek bitowych ACK.
- **Predykcja ruchu po stronie klienta (Client-Side Prediction):** Klient natychmiast przesuwa postać gracza po naciśnięciu klawisza, nie czekając na odpowiedź z serwera, a po nadejściu pakietu z serwera (State Update) koryguje ewentualne różnice pozycji (Reconciliation).
- **Interpolacja i ekstrapolacja (Dead Reckoning):** Klient płynnie przesuwa innych graczy na ekranie interpolując ich pozycje między dwoma ostatnio otrzymanymi stanami z serwera, co zapobiega szarpaniu obrazu.

**Porady implementacyjne i dobre praktyki:**
Zaimplementuj pętlę sieciową serwera z sztywnym limitem klatek (Tick Rate), np. co 33ms (30 ticks/s). Pakiety sieciowe powinny mieć postać struktur o stałym układzie bajtów w celu ułatwienia parsowania. Do obliczania różnic czasu i interpolacji używaj liczby klatek sieciowych (Tick Number) zamiast czasu rzeczywistego w milisekundach, ponieważ zegary komputerów w sieci mogą się nieznacznie spieszyć lub spóźniać. Zabezpiecz serwer przed atakami typu spoofing sprawdzając tokeny uwierzytelniające w nagłówku każdego pakietu UDP.
Wzorzec projektowy: *State Synchronization*, *Snapshot Interpolation*, *Command*.
