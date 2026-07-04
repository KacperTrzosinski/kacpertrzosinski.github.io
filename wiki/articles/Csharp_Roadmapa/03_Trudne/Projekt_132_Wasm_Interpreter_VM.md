## 132. Interpreter WebAssembly i Maszyna Wirtualna (Wasm Interpreter VM)

**Szczegółowy opis i cele edukacyjne:**
WebAssembly (Wasm) to format instrukcji binarnych dla maszyn wirtualnych opartych na stosie. Pozwala na uruchamianie kodu skompilowanego z języków takich jak C++, Rust czy C# w piaskownicy (Sandbox) z prędkością bliską natywnej.
Projekt polega na napisaniu w C# interpretera i wirtualnego stosu wykonawczego dla binarnego formatu plików WebAssembly (`.wasm`). Program wczytuje plik binarny Wasm, parsuje sekcje nagłówkowe, dekoduje instrukcje binarne funkcji i wykonuje je na własnym, wirtualnym stosie.
Cele edukacyjne to niskopoziomowe parsowanie binarnego formatu Wasm (zgodnie ze specyfikacją Wasm Core Specification), implementacja wirtualnej maszyny stosowej (Stack-based VM), zarządzanie typami wartości Wasm (i32, i64, f32, f64) oraz symulowanie instrukcji sterujących (np. pętle, warunki) i arytmetycznych.

**Wymagane funkcje:**
- **Parser sekcji binarnych Wasm:** Odczyt nagłówka pliku (Magic number `0x00 0x61 0x73 0x6d` oraz wersja) i parsowanie podstawowych sekcji: Type (sygnatury funkcji), Function (powiązania funkcji z typami), Code (surowe bajty kodu maszynowego) oraz Export (nazwy eksportowanych funkcji).
- **Stos maszynowy VM (Execution Stack):** Własny stos operacyjny przechowujący wartości wirtualnej maszyny, na który odkładane są argumenty instrukcji i z którego pobierane są wyniki.
- **Dekoder instrukcji (Opcode Decoder):** Obsługa wykonywania instrukcji:
  - Arytmetycznych: `i32.add`, `i32.sub`, `i32.mul`, `i32.div_s`.
  - Zarządzania pamięcią lokalną: `local.get`, `local.set`.
  - Sterujących: `call` (wywołanie innej funkcji).
- **Silnik uruchomieniowy (Run Engine):** Narzędzie CLI pozwalające załadować plik `.wasm`, wybrać eksportowaną funkcję, podać argumenty (np. `fibonacci(10)`) i wyświetlić wynik działania zwrócony przez maszynę wirtualną.

**Porady implementacyjne i dobre praktyki:**
Pliki Wasm używają kodowania LEB128 (Little Endian Base 128) do zapisu liczb całkowitych o zmiennej długości bajtowej. Musisz zaimplementować funkcję dekodującą te liczby (odczytywanie bajt po bajcie, aż do napotkania bajtu z najbardziej znaczącym bitem równym `0`). Do reprezentacji instrukcji stwórz unię lub strukturę o wysokiej wydajności. Pętla wykonawcza (Interpreter Loop) powinna czytać instrukcje z tablicy bajtowej funkcji na podstawie wskaźnika instrukcji (Instruction Pointer - IP) i modyfikować stan stosu `Stack<Value>`.
Wzorzec projektowy: *Bytecode Interpreter*, *Virtual Machine*, *Command*.
