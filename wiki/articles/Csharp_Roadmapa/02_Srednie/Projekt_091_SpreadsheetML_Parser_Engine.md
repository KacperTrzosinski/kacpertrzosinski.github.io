## 91. Parser i Ewaluator Arkuszy SpreadsheetML (SpreadsheetML Parser Engine)

**Szczegółowy opis i cele edukacyjne:**
Arkusze kalkulacyjne pakietu Microsoft Office Excel są zapisywane w formacie OpenXML, a konkretnie SpreadsheetML (pliki `.xlsx` są archiwami ZIP zawierającymi zestawy plików XML). Ręczne manipulowanie i weryfikowanie tych plików bez ciężkich zależności pakietu Office to częsta potrzeba systemów raportowych.
Projekt polega na stworzeniu asynchronicznego parsera plików SpreadsheetML (OpenXML). Program wczytuje plik `.xlsx`, wypakowuje archiwum w pamięci, parsuje pliki XML arkuszy (`sheet1.xml`), odczytuje definicje komórek, mapuje tabele napisów współdzielonych (Shared Strings) oraz potrafi przeliczyć proste formuły i zaktualizować dane, a następnie zapisać plik z powrotem.
Cele edukacyjne to praca z archiwami ZIP w pamięci (`ZipArchive`), zaawansowane parsowanie XML przy użyciu `XmlReader`, radzenie sobie ze specyfikacjami formatów biurowych oraz modyfikacja struktur XML bez uszkodzenia integralności pliku Office.

**Wymagane funkcje:**
- **Wypakowywanie XLSX w pamięci (ZIP streams):** Odczytywanie pliku `.xlsx` za pomocą klasy `ZipArchive` bez wypakowywania na dysk fizyczny (praca na strumieniach w pamięci).
- **Mapowanie tabeli Shared Strings:** Parsowanie pliku `sharedStrings.xml` i budowanie tablicy/indeksu tekstów współdzielonych (Excel przechowuje powtarzające się stringi w jednym centralnym pliku, a w komórkach zapisuje tylko ich indeksy).
- **Parsowanie arkusza i komórek:** Odczyt danych z pliku `sheet1.xml` i mapowanie ich na obiekty komórek z zachowaniem koordynatów (np. `r="A1"`).
- **Zapis i rekonstrukcja XLSX:** Modyfikacja wybranych komórek w pliku XML, spakowanie struktury z powrotem do archiwum ZIP i zapis jako sprawny plik Excela, który otwiera się bez błędów w MS Excel.

**Porady implementacyjne i dobre praktyki:**
Struktura pliku OpenXML używa specyficznych przestrzeni nazw (Namespaces) w XML. Podczas wyszukiwania elementów za pomocą LINQ to XML zawsze zdefiniuj obiekt `XNamespace` i łącz go z nazwami tagów, np. `XNamespace ns = "http://schemas.openxmlformats.org/spreadsheetml/2006/main"; var sheetData = doc.Descendants(ns + "sheetData");`. Do modyfikacji plików XML wewnątrz archiwum ZIP otwórz strumień z wpisu (`ZipArchiveEntry.Open()`), zmodyfikuj go za pomocą `XDocument.Save()` i upewnij się, że poprawnie zamykasz strumień, co wymusi fizyczny zapis zmian w archiwum ZIP.
Wzorzec projektowy: *Adapter*, *Facade (Fasada)*.
