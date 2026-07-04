## 27. Odtwarzacz Playlist Muzycznych na Liście Dwukierunkowej (Console Music Playlist)

**Szczegółowy opis i cele edukacyjne:**
Odtwarzacze muzyczne przechowują listy utworów i umożliwiają przechodzenie do następnego utworu, powrót do poprzedniego, zapętlanie playlisty czy losowe odtwarzanie. Choć w C# istnieje gotowa klasa `LinkedList<T>`, stworzenie własnej implementacji listy dwukierunkowej (Doubly Linked List) daje głębokie zrozumienie niskopoziomowego zarządzania wskaźnikami referencyjnymi.
Projekt polega na stworzeniu konsolowego odtwarzacza (symulatora logiki odtwarzania). Cel edukacyjny to zaprojektowanie własnej struktury danych listy dwukierunkowej z węzłami (`PlaylistNode`), zarządzanie referencjami `Next` i `Previous`, obsługa cyklicznych list (circular list) do zapętlania oraz efektywne algorytmy tasowania (np. algorytm tasowania Fishera-Yatesa).

**Wymagane funkcje:**
- **Własna lista dwukierunkowa:** Implementacja struktury listy przechowującej obiekty typu `Song` (tytuł, wykonawca, czas trwania) z metodami dodawania, usuwania i wstawiania utworów w dowolnym miejscu.
- **Sterowanie odtwarzaniem (Playback Control):** Przechodzenie do przodu (`Next()`), wstecz (`Previous()`), pauza, stop oraz dynamiczne wyświetlanie aktualnie odtwarzanego utworu na konsoli.
- **Zapętlanie (Cykliczność):** Opcja spięcia końca listy z jej początkiem (wskaźnik `Next` ostatniego węzła wskazuje na pierwszy węzeł, a `Previous` pierwszego na ostatni).
- **Tasowanie playlisty (Shuffle):** Zaimplementowanie bezalokacyjnego algorytmu tasowania Fishera-Yatesa na tablicy referencji w celu losowej kolejności odtwarzania bez niszczenia oryginalnej kolejności playlisty.

**Porady implementacyjne i dobre praktyki:**
Unikaj wycieków pamięci i zapętleń referencji przy usuwaniu węzłów – upewnij się, że poprawnie przepisujesz wskaźniki sąsiadów usuwanego elementu. Zaimplementuj interfejs `IEnumerable<Song>` dla swojej klasy playlisty, co pozwoli na odpytywanie jej za pomocą pętli `foreach` oraz zapytań LINQ. Wszelkie operacje modyfikacji playlisty (np. usuwanie aktualnie odtwarzanego utworu) powinny automatycznie i bezpiecznie przełączać stan odtwarzacza na kolejny utwór lub zatrzymywać odtwarzanie, jeśli lista stała się pusta (defensive programming).
Wzorzec projektowy: *Iterator* (dla przechodzenia po playliście), *State (Stan)* (dla reprezentowania stanów Playbacku).
