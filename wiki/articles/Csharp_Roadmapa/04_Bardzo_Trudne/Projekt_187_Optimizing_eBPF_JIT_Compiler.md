## 187. Kompilator JIT eBPF z Optymalizacjami IL i Rejestrów (Optimizing eBPF JIT Compiler)

**Szczegółowy opis i cele edukacyjne:**
Maszyny wirtualne eBPF w celach wydajnościowych powinny generować kod JIT, który jest jak najbliższy natywnym instrukcjom procesora. Podstawowy kompilator JIT mapujący rejestry eBPF ($R0-R10$) bezpośrednio na pola w tablicy pamięci RAM lub nawet na proste zmienne lokalne w IL generuje duży narzut. Aby zbliżyć się do wydajności natywnej, kompilator JIT musi przejść fazę optymalizacji, która analizuje przepływ danych (Data Flow Analysis) i optymalizuje alokację rejestrów w pamięci fizycznej procesora, a także eliminuje martwy kod (Dead Code Elimination).
Projekt polega na zaimplementowaniu w C# optymalizującego kompilatora JIT eBPF.
Cele edukacyjne to zaawansowana analiza statyczna kodu bajtowego (Control Flow Graph - CFG), alokacja rejestrów (Register Allocation / Liveness Analysis), oraz eliminacja zbędnych operacji zapisu/odczytu w MSIL.

**Wymagane funkcje:**
- **Budowanie Grafu Przepływu Sterowania (CFG):** Parser buduje graf bloków podstawowych (Basic Blocks) programu eBPF, identyfikując wszystkie skoki, pętle i punkty wejścia/wyjścia.
- **Analiza żywotności rejestrów (Liveness Analysis):** Algorytm wyznacza dla każdej instrukcji, które rejestry eBPF są "żywe" (będą używane w przyszłości). Pozwala to na przypisanie nieużywanych rejestrów do tych samych fizycznych zmiennych lokalnych w IL, oszczędzając pamięć.
- **Dead Code Elimination (DCE):** Wykrywanie i usuwanie instrukcji eBPF, które modyfikują rejestry, których wartości nie są później odczytywane, oraz usuwanie nieosiągalnych bloków kodu (np. po bezwarunkowym skoku `goto`).
- **Kompilacja optymalnego kodu IL:** Emisja zoptymalizowanych instrukcji MSIL z dynamicznym mapowaniem rejestrów eBPF bezpośrednio na zmienne lokalne .NET (`ILGenerator.DeclareLocal`), co pozwala kompilatorowi JIT platformy .NET (.NET RyuJIT) na optymalne przypisanie ich bezpośrednio do fizycznych rejestrów procesora (EAX, EBX, etc.).

**Porady implementacyjne i dobre praktyki:**
Do budowy grafu CFG stwórz strukturę reprezentującą pojedynczy blok instrukcji, który kończy się instrukcją skoku (`jmp`, `jeq`, `exit`, etc.). Analizę żywotności (Liveness) zaimplementuj przechodząc graf CFG wstecz (Backward Analysis) przy użyciu zbiorów `GEN` (rejestry odczytywane w bloku) i `KILL` (rejestry zapisywane w bloku). Mapowanie rejestrów eBPF bezpośrednio na zmienne lokalne IL (`LocalBuilder`) zamiast na tablicę w klasie ma kluczowe znaczenie – dzięki temu RyuJIT może całkowicie zoptymalizować dostęp do nich i umieścić je w fizycznych rejestrach maszyny, eliminując operacje zapisu i odczytu z pamięci RAM.
Wzorzec projektowy: *Control Flow Graph Builder*, *Register Allocator*, *Compiler Optimization Pass*.
