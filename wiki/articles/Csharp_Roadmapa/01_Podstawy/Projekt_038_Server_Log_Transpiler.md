## 38. Parser Logów Serwera do Formatów JSON i XML (Server Log Transpiler)

**Szczegółowy opis i cele edukacyjne:**
W pracy inżyniera oprogramowania często zachodzi potrzeba konwersji (transpilacji) nieustrukturyzowanych logów tekstowych do ustrukturyzowanych formatów wymiany danych. Projekt polega na stworzeniu parsera logów serwera (np. IIS, Nginx lub Apache) i zapisaniu ich w postaci plików JSON lub XML, w zależności od wybranych flag w wierszu poleceń.
Głównym celem edukacyjnym jest opanowanie technik serializacji w .NET. Student uczy się konfigurować i używać bibliotek `System.Text.Json` oraz `System.Xml.Serialization.XmlSerializer`. Projekt uczy również tworzenia kodu elastycznego na zmiany formatów wyjściowych oraz bezpiecznego parsowania skomplikowanych linii tekstu z logami przy użyciu zaawansowanych wyrażeń regularnych (`Regex`) z grupami nazwomymi (named groups).

**Wymagane funkcje:**
- **Analiza Regex z nazwanymi grupami:** Parsowanie linii logów w formacie W3C za pomocą wyrażenia regularnego, które mapuje pola bezpośrednio do właściwości klasy (np. `(?<ip>[0-9.]+)` mapuje IP).
- **Serializacja do JSON:** Eksport ustrukturyzowanych obiektów `LogEntry` do formatu JSON z obsługą niestandardowych reguł nazewnictwa (np. CamelCase) i ignorowaniem wartości domyślnych/null.
- **Serializacja do XML:** Eksport obiektów do formatu XML z poprawną strukturą tagów, atrybutami (np. poziom logowania jako atrybut tagu `<LogEntry>`) oraz definicją głównego elementu root.
- **Transpilacja strumieniowa (Large files):** Przetwarzanie plików logów o rozmiarze przekraczającym pamięć RAM poprzez parsowanie i zapisywanie ich porcjami (w locie), bez trzymania całej listy obiektów w pamięci podręcznej.

**Porady implementacyjne i dobre praktyki:**
Do zapisu dużych plików XML w sposób strumieniowy użyj klasy `XmlWriter` połączonej z `XmlSerializer`, co zapobiegnie alokacji całej struktury dokumentu w pamięci. Do zapisu JSON w locie idealnie nadaje się `Utf8JsonWriter`. Zdefiniuj atrybuty takie jak `[JsonPropertyName("name")]` dla JSON oraz `[XmlElement("ElementName")]` dla XML na tej samej klasie POCO (`LogEntry`), aby kontrolować strukturę wyjściową obu formatów bez konieczności duplikowania klas modeli.
Wzorzec projektowy: *Adapter (Adapter)*, *Factory (Fabryka)* (do tworzenia odpowiedniego transpilatora na podstawie typu pliku wyjściowego).
