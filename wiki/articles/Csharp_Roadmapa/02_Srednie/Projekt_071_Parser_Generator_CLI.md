## 71. Generator Parserów Gramatycznych LALR(1) / LL(1) (Parser Generator CLI)

**Szczegółowy opis i cele edukacyjne:**
Tworzenie własnych języków programowania, specyficznych formatów plików czy języków zapytań (DSL - Domain Specific Language) wymaga zaawansowanej wiedzy z zakresu teorii kompilatorów.
Projekt polega na stworzeniu generatora parserów (podobnego do ANTLR, yacc czy bison). Program wczytuje plik tekstowy ze specyfikacją gramatyki bezkontekstowej (w notacji EBNF), analizuje reguły produkcji, wylicza zbiory First i Follow dla symboli nieterminalnych, generuje tabele parsera LL(1) lub LALR(1) oraz potrafi zaimportować dowolny ciąg znaków w celu sprawdzenia poprawności z tą gramatyką.
Cele edukacyjne to głębokie zrozumienie teorii języków formalnych, reprezentacja gramatyk, algorytmika wyznaczania zbiorów First i Follow oraz automatyczna generacja kodu/tabel parsujących.

**Wymagane funkcje:**
- **Parser specyfikacji gramatyki:** Parsowanie plików `.ebnf` definiujących reguły produkcji języka (np. `Expr ::= Term Expr'`).
- **Wyznaczanie zbiorów First i Follow:** Matematyczny algorytm rekurencyjnego przeszukiwania powiązań symboli nieterminalnych w celu wyznaczenia zbiorów First (pierwszych znaków) i Follow (znaków następujących).
- **Generowanie tabeli sterującej parsera:** Konstrukcja dwuwymiarowej tabeli LL(1) (lub LALR(1)) mapującej aktualny stan parsera i symbol wejściowy na odpowiednią regułę produkcji.
- **Ewaluator składni (Parser Run):** Silnik parsera sterowany wygenerowaną tabelą i stosem, sprawdzający poprawność ciągu znaków i budujący drzewo rozbioru składniowego (Parse Tree).

**Porady implementacyjne i dobre praktyki:**
Zaimplementuj symbole gramatyki jako rekord `Symbol` posiadający flagę czy jest terminalny (np. literały, liczby) czy nieterminalny (reguły złożone). Przy wyliczaniu zbiorów First i Follow używaj algorytmów punktu stałego (Fixed-point iteration) – pętla wykonuje obliczenia tak długo, jak długo zbiory powiększają się o nowe elementy. Zabezpiecz parser przed lewostronną rekurencją (Left Recursion), która w parserach LL(1) prowadzi do nieskończonej pętli stosu, i zaimplementuj prosty algorytm eliminacji lewostronnej rekurencji.
Wzorzec projektowy: *Interpreter*, *Builder*, *Flyweight*.
