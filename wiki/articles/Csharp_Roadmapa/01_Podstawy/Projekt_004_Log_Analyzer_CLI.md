## 4. Narzędzie CLI do Analizy Logów Tekstowych (Log Analyzer CLI)

**Szczegółowy opis i cele edukacyjne:**
Analiza logów to jedno z podstawowych zadań w pracy programisty i administratora systemów. Projekt polega na stworzeniu narzędzia wiersza poleceń (CLI), które analizuje duże pliki tekstowe z logami (np. w formacie W3C, IIS lub niestandardowym formacie aplikacji) i generuje statystyki: liczbę błędów na minutę, najczęściej wywoływane adresy URL, unikalne adresy IP czy średni czas odpowiedzi.
Projekt ten wprowadza studenta w tematykę operacji wejścia-wyjścia na plikach (File I/O) oraz technologii LINQ (Language Integrated Query). Cele edukacyjne obejmują naukę strumieniowego czytania plików (aby nie przeciążyć pamięci RAM przy plikach o rozmiarze wielu gigabajtów), bezpieczną obsługę ścieżek systemowych (`System.IO.Path`) oraz deklaratywne filtrowanie, grupowanie i sortowanie danych przy użyciu LINQ.

**Wymagane funkcje:**
- **Strumieniowe czytanie logów:** Wykorzystanie klasy `StreamReader` i metody `File.ReadLines` (lazy loading) do linia-po-linii czytania pliku logów bez wczytywania go w całości do pamięci.
- **Parsowanie linii logu:** Użycie wyrażeń regularnych (`Regex`) lub optymalnego podziału ciągów (`string.Split`) do wyodrębnienia pól: data/czas, poziom logowania (INFO, WARN, ERROR), kod statusu HTTP, IP, czas operacji.
- **Generowanie raportów LINQ:** Agregacja danych (grupowanie błędów po godzinie, wyliczanie top 10 adresów IP o największym ruchu, średnie opóźnienie dla danej trasy).
- **Zapis raportu do pliku:** Eksport wygenerowanych statystyk do nowego pliku tekstowego lub CSV, z automatycznym tworzeniem katalogu docelowego i obsługą uprawnień do zapisu.

**Porady implementacyjne i dobre praktyki:**
Nigdy nie używaj `File.ReadAllLines` ani `File.ReadAllText` dla plików, których rozmiar nie jest z góry znany – naucz się korzystać z dobrodziejstw leniwej ewaluacji zwracanej przez `IEnumerable<string>` z metody `File.ReadLines`. Logikę parsowania pojedynczej linii logu wydziel do osobnej metody/klasy, która zwraca obiekt typu `LogEntry` lub `null` w przypadku błędnego formatu linii (programowanie defensywne). W zapytaniach LINQ używaj czytelnej składni metod rozszerzających (`Extension Methods` / lambda expressions). Pamiętaj o zwalnianiu zasobów systemowych – pliki powinny być otwierane wewnątrz bloku `using` (lub instrukcji `using var` wprowadzonych w C# 8), co gwarantuje poprawne zamknięcie strumieni nawet w przypadku wystąpienia nieoczekiwanego wyjątku.
