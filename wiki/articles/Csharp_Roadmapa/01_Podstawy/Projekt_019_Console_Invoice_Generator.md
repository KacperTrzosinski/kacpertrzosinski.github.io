## 19. Generator Faktur i Rachunków w Konsoli (Console Invoice Generator)

**Szczegółowy opis i cele edukacyjne:**
Generowanie faktur to krytyczny komponent każdego oprogramowania ERP czy sklepu internetowego. System musi precyzyjnie operować na kwotach netto, stawkach podatku VAT (np. 23%, 8%, 0%), kwotach brutto oraz rabatach, a także generować czytelny dokument tekstowy.
Projekt ten ma na celu utrwalenie wiedzy o precyzji obliczeń matematycznych w C# (użycie typu `decimal`) oraz naukę zaawansowanego formatowania napisów w CLI. Student dowiaduje się, jak poprawnie zaokrąglać kwoty (zaokrąglanie bankierskie vs matematyczne przy użyciu `Math.Round` z parametrem `MidpointRounding`), jak wyrównywać kolumny tabeli (String alignment i interpolacja stringów z paddingiem) oraz jak zarządzać strukturą dokumentu (nagłówek, pozycje, stopka).

**Wymagane funkcje:**
- **Modelowanie faktury:** Klasy `Invoice`, `InvoiceLine` (pozycja faktury z ilością, ceną jednostkową netto, stawką VAT) oraz `Company` (dane sprzedawcy i nabywcy z walidacją NIP/Regon).
- **Zasady naliczania podatku i rabatów:** Obsługa rabatów procentowych na poszczególne pozycje lub na całą fakturę, a także automatyczne grupowanie podatku VAT według stawek.
- **Precyzyjne zaokrąglenia:** Zaimplementowanie konfiguracji sposobu zaokrąglania końcowego podatku (np. liczenie VAT od sumy pozycji vs suma podatków z każdej pozycji).
- **Eksport do pliku tekstowego (ASCII Art / Grid Document):** Renderowanie faktury do pliku `.txt` z eleganckimi obramowaniami zrobionymi ze znaków ASCII, z zachowaniem idealnych odstępów.

**Porady implementacyjne i dobre praktyki:**
Nigdy nie używaj typu `double` ani `float` do reprezentowania pieniędzy – drobne błędy zaokrągleń w arytmetyce zmiennoprzecinkowej binarnych (np. `0.1 + 0.2 = 0.30000000000000004`) są niedopuszczalne w księgowości. Zawsze stosuj typ `decimal`. Do wyrównywania kolumn tabeli w wypluwanym pliku tekstowym użyj możliwości formatowania w interpolacji stringów, np. `$"| {name,-20} | {price,10:C} |"`. Wartość dodatnia (np. `10`) wyrównuje do prawej, a ujemna (np. `-20`) do lewej. Przy zaokrąglaniu cen jednostkowych i podatków zawsze używaj `Math.Round(amount, 2, MidpointRounding.AwayFromZero)` w celu uzyskania tradycyjnego zaokrąglania matematycznego.
Wzorzec projektowy: *Builder* (do łatwego konstruowania obiektów faktury), *Strategy* (dla różnych systemów zaokrągleń podatkowych).
