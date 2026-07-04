## 142. Skaner i Analizator Architektury Kodu Roslyn (Roslyn Architecture Analyzer)

**Szczegółowy opis i cele edukacyjne:**
W dużych projektach przestrzeganie czystej architektury (np. Clean Architecture) jest trudne do ręcznego kontrolowania. Często programiści przez pomyłkę łamią reguły zależności (np. referencja do bazy danych z warstwy Domain).
Projekt polega na stworzeniu narzędzia CLI, które analizuje kod źródłowy C# całego rozwiązania przy użyciu oficjalnego API kompilatora Roslyn (`Microsoft.CodeAnalysis`). Program buduje graf zależności między projektami i przestrzeniami nazw, weryfikuje poprawność z zdefiniowanymi regułami architektonicznymi i zgłasza błędy w przypadku wykrycia naruszeń.
Cele edukacyjne to zaawansowana praca z Roslyn Compiler API, używanie parserów składni (Syntax Tree) oraz modeli semantycznych (Semantic Model), budowanie grafów zależności kodu, oraz automatyzacja audytu architektury w potokach CI/CD.

**Wymagane funkcje:**
- **Analiza struktury kodu (Roslyn Workspace):** Wczytywanie plików rozwiązania `.sln` lub projektów `.csproj` i ładowanie kodu do wirtualnego obszaru roboczego Roslyn (`MSBuildWorkspace` lub ręczny odczyt plików `.cs` do drzew składni).
- **Skanowanie dyrektyw using (Syntax Walker):** Implementacja klasy dziedziczącej po `CSharpSyntaxWalker`, która analizuje wszystkie instrukcje `using` w plikach kodu w celu wyodrębnienia importowanych przestrzeni nazw.
- **Weryfikacja reguł architektonicznych:** Możliwość zdefiniowania reguł w pliku konfiguracyjnym JSON, np.:
  `"Rule": "Domain should not reference Infrastructure"`.
  Program sprawdza, czy w plikach należących do przestrzeni `MyApp.Domain` występują dyrektywy importujące klasy z `MyApp.Infrastructure`.
- **Raport i kody wyjściowe CLI:** Generowanie przejrzystego raportu o błędach (plik, linia kodu, opis naruszenia reguły) wraz ze zwróceniem niezerowego kodu wyjścia (Exit Code = 1), co umożliwia bezpośrednie wpięcie narzędzia do skryptów wdrożeniowych.

**Porady implementacyjne i dobre praktyki:**
Do wyszukiwania importów wykorzystaj parser Roslyn i węzły typu `UsingDirectiveSyntax`. Sam odczyt importów tekstowych (tekstowa analiza za pomocą `using`) bywa niewystarczający w przypadku używania pełnych ścieżek typów bezpośrednio w kodzie (np. `var service = new MyApp.Infrastructure.SqlDatabase()`). Aby wykryć takie powiązania, musisz wygenerować Model Semantyczny (`SemanticModel`) dla każdego dokumentu i zbadać symbole typów (`ISymbol`) używane we wszystkich deklaracjach zmiennych i wywołaniach metod.
Wzorzec projektowy: *Visitor (Wizytator)*, *Static Analysis*.
