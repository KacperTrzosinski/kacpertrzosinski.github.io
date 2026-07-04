## 9. Rejestrator Czasu Pracy Pracowników (Employee Time Tracker)

**Szczegółowy opis i cele edukacyjne:**
Zarządzanie czasem pracy to klasyczny problem biznesowy, który wymaga precyzyjnego operowania na przedziałach czasowych oraz wykrywania konfliktów (np. nakładanie się godzin pracy tego samego pracownika lub nakładanie się urlopów). Projekt polega na stworzeniu konsolowej aplikacji, która pozwala rejestrować wejścia i wyjścia pracowników, planować ich dyżury oraz generować miesięczne zestawienia godzinowe z uwzględnieniem nadgodzin i stawek taryfowych.
Cele edukacyjne skupiają się wokół zaawansowanego przetwarzania kolekcji danych przy pomocy technologii LINQ oraz nauki operowania na strukturach `DateTime`, `TimeSpan`, `DateOnly` i `TimeOnly` (wprowadzonych w .NET 6). Student dowiaduje się, jak walidować nakładające się okresy (overlap detection) oraz jak poprawnie radzić sobie z wartościami opcjonalnymi (Nullable Types, np. `DateTime?` reprezentujące czas wyjścia, który jest pusty, gdy pracownik wciąż pracuje).

**Wymagane funkcje:**
- **Rejestracja zdarzeń (Clock-In / Clock-Out):** Pracownicy mogą "odbić kartę" rozpoczynając pracę oraz zakończyć ją. System uniemożliwia dwukrotne rozpoczęcie pracy bez uprzedniego zakończenia poprzedniej sesji.
- **Wykrywanie konfliktów harmonogramu:** Walidator sprawdzający, czy nowo planowany dyżur nie nakłada się w czasie z innym dyżurem przypisanym do tego samego pracownika.
- **Zaawansowane raporty LINQ:** Wyliczanie sumy godzin przepracowanych przez każdego pracownika w wybranym miesiącu, podział na godziny standardowe oraz nadgodziny (powyżej 8h na dobę), zestawienie kosztów płacowych.
- **Obsługa typów Nullable:** Poprawne zarządzanie stanami niepełnymi (np. pracownik jest aktualnie w pracy, więc `ExitTime` ma wartość `null`).

**Porady implementacyjne i dobre praktyki:**
Do wyszukiwania nakładających się przedziałów czasowych (np. okresu A i okresu B) zastosuj formułę logiczną: `(StartA < EndB) && (EndA > StartB)`. Wszelkie zapytania sumujące i filtrujące realizuj deklaratywnie za pomocą LINQ (np. `GroupBy`, `Select`, `Sum`). Do przechowywania identyfikatora pracownika i jego stawek płacowych użyj niezmiennych rekordów (`record Employee`). Unikaj używania zmiennych globalnych – cała baza powinna być zarządzana przez dedykowany serwis, np. `TimeTrackingService`, do którego wstrzykuje się kolekcje danych. Zwróć szczególną uwagę na obsługę sytuacji, w których pracownik rozpoczął pracę przed północą jednego dnia, a zakończył kolejnego dnia rano.
