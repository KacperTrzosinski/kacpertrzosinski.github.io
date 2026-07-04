## 40. Konsolowy Edytor Tekstowy z Cofaniem Zmian (Console Text Editor CLI)

**Szczegółowy opis i cele edukacyjne:**
Napisanie edytora tekstu działającego w terminalu (podobnego do uproszczonego Nano lub Vim) wymaga precyzyjnego zarządzania buforem tekstu, interpretacji surowych klawiszy wejściowych oraz śledzenia historii zmian w celu obsługi operacji Undo/Redo.
Projekt polega na stworzeniu interaktywnej aplikacji konsolowej.
Głównym celem edukacyjnym jest nauka niskopoziomowego odczytu klawiatury (`Console.ReadKey(true)`), pozycjonowania kursora na ekranie (`Console.SetCursorPosition`), zarządzania buforem tekstowym (reprezentowanym jako lista linii lub bufor szczelinowy - Gap Buffer) oraz implementacji klasycznego wzorca *Command* z wykorzystaniem stosu (`Stack<ICommand>`) do obsługi historii operacji cofania i ponawiania zmian (Undo/Redo).

**Wymagane funkcje:**
- **Interaktywny edytor w CLI:** Renderowanie tekstu z pliku, obsługa poruszania się kursorem za pomocą strzałek, edycja tekstu (wstawianie i usuwanie znaków za pomocą Backspace/Delete).
- **Własna struktura bufora (Gap Buffer or Line List):** Przechowywanie linii tekstu w pamięci z optymalnym wstawianiem znaków bez kopiowania całego dokumentu przy każdym kliknięciu klawisza.
- **System Undo/Redo (Wzorzec Command):** Każda akcja edycyjna (wstawienie znaku, usunięcie znaku, nowa linia) jest reprezentowana jako obiekt komendy posiadający metody `Execute()` i `Undo()`.
- **Wyszukiwanie tekstu (Find & Replace):** Wbudowany pasek komend (aktywowany np. skrótem Ctrl+F) pozwalający na wyszukanie słowa w tekście i podświetlenie go na ekranie.

**Porady implementacyjne i dobre praktyki:**
Przełącz konsolę w tryb bezpośredni za pomocą `Console.TreatControlCAsInput = true`, aby móc przechwytywać skróty klawiszowe (np. Ctrl+Z dla Undo, Ctrl+Y dla Redo, Ctrl+S dla zapisu pliku). Podczas renderowania tekstu na ekranie unikaj czyszczenia całej konsoli metodą `Console.Clear()` przy każdym znaku – powoduje to silne migotanie obrazu. Zamiast tego nadpisuj tylko zmodyfikowane linie lub użyj techniki podwójnego buforowania (Double Buffering) konsoli. Przechowuj historię komend w dwóch stosach: `undoStack` oraz `redoStack`. Wykonanie nowej akcji czyści stos `redoStack`.
Wzorzec projektowy: *Command (Polecenie)*, *Memento (Pamiątka)* (do zapisu stanów bufora).
