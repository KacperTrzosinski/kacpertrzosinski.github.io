## 14. Parser i Generator Raportów CSV (Custom CSV Engine)

**Szczegółowy opis i cele edukacyjne:**
Format CSV (Comma-Separated Values) wydaje się prosty, jednak poprawna obsługa wszystkich jego niuansów (znaki nowej linii wewnątrz wartości, cudzysłowy, przecinki jako część tekstu, kodowanie znaków) zgodnie ze specyfikacją RFC 4180 to poważne wyzwanie inżynieryjne. 
Projekt polega na stworzeniu własnego silnika do parsowania oraz generowania plików CSV. W ramach tego zadania nauczysz się zaawansowanej manipulacji tekstami i strumieniami, a także wykorzystasz mechanizm refleksji (`Reflection`) do automatycznego mapowania kolumn pliku CSV na właściwości obiektów w C# (klasy typu POCO - Plain Old CLR Objects).

**Wymagane funkcje:**
- **Zgodny z RFC 4180 parser linii:** Obsługa pól otoczonych cudzysłowami, zawierających przecinki oraz znaki ucieczki (podwójny cudzysłów `""` reprezentujący pojedynczy cudzysłów w tekście).
- **Generyczny parser obiektów:** Metoda typu `IEnumerable<T> Parse<T>(StreamReader reader)`, która odczytuje nagłówki i na drodze refleksji automatycznie dopasowuje je do właściwości klasy `T`.
- **Generyczny generator raportów:** Metoda eksportująca kolekcję obiektów do formatu CSV z automatycznym mapowaniem nazw właściwości klasy jako nagłówków kolumn.
- **Własne atrybuty mapowania:** Obsługa dedykowanego atrybutu, np. `[CsvColumn("Nazwa_Kolumny")]`, umożliwiającego zmianę nazwy kolumny w pliku niezależnie od nazwy pola w kodzie.

**Porady implementacyjne i dobre praktyki:**
Napisanie parsera CSV za pomocą zwykłego `string.Split(',')` jest błędem architektonicznym, ponieważ nie obsługuje przecinków wewnątrz cudzysłowów. Zamiast tego zaimplementuj prosty automat skończony (Finite State Machine - FSM) przetwarzający znaki jeden po drugim. Do optymalizacji refleksji (która bywa powolna) pobieraj i keszuj informacje o właściwościach typu `T` (PropertyInfo) jednorazowo na początku przetwarzania pliku, zamiast badać typ dla każdego wiersza z osobna. Użyj klasy `TypeDescriptor` lub `System.Reflection` do konwersji typów surowych tekstów z CSV na docelowe typy właściwości (np. `int`, `DateTime`, `bool`).
Wzorzec projektowy: *State (Stan)* dla automatu parsującego znaki, *Strategy* (dla różnych strategii obsługi błędów parsowania kolumn).
