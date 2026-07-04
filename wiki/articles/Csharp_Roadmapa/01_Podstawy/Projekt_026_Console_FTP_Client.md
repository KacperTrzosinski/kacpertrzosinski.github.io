## 26. Uproszczony Klient FTP w Konsoli (Console FTP Client)

**Szczegółowy opis i cele edukacyjne:**
Transmisja plików przez sieć to klasyczny problem inżynieryjny. Projekt polega na stworzeniu uproszczonego klienta protokołu FTP (File Transfer Protocol) działającego w trybie konsoli tekstowej. Aplikacja powinna łączyć się ze wskazanym serwerem FTP, uwierzytelniać użytkownika, listować pliki w katalogu zdalnym, a także pobierać i wysyłać wybrane pliki na dysk.
Głównym celem edukacyjnym jest nauka niskopoziomowej komunikacji sieciowej za pomocą strumieni sieciowych (`NetworkStream`) i gniazd TCP (`TcpClient` lub `Socket`). Student dowiaduje się, jak działa protokół FTP (podział na kanał kontrolny i kanał danych w trybie aktywnym/pasywnym) oraz jak asynchronicznie przesyłać strumienie danych binarnych.

**Wymagane funkcje:**
- **Komunikacja tekstowa z serwerem (Command Channel):** Wysyłanie standardowych komend FTP (np. `USER`, `PASS`, `PORT`, `PASV`, `LIST`, `RETR`, `STOR`) na port 21 i parsowanie kodów odpowiedzi serwera (np. 220, 230, 150, 226).
- **Zarządzanie kanałem danych (Data Channel):** Implementacja trybu pasywnego (`PASV`), parsującego odpowiedź serwera w celu uzyskania adresu IP i numeru portu pomocniczego do przesyłu danych.
- **Pobieranie i wysyłanie plików:** Odczyt strumienia binarnego z kanału danych i zapisywanie go bezpośrednio do pliku na dysku (oraz operacja odwrotna dla wysyłania) z monitorowaniem postępu w procentach.
- **Zabezpieczenie przed timeoutami:** Obsługa timeoutów połączeń sieciowych i poprawne zamykanie gniazd w przypadku nagłego przerwania transferu.

**Porady implementacyjne i dobre praktyki:**
Do wysyłania i odbierania linii tekstowych na kanale kontrolnym użyj klas `StreamWriter` oraz `StreamReader` z domyślnym kodowaniem ASCII. Pamiętaj, aby po każdej komendzie wywołać metodę `Flush()`. Zwróć szczególną uwagę na asynchroniczny zapis danych binarnych – do przesyłania plików z jednego strumienia do drugiego idealnie nadaje się metoda `Stream.CopyToAsync` (lub jej odpowiednik z pętlą i własnym buforem np. 4096 bajtów), co zapobiega blokowaniu głównego wątku aplikacji. Wszelkie gniazda TCP i strumienie sieciowe muszą być zwalniane natychmiast po zakończeniu transmisji.
Wzorzec projektowy: *State (Stan)* (do śledzenia aktualnego statusu połączenia klienta: Niezalogowany, Autoryzacja, Zalogowany, TransferDanych).
