## 50. Detektor Duplikatów Plików na Dysku z Haszowaniem (File Duplicate Finder CLI)

**Szczegółowy opis i cele edukacyjne:**
Oczyszczanie dysku z powtarzających się plików wymaga napisania programu, który potrafi w optymalny sposób przeszukać tysiące ścieżek i zidentyfikować identyczne pliki. Porównywanie każdego pliku z każdym pod kątem zawartości (porównywanie bajt po bajcie) byłoby niezwykle wolne.
Projekt polega na stworzeniu wydajnego detektora duplikatów.
Głównym celem edukacyjnym na zakończenie pierwszego etapu ("Podstawy") jest połączenie dotychczasowej wiedzy: rekurencyjnego przeszukiwania dysku, pracy ze strumieniami plikowymi, wyliczania haszy kryptograficznych (SHA-256), optymalnego grupowania danych przy użyciu słowników oraz podstaw optymalizacji algorytmicznej (lazy evaluation) w celu drastycznego zmniejszenia liczby operacji dyskowych I/O.

**Wymagane funkcje:**
- **Skanowanie wstępne po rozmiarze:** Skanowanie katalogu i grupowanie plików według ich rozmiaru bajtowego. Pliki o unikalnych rozmiarach są natychmiast odrzucane z dalszej analizy (nie mogą mieć duplikatów).
- **Kompaktowe haszowanie (Partial Hashing):** Dla plików o identycznych rozmiarach program najpierw wczytuje i haszuje tylko ich pierwszy kilobajt (np. 1024 bajty). Jeśli hasze nagłówków są różne, pliki są odrzucane.
- **Pełne haszowanie weryfikacyjne:** Wyliczanie pełnego haszu SHA-256 tylko dla plików, które pomyślnie przeszły fazę częściowego haszowania, w celu potwierdzenia 100% tożsamości.
- **Prezentacja raportu i usuwanie:** Wyświetlenie grup duplikatów wraz ze ścieżkami, rozmiarem zajmowanego miejsca i łączną ilością marnowanej przestrzeni na dysku, z opcją automatycznego usunięcia duplikatów i pozostawienia jednego pliku.

**Porady implementacyjne i dobre praktyki:**
Struktura danych grupująca pliki na poszczególnych etapach to słownik, np. `Dictionary<long, List<string>>` (Rozmiar -> Ścieżki do plików). Zaimplementuj leniwe otwieranie plików i czytanie ich strumieniem buforowanym. Do częściowego haszowania użyj `FileStream.Read` pobierając pierwsze 1024 bajty do tablicy. Pełne haszowanie dużych plików realizuj asynchronicznie za pomocą klasy `SHA256` bezpośrednio na otwartym strumieniu, aby uniknąć problemów z OutOfMemory. Przed fizycznym usunięciem pliku upewnij się, że nie próbujesz usunąć wszystkich kopii (pozostaw przynajmniej jeden plik nienaruszony).
Wzorzec projektowy: *Chain of Responsibility (Łańcuch odpowiedzialności)* (gdzie kolejne etapy filtracji: rozmiar, hasz częściowy, hasz pełny, stanowią filtry przetwarzania).
