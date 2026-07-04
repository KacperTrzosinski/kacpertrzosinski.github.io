## 84. Symulator Rozproszonej Sieci P2P typu Kademlia (Kademlia DHT Simulator)

**Szczegółowy opis i cele edukacyjne:**
Kademlia to zdecentralizowana rozproszona tablica mieszająca (DHT - Distributed Hash Table) stosowana w sieciach P2P (takich jak BitTorrent, IPFS, Ethereum) do wyszukiwania zasobów w sposób odporny na awarie węzłów, bez centralnego koordynatora.
Projekt polega na stworzeniu w pamięci symulatora sieci Kademlia składającego się z wielu wirtualnych węzłów komunikujących się asynchronicznie.
Cele edukacyjne to implementacja metryki odległości XOR (gdzie odległość między dwoma identyfikatorami węzłów jest obliczana jako wynik logicznej operacji XOR na ich kluczach), zarządzenie tabelą routingu opartą na kubełkach o stałym rozmiarze (k-buckets) oraz wdrożenie algorytmu wyszukiwania węzłów (Node Lookup) i wartości (Value Lookup) w czasie logarytmicznym $O(\log N)$ przy użyciu równoległych zapytań.

**Wymagane funkcje:**
- **Model węzła Kademlia:** Węzły posiadające unikalny 160-bitowy identyfikator (`BigInteger` lub tablica bajtów) oraz własną tabelę routingu podzieloną na kubełki (k-buckets) przechowujące informacje o znanych sąsiadach.
- **Metryka odległości XOR:** Algorytm obliczający odległość grawitacyjną/logiczną między kluczami za pomocą operacji bitowej XOR na bajtach identyfikatorów.
- **Równoległy algorytm lookup (Node Lookup):** Asynchroniczny proces odpytywania najbliższych znanych węzłów o wskazany klucz z dynamicznym uaktualnianiem tabel routingu (zarządzanie mechanizmem LRU w kubełkach).
- **Publikowanie i wyszukiwanie danych (Store & Find Value):** Zapisywanie i odtwarzanie par klucz-wartość na $K$ najbliższych węzłach sieci rozproszonej.

**Porady implementacyjne i dobre praktyki:**
Zaimplementuj klucze/identyfikatory węzłów jako 160-bitowe liczby za pomocą struktury `System.Numerics.BigInteger` (co ułatwi operacje bitowe XOR i porównania). Tabela routingu węzła składa się ze 160 kubełków `List<NodeInfo>`. Kubełek o indeksie $i$ przechowuje węzły, których odległość XOR mieści się w przedziale $[2^i, 2^{i+1}-1]$. Każdy kubełek ma stały maksymalny rozmiar $K$ (np. $K=20$). Gdy nowy węzeł ma zostać dodany do pełnego kubełka, system stosuje politykę LRU: odpytuje najdawniej widziany węzeł w kubełku i usuwa go, jeśli nie odpowiada, lub przesuwa na początek listy, ignorując nowy węzeł, jeśli stary jest aktywny.
Wzorzec projektowy: *Distributed Hash Table*, *Strategy*, *Command*.
