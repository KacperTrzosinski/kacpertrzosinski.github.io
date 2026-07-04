## 70. Kompilator i Maszyna Wirtualna Kodu Bajtowego (Bytecode VM Engine)

**Szczegółowy opis i cele edukacyjne:**
Wielkie platformy uruchomieniowe (np. CLR w .NET, JVM w Javie) kompilują kod źródłowy do pośredniego kodu bajtowego (Bytecode), który jest następnie wykonywany przez dedykowane maszyny wirtualne. Zrozumienie zasad interpretacji instrukcji kodu bajtowego to wyższy poziom inżynierii oprogramowania.
Projekt polega na stworzeniu kompilatora prostego języka skryptowego (operującego na zmiennych i operacjach matematycznych) do kodu bajtowego, oraz wirtualnej maszyny (VM) opartej na stosie (Stack-based VM), która wykonuje te instrukcje.
Cele edukacyjne to projektowanie zestawu instrukcji (Instruction Set Architecture - ISA), obsługa stosu operacji, emulacja rejestrów procesora, oraz optymalizacja pętli interpretatora (Fetch-Decode-Execute cycle).

**Wymagane funkcje:**
- **Zestaw instrukcji (Opcodes):** Definicja instrukcji takich jak: `PUSH` (włożenie na stos), `POP` (zdjęcie ze stosu), `ADD`/`SUB`/`MUL`/`DIV` (operacje matematyczne na wierzchołku stosu), `LOAD`/`STORE` (obsługa zmiennych w lokalnej pamięci) oraz `JUMP`/`JUMP_IF_FALSE` (instrukcje sterujące / warunki).
- **Kompilator (Assembler):** Program parsujący kod tekstowy a'la assembler (np. `PUSH 10`, `PUSH 5`, `ADD`, `STORE x`) do surowej tablicy bajtów (pliku binarnego `.bin`).
- **Maszyna Wirtualna (Interpreter):** Pętla wykonująca instrukcje z tablicy bajtów przy użyciu wskaźnika instrukcji (Instruction Pointer - IP) i wewnętrznego stosu `Stack<int>` emulującego pamięć operacyjną.
- **Profilowanie wykonania (Diagnostic Metrics):** Wypisywanie stanu stosu i zmiennych po wykonaniu każdego kroku (Step-by-Step Execution Mode) oraz pomiar całkowitego czasu wykonania programu.

**Porady implementacyjne i dobre praktyki:**
Zdefiniuj instrukcje (Opcodes) jako wartości typu `byte` przy użyciu typu wyliczeniowego `enum Opcode : byte`. Pętla główna wirtualnej maszyny powinna bazować na instrukcji `switch` umieszczonej wewnątrz pętli `while`, dekodującej kolejne bajty ze strumienia instrukcji. Do emulacji stosu operacji, zamiast systemowej klasy `Stack<int>` (która ma narzut alokacyjny i metody sprawdzające granice), zaimplementuj prostą tablicę `int[]` o stałym rozmiarze (np. 1024 elementy) i wskaźnik wierzchołka stosu `int sp` – to drastycznie przyspieszy działanie wirtualnej maszyny (mikro-optymalizacja).
Wzorzec projektowy: *Interpreter*, *Command*, *State*.
