## 54. Bezpieczny System Logowania z Haszowaniem PBKDF2 (Console Auth System)

**Szczegółowy opis i cele edukacyjne:**
Przechowywanie haseł użytkowników w bazie danych w postaci otwartego tekstu (plain text) to kardynalny błąd bezpieczeństwa. W przypadku wycieku danych, wszystkie konta zostają natychmiast skompromitowane.
W tym projekcie stworzysz lokalny system rejestracji i logowania użytkowników w wersji CLI, dbając o najwyższe standardy bezpieczeństwa kryptograficznego.
Cele edukacyjne to zrozumienie i implementacja mechanizmu jednostronnego haszowania haseł przy użyciu silnego algorytmu PBKDF2 (w .NET reprezentowanego przez klasę `Rfc2898DeriveBytes`), poprawne generowanie kryptograficznie bezpiecznej soli (Salt) za pomocą klasy `RandomNumberGenerator` oraz zapobieganie atakom typu timing attack poprzez porównywanie haszy w stałym czasie (constant-time comparison).

**Wymagane funkcje:**
- **Rejestracja z haszowaniem i soleniem:** Podczas tworzenia konta program generuje losową sól (16 bajtów), łączy ją z hasłem i wylicza hasz (np. SHA-256 z 100 000 iteracji). Sól i hasz są zapisywane w lokalnym pliku bazy danych (JSON lub SQLite).
- **Proces autoryzacji (Login):** Podczas logowania system odczytuje zapisaną sól dla danego użytkownika, haszuje wprowadzone hasło z tą solą i porównuje wynik z zapisanym haszem.
- **Bezpieczne porównanie (Constant-Time Compare):** Zaimplementowanie metody porównującej tablice bajtów, która wykonuje stałą liczbę operacji niezależnie od tego, na której pozycji bajty się różnią (ochrona przed analizą czasu wykonania).
- **Zarządzanie sesją (Session State):** Po zalogowaniu system tworzy w pamięci obiekt sesji o ograniczonym czasie ważności (np. automatyczne wylogowanie po 5 minutach bezczynności).

**Porady implementacyjne i dobre praktyki:**
Nigdy nie używaj przestarzałych algorytmów takich jak MD5 czy SHA-1 do haszowania haseł – są one podatne na kolizje oraz ataki z użyciem tablic tęczowych (Rainbow Tables). Wykorzystaj klasę `Rfc2898DeriveBytes` z zalecaną liczbą iteracji. Sól musi być unikalna dla każdego użytkownika. Porównanie haszy wykonaj metodą `CryptographicOperations.FixedTimeEquals(spanA, spanB)`, co zapobiega atakom typu Side-Channel Timing Attacks. Sesją zarządzaj za pomocą klasy `SessionManager` opartej na wzorcu Singleton.
Wzorzec projektowy: *Singleton* (zarządca sesji), *Secure Repository*.
