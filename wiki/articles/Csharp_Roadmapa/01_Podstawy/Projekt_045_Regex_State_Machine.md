## 45. Silnik Wyrażeń Regularnych i Automatów NFA/DFA (Regex State Machine)

**Szczegółowy opis i cele edukacyjne:**
Wyrażenia regularne pod maską nie są zwykłymi przeszukiwaniami tekstowymi – są one kompilowane do struktur zwanych automatami skończonymi. Zrozumienie teorii kompilatorów i automatów to klucz do tworzenia optymalnego oprogramowania.
Projekt polega na stworzeniu uproszczonego silnika regex, który potrafi parsować wyrażenia regularne (obsługujące podstawowe operatory: alternatywę `|`, domknięcie Kleene'ego `*`, opcjonalność `?`, plus `+` oraz nawiasy grupujące `()`) i przekształcać je w Niedeterminowany Automat Skończony (NFA) przy użyciu algorytmu Thompsona, a następnie dokonywać detekcji dopasowania tekstu.
Cele edukacyjne to praca ze strukturami grafowymi (stany automatu i przejścia), implementacja algorytmu Thompsona, konwersja automatu NFA do deterministycznego DFA (algorytm podzbiorów) oraz optymalizacja przeszukiwania ścieżek w grafie.

**Wymagane funkcje:**
- **Parser wyrażeń regularnych:** Przekształcenie ciągu tekstowego wyrażenia (np. `(a|b)*c`) w wewnętrzną strukturę drzewa wyrażeń.
- **Konstrukcja NFA (Algorytm Thompsona):** Budowa grafu stanów połączonych przejściami znakowymi oraz przejściami pustymi ($\epsilon$-transitions) reprezentującego automat NFA.
- **Symulacja automatu NFA:** Sprawdzanie, czy podany ciąg wejściowy pasuje do automatu poprzez śledzenie zbioru aktywnych stanów jednocześnie.
- **Konwersja do DFA (opcjonalnie):** Algorytm przekształcający NFA do DFA (gdzie dla każdego stanu i znaku wejściowego istnieje dokładnie jedno przejście), co pozwala na dopasowanie tekstu w liniowym czasie $O(N)$ względem długości tekstu.

**Porady implementacyjne i dobre praktyki:**
Zaimplementuj stan automatu jako klasę `State` posiadającą listę przejść `List<Transition>`. Przejście `Transition` powinno zawierać znak wejściowy (lub wartość specjalną dla przejścia puste). Podczas symulacji NFA, po wczytaniu każdego znaku obliczaj tzw. $\epsilon$-closure (domknięcie puste) – zbiór wszystkich stanów, do których można dotrzeć za pomocą wyłącznie pustych przejść. Użycie `HashSet<State>` zapewni, że nie będziesz przetwarzać wielokrotnie tych samych stanów w jednym kroku. Napisz czytelną metodę wizualizującą stany i przejścia automatu w konsoli w celach debugowania.
Wzorzec projektowy: *State (Stan)*, *Interpreter*.
