## 147. Kompilator JIT Maszyny Wirtualnej WebAssembly (Wasm JIT Compiler VM)

**Szczegółowy opis i cele edukacyjne:**
Interpreter kodu (np. wczytywanie bajtkodu Wasm w pętli) jest stosunkowo powolny. Aby uzyskać najwyższą wydajność, nowoczesne maszyny wirtualne kompilują kod bajtowy w locie do instrukcji maszynowych procesora (JIT - Just-In-Time Compilation). W środowisku .NET możemy zrealizować to poprzez kompilowanie kodu Wasm do kodu IL (Intermediate Language) platformy .NET, który następnie systemowy kompilator JIT CLR przetłumaczy bezpośrednio na kod maszynowy x86/x64.
Projekt polega na stworzeniu kompilatora JIT dla WebAssembly. Program wczytuje kod funkcji z pliku `.wasm`, przechodzi przez kolejne instrukcje Wasm i dynamicznie generuje dla nich odpowiadające instrukcje IL platformy .NET, tworząc metodę wykonywalną w locie (Dynamic Method).
Cele edukacyjne to zaawansowana generacja kodu IL w pamięci za pomocą klasy `DynamicMethod` oraz generatora `ILGenerator`, praca z opkodami MSIL (np. `OpCodes.Ldarg`, `OpCodes.Add`, `OpCodes.Call`), oraz zrozumienie zasad optymalizacji kodu i działania kompilatorów JIT.

**Wymagane funkcje:**
- **Inicjalizacja metody dynamicznej (DynamicMethod):** Tworzenie obiektów `DynamicMethod` w locie z odpowiednią sygnaturą typów (mapowanie typów parametrów i typu zwracanego z Wasm na typy .NET).
- **Kompilator instrukcji stosu Wasm do IL:** Przejście bajtkodu i mapowanie instrukcji:
  - `i32.add` -> `ILGenerator.Emit(OpCodes.Add)`.
  - `local.get N` -> `ILGenerator.Emit(OpCodes.Ldloc, localBuilders[N])`.
  - `local.set N` -> `ILGenerator.Emit(OpCodes.Stloc, localBuilders[N])`.
  - Instrukcji warunkowych (np. `if` / `else`) -> generowanie skoków IL (`OpCodes.Brtrue`, `OpCodes.Br`) przy użyciu etykiet `Label`.
- **Kompilacja i rejestracja delegata:** Zakończenie generacji kodu instrukcją `OpCodes.Ret` i wywołanie `DynamicMethod.CreateDelegate`, co zwraca natywnego, szybkiego delegata C# (np. `Func<int, int, int>`).
- **Zintegrowany tester wydajności JIT vs Interpreter:** Porównanie czasu wykonania skomplikowanego algorytmu matematycznego (np. wyliczanie ciągu Fibonacciego) uruchomionego w napisanym wcześniej interpreterze Wasm, w kompilatorze Wasm JIT oraz jako czysty kod C#.

**Porady implementacyjne i dobre praktyki:**
Ponieważ zarówno WebAssembly, jak i MSIL (.NET Common Intermediate Language) to maszyny oparte o stos, proces kompilacji (translacji) jest niezwykle naturalny. Nie musisz samodzielnie zarządzać stosem wirtualnym – kompilator .NET zrobi to za Ciebie. Na przykład instrukcja Wasm `i32.const 5` odkłada na stos wartość 5. W IL odpowiada jej `ldc.i4.5`. Gdy napotkasz instrukcję `i32.add`, po prostu wyemituj `add` – kompilator .NET automatycznie zdejmie dwie ostatnie wartości ze stosu IL, doda je i odłoży wynik.
Wzorzec projektowy: *Just-In-Time Compiler*, *Builder*, *Flyweight*.
