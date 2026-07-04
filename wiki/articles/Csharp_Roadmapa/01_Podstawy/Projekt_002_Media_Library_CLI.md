## 2. System Zarządzania Biblioteką Mediów (Media Library CLI)

**Szczegółowy opis i cele edukacyjne:**
Projekt polega na stworzeniu aplikacji konsolowej pozwalającej na zarządzanie katalogiem domowych mediów: książek, filmów, albumów muzycznych i gier wideo. Każdy typ medium posiada swoje unikalne właściwości (np. liczba stron dla książki, reżyser i czas trwania dla filmu, platforma dla gry), ale wszystkie współdzielą wspólne cechy (tytuł, rok wydania, gatunek, ocena użytkownika).
Cel edukacyjny skupia się na nauce poprawnego projektowania hierarchii klas, właściwym zastosowaniu dziedziczenia (inheritance) oraz interfejsów (interfaces). Projekt uczy, jak realizować polimorfizm (polymorphism) w praktyce – na przykład poprzez implementację wspólnego interfejsu dla obiektów, które można wypożyczyć lub ocenić, oraz jak poprawnie enkapsulować pola za pomocą właściwości (properties) z odpowiednimi akcesorami dostępu (`get`, `set`, `init`, `private set`).

**Wymagane funkcje:**
- **Hierarchia klas mediów:** Klasa bazowa `MediaItem` oraz klasy pochodne (`Book`, `Movie`, `MusicAlbum`, `VideoGame`), przechowujące specyficzne atrybuty i nadpisujące metody reprezentacji tekstowej (`ToString()`).
- **Interfejsy funkcjonalne:** Implementacja interfejsu `IBorrowable` (dla mediów fizycznych, które można wypożyczyć, śledząc datę zwrotu) oraz `IRateable` (pozwalającego na dodawanie i wyliczanie średniej ocen).
- **Zarządzanie kolekcją (Library Manager):** Klasa zarządzająca bazą danych w pamięci (użycie `List<MediaItem>`), oferująca wyszukiwanie po tytule, filtrowanie po gatunku oraz przeglądanie tylko aktualnie wypożyczonych pozycji.
- **Interfejs CLI oparty o komendy:** Czytelne menu tekstowe z walidacją wejścia użytkownika, zabezpieczone przed podaniem błędnych typów danych (np. ujemny rok wydania, puste nazwy, błędna ocena).

**Porady implementacyjne i dobre praktyki:**
Zastosuj zasadę DRY (Don't Repeat Yourself) – wspólne pola i metody (jak walidacja oceny) powinny znajdować się w klasie bazowej `MediaItem`. Właściwości, które nie powinny być modyfikowane po utworzeniu obiektu, oznacz jako `init` (C# 9+). Wszelkie metody modyfikujące stan (np. `Borrow()` czy `Return()`) powinny rzucać dedykowane wyjątki w przypadku błędnego stanu (np. próba wypożyczenia już wypożyczonej książki), co uczy poprawnej kontroli przepływu aplikacji za pomocą wyjątków. Unikaj rzucania generycznego `Exception` – stwórz własną klasę wyjątku, np. `MediaLibraryException`.
Wzorzec projektowy: *Factory Method* (do tworzenia obiektów różnych typów mediów na podstawie wyboru użytkownika).
