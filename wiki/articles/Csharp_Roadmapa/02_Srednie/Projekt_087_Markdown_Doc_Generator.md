## 87. Narzędzie CLI do Generowania Dokumentacji z Komentarzy XML (Markdown Doc Generator)

**Szczegółowy opis i cele edukacyjne:**
Utrzymywanie aktualnej dokumentacji API w dużych projektach bywa problematyczne. W języku C# standardem jest pisanie komentarzy dokumentacyjnych bezpośrednio w kodzie przy użyciu potrójnego slasha (np. `/// <summary>Opis</summary>`). Kompilator potrafi wyeksportować te komentarze do pliku XML.
Projekt polega na stworzeniu narzędzia CLI, które parsuje pliki XML komentarzy oraz pliki kodu źródłowego `.cs` (lub skompilowane biblioteki `.dll` przez refleksję) i automatycznie generuje kompletną, czytelną dokumentację techniczną API w formacie Markdown (pliki `.md`), gotową do wrzucenia np. na GitHub Wiki.
Cele edukacyjne to integracja refleksji z parsowaniem plików XML, dynamiczna analiza klas, metod, parametrów i typów zwracanych, oraz generowanie sformatowanego dokumentu z zachowaniem hierarchii przestrzeni nazw.

**Wymagane funkcje:**
- **Parser komentarzy XML:** Wczytywanie pliku XML wygenerowanego przez kompilator i mapowanie komentarzy (summary, param, returns, exception) na odpowiednie klasy i metody.
- **Analiza typów (Reflection Loader):** Dynamiczne ładowanie pliku `.dll` biblioteki i skanowanie jej zawartości (wszystkie typy publiczne) w celu powiązania sygnatur kodu z komentarzami XML.
- **Generowanie dokumentacji Markdown:** Tworzenie sformatowanych tabel z opisami parametrów metod, typów zwracanych oraz generowanie spisu treści i linków między podstronami klas.
- **Wykrywanie przestarzałych metod:** Automatyczne oznaczanie w wygenerowanym dokumencie metod oznaczonych atrybutem `[Obsolete]` wraz z informacją o zalecanej alternatywie.

**Porady implementacyjne i dobre praktyki:**
Aby kompilator wygenerował plik XML z komentarzami, w projekcie musi być włączona flaga `<GenerateDocumentationFile>true</GenerateDocumentationFile>` w pliku `.csproj`. Klucze w pliku XML wygenerowanym przez kompilator mają specyficzny format (np. `M:MyNamespace.MyClass.MyMethod(System.String)` dla metod, `T:MyNamespace.MyClass` dla klas). Zaimplementuj parser, który poprawnie tłumaczy te identyfikatory tekstowe na obiekty refleksji (`MethodInfo`, `TypeInfo`). Do odczytu i dopasowania typu do klucza XML pomocne będą metody `Assembly.GetType(typeName)`.
Wzorzec projektowy: *Adapter*, *Code Generation*.
