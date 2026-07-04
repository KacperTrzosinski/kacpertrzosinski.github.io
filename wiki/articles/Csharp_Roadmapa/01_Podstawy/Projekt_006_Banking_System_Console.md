## 6. Symulator Systemu Bankowego z Obsługą Zdarzeń (Banking System Console)

**Szczegółowy opis i cele edukacyjne:**
Projekt polega na stworzeniu konsolowej aplikacji symulującej system bankowy obsługujący konta osobiste i oszczędnościowe, autoryzację operacji oraz naliczanie odsetek. Głównym celem tego projektu jest zapoznanie się z delegatami (`delegates`) oraz zdarzeniami (`events`) w języku C#.
Zamiast sztywnego powiązania logiki konta z konsolą (np. bezpośredniego wypisywania informacji o braku środków), system bankowy powinien powiadamiać zewnętrzne komponenty (np. moduł audytowy, moduł powiadomień SMS/email) za pomocą zdarzeń. Dodatkowo projekt rozwija umiejętności z zakresu tworzenia własnych klas wyjątków (Custom Exceptions) oraz poprawnego obsługiwania transakcyjności w pamięci (zatwierdzenie operacji lub wycofanie w przypadku błędu).

**Wymagane funkcje:**
- **Zarządzanie kontami:** Klasa bazowa `BankAccount` oraz klasy pochodne (np. `SavingsAccount` z ograniczeniem wypłat, `CheckingAccount` z limitem debetowym).
- **Obsługa zdarzeń finansowych:** Definicja zdarzeń takich jak `OnWithdrawalBlocked` (gdy brakuje środków), `OnLargeTransaction` (dla transakcji powyżej 10 000 zł w celach audytu AML) oraz `OnInterestCalculated`.
- **Wielomodułowe powiadomienia:** Moduł powiadomień konsolowych oraz moduł logowania historii (Audit Log) rejestrujący zdarzenia bankowe bez modyfikacji kodu klasy `BankAccount`.
- **Własna obsługa wyjątków:** Wykorzystanie i rzucanie własnych wyjątków, takich jak `InsufficientFundsException` czy `DailyLimitExceededException`.

**Porady implementacyjne i dobre praktyki:**
Zdarzenia powinny być definiowane zgodnie z konwencją .NET, czyli za pomocą generycznego delegata `EventHandler<TEventArgs>`, gdzie `TEventArgs` dziedziczy po klasie `EventArgs`. Klasa `BankAccount` nie powinna wiedzieć, kto subskrybuje jej zdarzenia (zasada luźnego powiązania – Loose Coupling). Użyj operatora warunkowego null (`?.Invoke`) przy wywoływaniu zdarzeń, aby zapobiec rzuceniu `NullReferenceException`, gdy nikt nie subskrybuje zdarzenia. Pamiętaj o ochronie stanu wewnętrznego konta – saldo (`Balance`) powinno być modyfikowane wyłącznie przez metody `Deposit()` i `Withdraw()`, a sama właściwość powinna mieć akcesor `public decimal Balance { get; private set; }`.
Wzorzec projektowy: *Observer (Obserwator)* realizowany poprzez systemowe zdarzenia.
