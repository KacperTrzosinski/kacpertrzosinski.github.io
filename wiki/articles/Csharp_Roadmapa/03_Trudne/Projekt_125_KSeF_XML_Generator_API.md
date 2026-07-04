## 125. Generator i Walidator Faktur KSeF XML z Podpisem (KSeF XML Generator API)

**Szczegółowy opis i cele edukacyjne:**
Wdrożenie systemów KSeF (Krajowy System e-Faktur) lub podobnych rządowych platform fakturowania cyfrowego w Europie opiera się o sztywne, ustrukturyzowane szablony XML (schematy XSD) oraz autoryzację dokumentów za pomocą podpisów cyfrowych (np. podpis kwalifikowany lub XAdES / XML Signature). Błędy w formacie pliku są odrzucane przez bramki rządowe.
Projekt polega na stworzeniu serwisu API generującego faktury w wymaganym rządowym formacie XML, walidującego strukturę pliku przed wysyłką z użyciem lokalnych schematów XSD oraz nakładającego cyfrowy podpis XML.
Cele edukacyjne to zaawansowane modelowanie i serializacja XML z obsługą przestrzeni nazw (Namespaces), dynamiczna walidacja dokumentów za pomocą schematów XSD (`XmlSchemaSet`), oraz kryptograficzne podpisywanie dokumentów XML przy użyciu klasy `SignedXml` i certyfikatów X.509.

**Wymagane funkcje:**
- **Silnik generowania XML KSeF:** Mapowanie obiektów biznesowych faktury (pozycja, cena netto/brutto, stawka VAT, dane nabywcy/sprzedawcy) do struktury XML zgodnej z najnowszą specyfikacją logiczną KSeF (np. FA_2).
- **Walidator schematów XSD:** Funkcja walidująca wygenerowany ciąg znaków XML w locie na podstawie załadowanego pliku schematu `.xsd` z wychwytywaniem precyzyjnych błędów strukturalnych (np. brakujący wymagany tag, błędny format kodu pocztowego).
- **Podpisywanie cyfrowe (XML Signature):** Implementacja standardu podpisu cyfrowego XML (W3C XML Signature standard) za pomocą klasy `System.Security.Cryptography.Xml.SignedXml` i certyfikatu cert_test.pfx. Podpis jest osadzany wewnątrz podpisywanego dokumentu jako tag `<Signature>`.
- **Wygodne raporty walidacji:** API zwraca szczegółowe dane o błędach walidacji: linia błędu, opis niespełnionego kryterium w schemacie XSD.

**Porady implementacyjne i dobre praktyki:**
Do walidacji XML użyj instancji klasy `XmlReaderSettings` z dodanym schematem XSD przez `XmlReaderSettings.Schemas.Add(...)` i ustawioną flagą `ValidationType = ValidationType.Schema`. Podczas podpisywania XML za pomocą `SignedXml` musisz poprawnie zdefiniować elementy referencyjne (`Reference`) i canonicalization method (np. `SignedXml.XmlDsigExcC14NTransformUrl`) w celu ujednolicenia białych znaków, co zapobiega uznaniu podpisu za nieważny przy zmianie formatowania pliku przez bramki rządowe.
Wzorzec projektowy: *Adapter*, *Strategy*, *Decorator*.
