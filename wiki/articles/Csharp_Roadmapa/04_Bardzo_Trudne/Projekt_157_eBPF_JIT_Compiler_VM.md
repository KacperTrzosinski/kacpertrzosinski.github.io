## 157. Kompilator JIT Maszyny Wirtualnej eBPF (eBPF JIT Compiler VM)

**Szczegółowy opis i cele edukacyjne:**
eBPF (Extended Berkeley Packet Filter) to rewolucyjna technologia jądra systemu Linux (i obecnie Windows), pozwalająca na uruchamianie bezpiecznych, zweryfikowanych sandboksowych programów wewnątrz jądra bez modyfikowania kodu źródłowego jądra czy ładowania modułów. Programy te są kompilowane do dedykowanego kodu bajtowego eBPF.
Projekt polega na napisaniu w C# wirtualnego środowiska wykonawczego eBPF, w tym kompilatora JIT, który konwertuje instrukcje binarne eBPF na instrukcje MSIL (.NET Intermediate Language), a następnie wywołuje je natywnie w CLR.
Cele edukacyjne to niskopoziomowa analiza instrukcji maszynowych eBPF (rejestry $R0-R10$, operacje arytmetyczne, instrukcje skoku), implementacja walidatora kodu (Verifier) chroniącego przed nieskończonymi pętlami i błędami dostępu do pamięci, oraz dynamiczna kompilacja JIT przy użyciu `ILGenerator`.

**Wymagane funkcje:**
- **Parser instrukcji binarnych eBPF:** Każda instrukcja eBPF ma stałą długość 8 bajtów (1 bajt Opcode, 4 bity dst register, 4 bity src register, 2 bajty Offset, 4 bajty Immediate value). Program parsuje surowy plik `.o` (lub bufor bajtów) i generuje tablicę instrukcji.
- **Weryfikator kodu (eBPF Verifier):** Bezpieczeństwo jest kluczem. Przed uruchomieniem kodu program wykonuje statyczną analizę przepływu (Control Flow Graph - CFG) w celu upewnienia się, że program:
  - Nie zawiera cykli / nieskończonych pętli (musi zakończyć się w skończonym czasie).
  - Nie odczytuje niepowołanych rejestrów przed ich inicjalizacją.
  - Nie wykracza poza obszar dozwolonej pamięci (Out of bounds).
- **Kompilator eBPF to MSIL JIT:** Mapowanie rejestrów eBPF ($R0 \dots R10$) na zmienne lokalne w IL .NET. Konwersja instrukcji (np. dodawanie rejestru, skoki warunkowe) na instrukcje IL.
- **Wykonanie z kontekstem (Context parameters):** Program pozwala na przekazanie wirtualnego bufora pamięci (Context) jako parametru wejściowego dla kodu eBPF i zwraca wartość rejestru $R0$ po zakończeniu działania.

**Porady implementacyjne i dobre praktyki:**
Specyfikacja eBPF definiuje 11 64-bitowych rejestrów ogólnego przeznaczenia (od $R0$ do $R10$). W MSIL zadeklaruj je za pomocą zmiennych lokalnych typu `ulong` (`ILGenerator.DeclareLocal(typeof(ulong))`). Przy mapowaniu opkodów eBPF, pamiętaj o poprawnym rzutowaniu i obsłudze przepełnień (np. instrukcje arytmetyczne 32-bitowe i 64-bitowe). Walidator kodu (Verifier) zaimplementuj za pomocą techniki przeszukiwania grafu CFG metodą DFS (Depth-First Search) z wykrywaniem cykli wstecznych (Back edges), co pozwoli na skuteczne wykrywanie pętli.
Wzorzec projektowy: *Static Analyzer*, *JIT Compiler*, *Control Flow Graph Builder*.
