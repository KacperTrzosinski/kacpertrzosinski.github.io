## 3. Symulator Portfela Inwestycyjnego (Value vs Reference Types)

**Szczegółowy opis i cele edukacyjne:**
Symulator portfela inwestycyjnego służy do śledzenia posiadanych aktywów finansowych (akcji, kryptowalut, walut fiat) oraz symulacji transakcji kupna/sprzedaży. W aplikacjach finansowych niezwykle ważne jest precyzyjne operowanie na liczbach oraz zrozumienie, jak obiekty są alokowane w pamięci.
Cel edukacyjny tego projektu to dogłębne zrozumienie różnic między typami wartościowymi (Value Types) a typami referencyjnymi (Reference Types) w platformie .NET. Student uczy się, kiedy stosować struktury (`struct`), klasy (`class`) oraz rekordy (`record`). Projekt kładzie nacisk na problem precyzji obliczeń zmiennoprzecinkowych (użycie typu `decimal` zamiast `double`/`float` do operacji finansowych) oraz niezmienność danych (immutability) w transakcjach.

**Wymagane funkcje:**
- **Reprezentacja waluty i kwot (Money Struct):** Własna struktura `Money` łącząca wartość (`decimal`) i kod waluty (`string` lub `enum`), zabezpieczająca przed dodawaniem kwot w różnych walutach bez uprzedniej konwersji.
- **Niezmienne transakcje (Transaction Record):** Użycie rekordów w C# (`public record Transaction`) do zapisu historii operacji (data, typ aktywa, wolumen, cena, prowizja), co gwarantuje, że raz utworzona transakcja nie zostanie zmodyfikowana.
- **Agregacja portfela (Portfolio Class):** Klasa referencyjna przechowująca stan posiadanych aktywów (np. `Dictionary<AssetType, decimal>`) oraz udostępniająca metody do wykonywania transakcji i obliczania całkowitej wartości portfela.
- **Raportowanie i wycena:** Moduł pobierający (symulujący) aktualne kursy aktywów i generujący raport o zyskach/stratach (P&L) z transakcji.

**Porady implementacyjne i dobre praktyki:**
Zaimplementuj strukturę `Money` jako typ niezmienny (immutable struct) oraz przeciąż dla niej operatory matematyczne (`+`, `-`, `*`), tak aby próba wykonania operacji na różnych walutach (np. USD + EUR) rzucała wyjątek `InvalidOperationException`. Użycie rekordu (`record`) automatycznie dostarcza poprawną implementację metod porównujących (`Equals`), kodu haszującego (`GetHashCode`) oraz czytelne formatowanie tekstowe, co jest idealne dla danych transakcyjnych. Pamiętaj, że przekazywanie struktur typu `Money` kopiuje ich wartość na stosie, podczas gdy przekazywanie obiektu `Portfolio` przekazuje referencję wskazującą na ten sam obszar na stercie (Heap). Zadbaj o to, aby stan słownika w klasie `Portfolio` nie był bezpośrednio wystawiony na zewnątrz (enkapsulacja kolekcji) – zamiast tego zwracaj `IReadOnlyDictionary`.
