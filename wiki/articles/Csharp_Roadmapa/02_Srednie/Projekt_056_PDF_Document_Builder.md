## 56. Generator Szablonów Dokumentów PDF z Bindowaniem (PDF Document Builder)

**Szczegółowy opis i cele edukacyjne:**
Generowanie raportów, faktur i certyfikatów w formacie PDF to powszechne wymaganie w systemach biznesowych. Często szablony dokumentów zmieniają się dynamicznie, co rodzi potrzebę posiadania silnika, który potrafi zmapować dane z obiektów na zdefiniowany układ graficzny dokumentu.
Projekt polega na stworzeniu generycznego silnika generowania plików PDF. Silnik wczytuje szablon układu (np. plik JSON określający strukturę siatki, nagłówki, tabele i stopki) oraz model danych (dowolny obiekt C#), a następnie na drodze refleksji (`Reflection`) dynamicznie wstrzykuje wartości do dokumentu i generuje plik PDF.
Cele edukacyjne to integracja z nowoczesnymi bibliotekami PDF w ekosystemie .NET (np. `QuestPDF` lub `PdfSharp` za pomocą NuGet), dynamiczne bindowanie właściwości obiektów, oraz praca z layoutami i formatowaniem dokumentów do druku.

**Wymagane funkcje:**
- **Dynamiczne bindowanie szablonów:** Analiza pól tekstowych szablonu w poszukiwaniu tokenów (np. `{{Customer.LastName}}`) i dynamiczna zamiana ich na wartości właściwości przekazanego obiektu za pomocą refleksji.
- **Projektowanie siatki layoutu (Grid system):** Obsługa definicji tabel, nagłówków, kolumn oraz automatycznego podziału stron (Pagination) dla długich tekstów.
- **Wykresy i elementy graficzne:** Opcjonalne generowanie prostych wykresów słupkowych lub kołowych wewnątrz dokumentu PDF na podstawie danych liczbowych.
- **Podpis cyfrowy i zabezpieczenia (opcjonalnie):** Szyfrowanie pliku PDF hasłem użytkownika lub nakładanie znaku wodnego (Watermark).

**Porady implementacyjne i dobre praktyki:**
Do generowania plików PDF zaleca się użycie biblioteki `QuestPDF`, która posiada nowoczesne, płynne API (Fluent API) i jest znacznie bardziej wydajna niż starsze narzędzia bazujące na HTML-to-PDF. Podczas dynamicznego wyszukiwania wartości w zagnieżdżonych strukturach (np. `Order.Customer.Address.City`) zaimplementuj rekurencyjną metodę pomocniczą, która parsuje ścieżkę właściwości po kropkach i pobiera wartość przez refleksję, keszując obiekty `PropertyInfo` w celu optymalizacji wydajności. Zabezpiecz silnik przed sytuacją, gdy przekazany model danych nie posiada właściwości zdefiniowanej w szablonie (programowanie defensywne – wstawianie pustego ciągu lub rzucenie zdarzenia ostrzegawczego).
Wzorzec projektowy: *Builder (Budowniczy)*, *Template Method*.
