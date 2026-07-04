## 13. System Rezerwacji Biletów Kinowych (Cinema Reservation CLI)

**Szczegółowy opis i cele edukacyjne:**
Zarządzanie miejscami siedzącymi w kinie lub teatrze to doskonały problem do nauki manipulacji tablicami wielowymiarowymi oraz ustrukturyzowanej kontroli stanu. Projekt polega na stworzeniu systemu rezerwacji dla kina wielosalowego. Każda sala kinowa ma inną strukturę rzędów i foteli (reprezentowaną jako macierz/tablica dwuwymiarowa).
Głównym celem edukacyjnym jest opanowanie pracy z tablicami dwuwymiarowymi prostokątnymi (`T[,]`) oraz poszarpanymi (`T[][]`), zrozumienie różnic wydajnościowych i alokacyjnych między nimi, a także implementacja logiki wyszukiwania najlepszych wolnych miejsc obok siebie (algorytmy sąsiedztwa).

**Wymagane funkcje:**
- **Konfiguracja sal (Grid representation):** Reprezentacja sali kinowej przy użyciu tablicy dwuwymiarowej (np. statusy foteli: Wolne, Rezerwowane, Sprzedane, Wyłączone z użycia).
- **Algorytm rekomendacji miejsc:** Funkcja, która po podaniu liczby potrzebnych biletów szuka i sugeruje najlepszy blok sąsiadujących ze sobą wolnych miejsc (preferując środkowe rzędy).
- **Obsługa transakcji rezerwacji:** Blokowanie wybranych foteli, generowanie unikalnego kodu rezerwacji oraz walidacja próby zakupu miejsca już zajętego.
- **Wizualizacja sali w CLI:** Renderowanie układu sali kinowej na ekranie konsoli z oznaczeniem kolorami (np. czerwony – zajęte, zielony – wolne, żółty – wybrane).

**Porady implementacyjne i dobre praktyki:**
W C# tablice prostokątne `int[,]` są alokowane jako pojedynczy, ciągły blok pamięci, co jest wysoce wydajne, ale ma stały rozmiar. Tablice poszarpane `int[][]` składają się z tablicy referencji do innych tablic, co pozwala na tworzenie rzędów o różnej długości (np. sal kinowych o niesymetrycznym kształcie), ale generuje więcej obiektów na stercie. Dobierz odpowiedni typ tablicy do wymagań architektury. Zadbaj o to, aby indeksowanie rzędów (często oznaczanych literami A-Z) oraz foteli (liczby 1-N) było poprawnie mapowane na indeksy tablicy (0-indexed). Unikaj modyfikacji tablic bezpośrednio w logice UI – wydziel klasę `CinemaHall` enkapsulującą dostęp do macierzy foteli.
