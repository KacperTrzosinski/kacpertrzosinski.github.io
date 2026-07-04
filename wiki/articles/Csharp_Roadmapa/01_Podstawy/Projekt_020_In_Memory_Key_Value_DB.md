## 20. Baza Danych Klucz-Wartość w Pamięci z Transakcjami (In-Memory Key-Value DB)

**Szczegółowy opis i cele edukacyjne:**
Bazy danych typu klucz-wartość (np. Redis) są fundamentem współczesnych systemów cache. Projekt polega na stworzeniu własnego, konsolowego silnika bazodanowego przechowującego dane w pamięci RAM w postaci par klucz-wartość. Cechą wyróżniającą ten projekt jest wdrożenie obsługi transakcji (operacji `BEGIN`, `COMMIT`, `ROLLBACK`), które mogą być zagnieżdżone.
Cele edukacyjne obejmują naukę zaawansowanego operowania na strukturach danych (wykorzystanie stosu `Stack<T>` do przechowywania poziomów transakcji), mechanizmu głębokiego kopiowania obiektów (deep copy) w celu odtwarzania stanu przed transakcją oraz optymalizacji wyszukiwania kluczy.

**Wymagane funkcje:**
- **Podstawowe operacje (CRUD):** Komendy `SET key value`, `GET key`, `DELETE key` oraz `EXISTS key`.
- **Transakcyjność (ACID basics):**
  - `BEGIN` – rozpoczyna nową transakcję (tworzy punkt przywracania stanu).
  - `COMMIT` – zatwierdza wszystkie zmiany wprowadzone w bieżącej transakcji i zamyka ją.
  - `ROLLBACK` – wycofuje wszystkie zmiany dokonane od ostatniego wywołania `BEGIN`.
- **Zagnieżdżone transakcje:** Możliwość wywołania wielu `BEGIN` pod rząd i wycofywania ich krok po kroku (LIFO).
- **Obsługa CLI (Interactive Shell):** Pętla REPL (Read-Eval-Print Loop) interpretująca komendy użytkownika i wyświetlająca komunikaty o statusie operacji.

**Porady implementacyjne i dobre praktyki:**
Baza powinna przechowywać aktualny stan w głównym słowniku `Dictionary<string, string>`. W momencie wywołania komendy `BEGIN`, zamiast kopiować cały słownik (co jest niewydajne), stwórz na stosie `Stack<Dictionary<string, string>>` tymczasowy słownik rejestrujący jedynie zmiany dokonane w bieżącym poziomie transakcji (delta tracking) lub skopiuj stan słownika na stos transakcji. Wybór odpowiedniego podejścia wpłynie na zużycie pamięci i wydajność. Podczas operacji `GET` system musi przeszukać stany transakcyjne od najnowszego (na górze stosu) do najstarszego, a na końcu sprawdzić bazowy słownik słownika głównego. Zadbaj o obszerne testowanie zachowania transakcji przy użyciu różnych scenariuszy zagnieżdżenia.
Wzorzec projektowy: *Memento (Pamiątka)* (do zapisu i odtwarzania stanu bazy danych), *Command (Polecenie)*.
