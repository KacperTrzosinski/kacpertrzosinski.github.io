## 162. Serwer SSH z Interaktywną Powłoką i Własnym CLI (SSH Interactive Shell Server)

**Szczegółowy opis i cele edukacyjne:**
Udostępnianie pełnego dostępu do powłoki systemowej (np. bash, powershell) przez SSH niesie ryzyko przejęcia serwera. Bezpiecznym i kontrolowanym rozwiązaniem stosowanym w routerach, przełącznikach czy konsolach administracyjnych dedykowanych systemów jest udostępnienie przez SSH własnej, zamkniętej powłoki interaktywnej (Custom Shell / Restricted Shell), która ogranicza użytkownika wyłącznie do predefiniowanego zestawu poleceń administracyjnych.
Projekt polega na stworzeniu w C# serwera SSH na bazie gniazd sieciowych, który po zalogowaniu otwiera interaktywną powłokę tekstową w oknie terminala klienta.
Cele edukacyjne to niskopoziomowa obsługa protokołu SSH (sesje typu `shell` oraz `pty` - Pseudo-Terminal), obsługa formatowania tekstu za pomocą kodów kontrolnych ANSI/VT100 (kolorowanie tekstu, sterowanie kursorem), oraz napisanie parsera i interpretera komend tekstowych działającego w czasie rzeczywistym z obsługą historii poleceń i autouzupełniania klawiszem Tab.

**Wymagane funkcje:**
- **Inicjalizacja terminala pseudo-typowego (PTY):** Negocjacja rozmiaru okna terminala (szerokość/wysokość w kolumnach) i obsługa dynamicznej zmiany rozmiaru okna przez klienta.
- **Interaktywna pętla powłoki (Interactive Loop):** Przetwarzanie wejścia znak po znaku (Raw input mode) – serwer odczytuje każdy wciśnięty klawisz, co pozwala na obsługę klawiszy strzałek (poruszanie kursorem, przeglądanie historii komend) oraz klawisza Backspace (usuwanie znaków).
- **Zintegrowany silnik autouzupełniania (Autocomplete & History):** Obsługa klawisza Tab dopasowująca wpisywane komendy do predefiniowanej listy oraz historia poleceń dostępna klawiszami strzałek w górę i w dół.
- **Zarządzanie sesją i komendami:** Obsługa autorskich poleceń diagnostycznych (np. `status`, `logs`, `restart-service <name>`, `exit`), z możliwością nadawania poziomów uprawnień użytkownikom (Read-Only vs Administrator).

**Porady implementacyjne i dobre praktyki:**
W celu wysyłania komend sterujących terminalem (np. czyszczenie ekranu, zmiana koloru czcionki, przesuwanie kursora) wykorzystaj sekwencje ucieczki ANSI (ANSI Escape Codes). Przykładowo, ciąg `\x1b[31m` zmienia kolor tekstu na czerwony, a `\x1b[2J\x1b[H` czyści ekran i przenosi kursor do lewego górnego rogu. Pamiętaj, aby przy odczytywaniu surowych znaków z gniazda poprawnie rozpoznawać sekwencje klawiszy funkcyjnych (np. strzałka w górę wysyła sekwencję bajtów `\x1b[A`).
Wzorzec projektowy: *Command (Polecenie)*, *State (Stan)*, *Interpreter*.
