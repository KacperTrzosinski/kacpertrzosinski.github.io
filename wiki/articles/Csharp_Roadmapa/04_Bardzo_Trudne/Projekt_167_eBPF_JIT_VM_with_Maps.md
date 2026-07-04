## 167. Kompilator JIT Maszyny Wirtualnej eBPF z Obsługą Map (eBPF JIT VM with Maps)

**Szczegółowy opis i cele edukacyjne:**
W klasycznej architekturze eBPF programy uruchamiane w piaskownicy (Sandbox) są bezstanowe – nie mogą zachowywać danych między kolejnymi uruchomieniami. Do trwałego zapisywania stanu (np. zliczania pakietów z danego IP) oraz do bezpiecznej komunikacji programu eBPF z przestrzenią użytkownika (User Space) służą Mapy eBPF (eBPF Maps). Są to globalne struktury danych (np. tabele haszujące, tablice, ring bufery) zarządzane przez system operacyjny.
Projekt polega na rozbudowaniu wirtualnej maszyny eBPF JIT o pełną obsługę Map eBPF oraz wywołań funkcji pomocniczych (Helper Functions).
Cele edukacyjne to synchronizacja i bezpieczny współdzielony dostęp do struktur danych między różnymi kontekstami uruchomieniowymi kompilatora JIT, implementacja wywołań funkcji systemowych z poziomu dynamicznie kompilowanego kodu IL (Helper Call resolution przy użyciu instrukcji `call` w eBPF), oraz optymalizacja dostępu do pamięci.

**Wymagane funkcje:**
- **Silnik Map eBPF (eBPF Maps Storage):** Definicja struktur danych w pamięci RAM o typach:
  - `BPF_MAP_TYPE_HASH` (tabela haszująca klucz-wartość).
  - `BPF_MAP_TYPE_ARRAY` (szybka tablica indeksowana liczbami całkowitymi).
- **Wywołania funkcji pomocniczych (Helpers Engine):** Implementacja standardowych funkcji pomocniczych zdefiniowanych w specyfikacji eBPF (np. `bpf_map_lookup_elem`, `bpf_map_update_elem`, `bpf_map_delete_elem`), które program eBPF może wywołać przekazując wskaźniki w rejestrach $R1-R5$.
- **Generowanie wywołań w locie (JIT Helper Call):** Kompilator JIT rozpoznaje instrukcję eBPF `call <helper_id>` i dynamicznie emituje kod IL C# wywołujący odpowiednią statyczną metodę pomocnika platformy .NET, przekazując wskaźniki i parametry z rejestrów dynamicznych.
- **Bezpieczeństwo dostępu do map (Concurrecy & Verifier validation):** Walidator (Verifier) weryfikuje poprawność typów klucza i wartości przekazywanych do map w fazie statycznej analizy przed uruchomieniem kodu, a same mapy są chronione przed zakleszczeniami i wyścigami wątków.

**Porady implementacyjne i dobre praktyki:**
Helper call w eBPF przekazuje argumenty przez rejestry od $R1$ do $R5$, a wynik zwraca w rejestrze $R0$. W kompilatorze JIT, gdy napotkasz instrukcję wywołania, przygotuj stos IL: załaduj zmienne reprezentujące rejestry $R1-R5$ na stos (.NET IL evaluation stack), a następnie wyemituj instrukcję `call` kierującą do odpowiedniej metody C#. Wynik zwrócony z metody przypisz do zmiennej lokalnej reprezentującej rejestr $R0$ (`stloc`). Do implementacji `BPF_MAP_TYPE_HASH` wykorzystaj `ConcurrentDictionary`, co zapewni bezpieczny wielowątkowy dostęp.
Wzorzec projektowy: *Sandbox (Piaskownica)*, *JIT Compiler Helper Method Resolution*, *Flyweight*.
