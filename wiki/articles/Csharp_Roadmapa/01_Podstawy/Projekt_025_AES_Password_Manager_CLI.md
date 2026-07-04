## 25. Menedżer Haseł CLI z Szyfrowaniem AES (AES Password Manager CLI)

**Szczegółowy opis i cele edukacyjne:**
Bezpieczeństwo danych to fundament inżynierii oprogramowania. Projekt polega na stworzeniu konsolowego menedżera haseł, który przechowuje loginy, hasła i adresy URL w pliku zaszyfrowanym symetrycznym algorytmem AES (Advanced Encryption Standard) z kluczem wygenerowanym na podstawie hasła głównego (Master Password) wprowadzonego przez użytkownika.
Głównym celem edukacyjnym jest zapoznanie się z biblioteką kryptograficzną w platformie .NET (`System.Security.Cryptography`). Student dowiaduje się, jak bezpiecznie pobierać hasło w konsoli (maskowanie znaków `*`), jak wyprowadzać klucze kryptograficzne przy użyciu algorytmów KDF (Key Derivation Function, np. PBKDF2 za pomocą `Rfc2898DeriveBytes`), jak poprawnie używać soli (Salt) oraz wektora inicjalizacyjnego (IV - Initialization Vector).

**Wymagane funkcje:**
- **Bezpieczne wprowadzanie hasła głównego:** Metoda odczytująca znaki z klawiatury bez wyświetlania ich na ekranie (lub zastępująca je gwiazdkami `*`).
- **Generowanie klucza (Key Derivation):** Wykorzystanie PBKDF2 z solą i dużą liczbą iteracji (np. 100 000) do przekształcenia hasła tekstowego w 256-bitowy klucz AES.
- **Szyfrowanie i deszyfrowanie bazy danych:** Klasa `AesCrypter` szyfrująca i deszyfrująca plik bazy danych (JSON) za pomocą standardu AES w trybie CBC.
- **Operacje na hasłach (CRUD):** Dodawanie, wyszukiwanie, edycja i usuwanie wpisów w pamięci po pomyślnym odszyfrowaniu bazy, wraz z generatorem losowych, bezpiecznych haseł o zadanych kryteriach.

**Porady implementacyjne i dobre praktyki:**
Nigdy nie zapisuj hasła głównego (Master Password) ani wygenerowanego z niego klucza AES na dysku w postaci jawnej. Do weryfikacji poprawności hasła głównego przy deszyfrowaniu dodaj do zaszyfrowanej bazy danych małą, znaną wartość kontrolną (np. zaszyfrowany napis "SUCCESS"). Jeśli po odszyfrowaniu otrzymasz ten napis, hasło jest poprawne. Zawsze generuj nowy wektor inicjalizacyjny (IV) przy każdym zapisie bazy i zapisuj go na początku pliku (jest on jawny, nie musi być chroniony). Upewnij się, że wszystkie zasoby kryptograficzne (`Aes`, `Rfc2898DeriveBytes`, strumienie `CryptoStream`) są poprawnie zamykane i zwalniane (implementują interfejs `IDisposable`).
Wzorzec projektowy: *Secure Repository* (repozytorium zintegrowane z warstwą szyfrującą).
