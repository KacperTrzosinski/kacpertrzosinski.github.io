## 96. Konwerter Dokumentów XML do Formatów JSON (XML JSON Transpiler CLI)

**Szczegółowy opis i cele edukacyjne:**
Formaty XML i JSON różnią się strukturalnie – XML wspiera atrybuty wewnątrz tagów, powtarzające się elementy o tej samej nazwie na jednym poziomie (co w JSON jest reprezentowane jako tablica) oraz wartości tekstowe wymieszane z tagami dzieci (mixed content).
Projekt polega na stworzeniu wydajnego parsera i konwertera plików XML do JSON, napisanego bez gotowych bibliotek typu Json.NET.
Cele edukacyjne to niskopoziomowe parsowanie struktur dokumentów przy użyciu `XmlReader` w celu minimalizacji alokacji pamięci, mapowanie niestandardowych reguł transformacji (np. jak zamieniać atrybuty XML na klucze JSON, jak automatycznie wykrywać, że dany element XML powinien stać się tablicą w JSON) oraz rekurencyjne generowanie plików wyjściowych JSON za pomocą `Utf8JsonWriter`.

**Wymagane funkcje:**
- **Strumieniowy odczyt XML:** Przetwarzanie dokumentu XML za pomocą klasy `XmlReader`, co pozwala na konwersję plików o gigabajtowych rozmiarach bez przeciążenia pamięci RAM.
- **Detekcja struktur tablicowych:** Algorytm, który przed zapisem bada rodzeństwo elementów i jeśli wykryje powtórzenie tagu o tej samej nazwie (np. `<item>` występuje kilkukrotnie na tym samym poziomie), automatycznie grupuje te elementy w tablicę JSON `[]`.
- **Mapowanie atrybutów:** Konwersja atrybutów tagów XML na właściwości JSON z prefiksem (np. atrybut `id="1"` staje się kluczem `"_id": "1"` lub `"@id": "1"`).
- **Zintegrowany CLI Transpiler:** Program wiersza poleceń z obsługą argumentów (ścieżka XML wejściowa, JSON wyjściowa, konfiguracja formatowania i traktowania atrybutów).

**Porady implementacyjne i dobre praktyki:**
Unikaj wczytywania całego dokumentu do drzewa DOM za pomocą `XmlDocument` lub `XDocument` przed konwersją, jeśli celem jest wysoka wydajność. Zaimplementuj rekurencyjną maszynę przechodzącą stany `XmlReader` (np. `XmlNodeType.Element`, `XmlNodeType.EndElement`, `XmlNodeType.Text`). Do zapisu danych wyjściowych w formacie JSON wykorzystaj `Utf8JsonWriter` piszący bezpośrednio do pliku wyjściowego, co zapewnia bezalokacyjny i bardzo szybki zapis binarny.
Wzorzec projektowy: *Chain of Responsibility*, *Interpreter*.
