## 57. Asynchroniczny Serwer Czatu TCP/IP (Async TCP Chat Server)

**Szczegółowy opis i cele edukacyjne:**
Komunikacja sieciowa czasu rzeczywistego (Real-Time Communication) leży u podstaw systemów takich jak czaty, gry online czy systemy dystrybucji zdarzeń. Stworzenie własnego serwera TCP obsługującego wielu klientów jednocześnie to klasyczny test umiejętności sieciowych programisty.
Projekt polega na zaimplementowaniu w pełni asynchronicznego serwera czatu opartego na protokole TCP/IP, który pozwala na łączenie się klientów konsolowych, uwierzytelnianie, pisanie w pokojach tematycznych oraz wysyłanie wiadomości prywatnych.
Cele edukacyjne to niskopoziomowa obsługa sieci w C# za pomocą `TcpListener` oraz `TcpClient`, asynchroniczne pętle odczytu i zapisu strumieni sieciowych, zarządzanie listą aktywnych połączeń w środowisku wielowątkowym (zarządzanie współbieżnością) oraz obsługa nagłego rozłączania klientów (Resource cleanup).

**Wymagane funkcje:**
- **Asynchroniczny nasłuch i akceptacja:** Uruchomienie `TcpListener` nasłuchującego na wybranym porcie i akceptującego nowe połączenia asynchronicznie za pomocą `AcceptTcpClientAsync()`.
- **Wielowątkowa pętla klienta:** Każdy połączony klient jest obsługiwany w osobnym, nieblokującym zadaniu (`Task`) odczytującym wiadomości ze strumienia sieciowego.
- **Broadcast i routing wiadomości:** Rozsyłanie wiadomości do wszystkich zalogowanych użytkowników lub wiadomości prywatnych (Direct Messages) na podstawie analizy komend (np. `/msg nazwa_uzytkownika tekst`).
- **Pokoje rozmów (Chat Rooms):** Możliwość tworzenia i dołączania do pokoi tematycznych (np. `/join dotnet`, `/leave`), ze śledzeniem listy obecności.

**Porady implementacyjne i dobre praktyki:**
Zarządzaj listą klientów za pomocą `ConcurrentDictionary<string, TcpClient>`, gdzie kluczem jest unikalny pseudonim użytkownika. Strumienie sieciowe są z natury strumieniami surowych bajtów. Aby ułatwić sobie pracę z tekstem, opakuj strumień sieciowy `NetworkStream` w klasę `StreamReader` oraz `StreamWriter`. Pamiętaj, aby przy rozłączeniu klienta (np. zamknięcie aplikacji klienta lub utrata sieci rzucająca `IOException`) natychmiast zamknąć strumienie, wywołać `Dispose()` na obiekcie `TcpClient` oraz usunąć go ze słownika aktywnych klientów – zapobiegnie to wyciekom zasobów systemowych.
Wzorzec projektowy: *Mediator* (serwer jako centralny punkt dystrybucji wiadomości).
