## 1. Konsolowy Parser i Ewaluator Wyrażeń Matematycznych (Math Parser CLI)

**Szczegółowy opis i cele edukacyjne:**
Projekt polega na stworzeniu konsolowego kalkulatora, który potrafi sparsować i poprawnie obliczyć wartość wyrażenia matematycznego podanego jako ciąg tekstowy (np. `(2 + 3.5) * 4 - 2^3`). Zadanie to uczy, jak odejść od naiwnego pisania instrukcji warunkowych w jednej wielkiej metodzie i jak podzielić problem na niezależne warstwy: tokenizację (Lexer) oraz ewaluację (Parser/Evaluator za pomocą np. algorytmu stacji rozrządowej Dijkstra - Shunting-yard, lub budowy prostego drzewa składniowego - AST).
Głównym celem edukacyjnym jest zrozumienie zasad programowania zorientowanego obiektowo (OOP) w C#, enkapsulacji logiki, obsługi błędów bez załamywania działania aplikacji oraz bezpiecznego parsowania typów (np. konwersji ze stringa na liczby zmiennoprzecinkowe przy zachowaniu odpowiednich ustawień regionalnych / CultureInfo).

**Wymagane funkcje:**
- **Tokenizacja (Lexer):** Rozbicie ciągu wejściowego na listę tokenów (liczby, operatory, nawiasy) przy użyciu silnie typowanych obiektów lub struktur.
- **Ewaluacja wyrażeń:** Zaimplementowanie algorytmu Shunting-yard w celu przekształcenia wyrażenia w notację postfiksową (RPN) lub zbudowania drzewa wyrażeń, a następnie jego obliczenie.
- **Obsługa błędów (Error Handling):** Wyłapywanie błędów składniowych (np. brakujący nawias, nieznany znak, dzielenie przez zero) i prezentowanie użytkownikowi precyzyjnej informacji o błędzie wraz z pozycją w ciągu wejściowym.
- **Historia obliczeń i zmienne:** Możliwość definiowania własnych zmiennych w sesji konsoli (np. `x = 10`, a następnie `x * 2`) oraz przeglądanie historii poprawnych obliczeń.

**Porady implementacyjne i dobre praktyki:**
Do reprezentacji tokenów stwórz osobną strukturę lub klasę `Token` zawierającą typ tokenu (użyj typu wyliczeniowego `enum TokenType`) oraz jego wartość. Unikaj używania surowych stringów ("magic strings") do identyfikacji operatorów. Podczas konwersji ciągów znaków na typy liczbowe (`double` lub `decimal`) zawsze korzystaj z `double.TryParse` oraz jawnie przesyłaj `CultureInfo.InvariantCulture`, aby uniknąć problemów z przecinkiem/kropką jako separatorem dziesiętnym. Pamiętaj o zasadzie pojedynczej odpowiedzialności (Single Responsibility Principle) – klasa odpowiedzialna za odczyt danych z konsoli nie powinna zajmować się parsowaniem matematycznym.
