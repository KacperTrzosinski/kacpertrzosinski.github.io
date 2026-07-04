## 11. Menedżer Archiwum ZIP z Haszowaniem Plików (Zip Hash Manager)

**Szczegółowy opis i cele edukacyjne:**
Projekt polega na stworzeniu narzędzia konsolowego do zarządzania spakowanymi archiwami ZIP oraz weryfikacji integralności plików. Aplikacja powinna umożliwiać tworzenie nowego archiwum, dodawanie plików, wypakowywanie ich oraz obliczanie sum kontrolnych (MD5, SHA-256) dla każdego pliku wewnątrz archiwum, a także porównywanie ich z plikami na dysku.
Cel edukacyjny to zapoznanie się z biblioteką `System.IO.Compression`, w tym z klasami `ZipArchive` i `ZipArchiveEntry`. Projekt uczy poprawnej pracy ze strumieniami (`Streams`), obsługi pamięci buforowanej przy wyliczaniu haszy kryptograficznych (`System.Security.Cryptography`) oraz manipulacji strukturą katalogów.

**Wymagane funkcje:**
- **Kompresja i dekompresja:** Tworzenie archiwum ZIP z wybranego folderu oraz wypakowywanie całego archiwum lub pojedynczego pliku do wskazanej ścieżki.
- **Odczyt bez dekompresji (On-The-Fly hashing):** Wyliczanie sumy kontrolnej SHA-256 bezpośrednio ze strumienia odczytu pliku w archiwum bez uprzedniego zapisywania go na dysk.
- **Wyszukiwanie duplikatów w ZIP:** Analiza archiwum i wykrywanie identycznych plików (na podstawie wyliczonych haszy) w celu zaoszczędzenia miejsca.
- **Sprawdzanie integralności:** Porównywanie haszy plików w archiwum z ich lokalnymi kopiami i generowanie raportu o różnicach (zmodyfikowany, usunięty, nowy).

**Porady implementacyjne i dobre praktyki:**
Zawsze otwieraj obiekty `ZipArchive` w trybie odpowiednim do zadania (`ZipArchiveMode.Read`, `Update` lub `Create`) i upewnij się, że są one zwalniane za pomocą `using`. Wyliczając hasz SHA-256 ze strumienia, nie wczytuj całego pliku do tablicy bajtów (`byte[]`). Zamiast tego przekaż strumień bezpośrednio do metody `SHA256.Create().ComputeHashAsync` lub `ComputeHash(Stream)`. Zapobiegnie to wyczerpaniu pamięci RAM przy dużych plikach. Do porównywania tablic haszy (bajt po bajcie) zamiast pętli for użyj metody `CryptographicOperations.FixedTimeEquals` lub metody `SequenceEqual` z LINQ.
Wzorzec projektowy: *Facade (Fasada)* maskująca niskopoziomowe operacje na plikach i archiwum pod postacią prostego interfejsu `IZipManager`.
