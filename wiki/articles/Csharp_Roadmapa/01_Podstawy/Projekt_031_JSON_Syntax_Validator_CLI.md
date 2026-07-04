## 31. Walidator Składniowy Formatów JSON w Konsoli (JSON Syntax Validator CLI)

**Szczegółowy opis i cele edukacyjne:**
Walidacja formatów danych to proces sprawdzania, czy wejściowy ciąg znaków jest zgodny z formalną gramatyką języka. Projekt polega na stworzeniu parsera, który wczytuje plik JSON i weryfikuje poprawność jego składni (dopasowanie nawiasów `{}` i `[]`, poprawne cudzysłowy w kluczach i wartościach tekstowych, obecność dwukropków i przecinków, poprawność wartości logicznych `true`/`false` oraz null).
Głównym celem edukacyjnym jest nauka projektowania maszyn stanów (State Machine) do analizy leksykalnej, parsowania bezużywania gotowych bibliotek typu `Newtonsoft.Json` czy `System.Text.Json`, oraz precyzyjnego lokalizowania i raportowania błędów składniowych za pomocą wskaźników tekstowych (np. numer linii, kolumny i wycinek błędnego kodu).

**Wymagane funkcje:**
- **Analizator leksykalny (Lexer):** Rozbicie strumienia wejściowego na tokeny (nawias klamrowy otwierający/zamykający, dwukropek, przecinek, wartość tekstowa, liczba).
- **Maszyna stanów walidatora (Parser State Machine):** Śledzenie oczekiwanego następnego tokenu (np. po kluczu w obiekcie musi nastąpić dwukropek, po przecinku musi nastąpić kolejny klucz lub element).
- **Stos dopasowania nawiasów:** Użycie struktury `Stack<char>` do weryfikacji poprawnego zagnieżdżania nawiasów klamrowych `{}` i kwadratowych `[]`.
- **Precyzyjny raport o błędach:** Jeśli plik jest niepoprawny, program wskazuje dokładnie linię, kolumnę i wyświetla strzałkę `^` pod znakiem, który spowodował odrzucenie składni.

**Porady implementacyjne i dobre praktyki:**
Zaimplementuj stany parsera jako typ wyliczeniowy `enum ParserState { ExpectRoot, ExpectKey, ExpectColon, ExpectValue, ExpectCommaOrClose }`. Unikaj wczytywania całego dużego pliku JSON do jednego stringa – zaimplementuj strumieniowe czytanie znaków za pomocą klasy `TextReader` w celu oszczędności pamięci. Aby poprawnie obsługiwać znaki ucieczki wewnątrz stringów (np. `\"`), zaimplementuj stan przejściowy "Escape character" podczas odczytu tekstu.
Wzorzec projektowy: *State (Stan)* (do kontrolowania stanów maszyny parsującej).
