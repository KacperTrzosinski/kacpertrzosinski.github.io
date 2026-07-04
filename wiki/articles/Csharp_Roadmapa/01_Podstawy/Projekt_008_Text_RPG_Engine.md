## 8. Silnik Tekstowej Gry RPG z Refleksją (Text RPG Engine)

**Szczegółowy opis i cele edukacyjne:**
Gry tekstowe wymagają elastycznego silnika, który potrafi przetwarzać komendy wpisywane przez użytkownika (np. `go north`, `take sword`, `use key on door`, `stats`). Zamiast pisać gigantyczną instrukcję `switch-case` obsługującą wszystkie słowa kluczowe, zaawansowane silniki gier rejestrują i ładują komendy dynamicznie.
Projekt polega na stworzeniu modułowej gry tekstowej. Cel edukacyjny to zapoznanie się z mechanizmem refleksji (`Reflection`) w C# do skanowania zestawu instrukcji (Assembly) i automatycznego ładowania klas implementujących wspólny interfejs komendy. Uczestnik dowiaduje się również, jak zaprojektować elastyczny stan gry (pokój, ekwipunek, przeciwnicy) przy użyciu obiektowych wzorców projektowych.

**Wymagane funkcje:**
- **Silnik komend oparty na refleksji:** Interfejs `ICommand` oraz mechanizm skanujący aplikację przy starcie w poszukiwaniu klas implementujących ten interfejs i oznaczonych odpowiednimi atrybutami (np. `[Command("go")]`).
- **Reprezentacja świata gry:** Struktura grafowa, w której każdy pokój (`Room`) jest węzłem połączonym z innymi pokojami za pomocą kierunków (północ, południe, itp.).
- **System ekwipunku i interakcji:** Możliwość podnoszenia przedmiotów, używania ich w odpowiednich pokojach (np. klucz otwiera zablokowany pokój) oraz sprawdzania statystyk postaci.
- **Pętla gry (Game Loop):** Asynchroniczna lub synchroniczna pętla odczytująca wejście, parsująca komendę, wykonująca akcję i aktualizująca stan świata.

**Porady implementacyjne i dobre praktyki:**
Stwórz klasę `CommandDispatcher`, która podczas inicjalizacji używa kodu: `Assembly.GetExecutingAssembly().GetTypes()` do znalezienia klas implementujących `ICommand`. Zarejestruj je w słowniku `Dictionary<string, ICommand>` według nazwy komendy zdefiniowanej w atrybucie `[Command("...")].` Unikaj twardego kodowania przejść między pokojami – stwórz strukturę danych w pliku JSON, z którego silnik wczyta mapę świata przy starcie. Używaj refleksji w sposób bezpieczny i wydajny – ładuj typy przy starcie aplikacji (Warmup), aby uniknąć narzutu wydajnościowego podczas samej rozgrywki.
Wzorzec projektowy: *Command (Polecenie)*, *State (Stan)* (do kontrolowania czy gracz walczy, eksploruje czy rozmawia z NPC).
