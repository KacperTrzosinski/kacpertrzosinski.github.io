## 82. Uproszczony Klient SSH i Serwer SFTP (Console SSH SFTP Client)

**Szczegółowy opis i cele edukacyjne:**
Bezpieczna administracja serwerami opiera się na protokołach SSH (Secure Shell) oraz SFTP (SSH File Transfer Protocol). Zapewniają one bezpieczne szyfrowane połączenie i przesył danych.
Projekt polega na stworzeniu konsolowego klienta SSH umożliwiającego wykonywanie poleceń powłoki na zdalnej maszynie oraz serwera/klienta SFTP do bezpiecznego pobierania plików, opartego na uznanej bibliotece NuGet `SSH.NET`.
Cele edukacyjne to integracja z zaawansowaną biblioteką sieciową SSH, praca z kluczami prywatnymi/publicznymi w formatach OpenSSH/PPK (uwierzytelnianie kluczem), zarządzanie asynchronicznymi kanałami SSH (Interactive Shell sessions), oraz obsługa transferu plików przez SFTP z monitorowaniem postępu.

**Wymagane funkcje:**
- **Uwierzytelnianie hasłem i kluczem prywatnym:** Logowanie do zdalnego serwera z obsługą tradycyjnych haseł oraz zaawansowanych plików kluczy prywatnych (z opcją podania passphrases).
- **Interaktywna powłoka SSH (Terminal CLI):** Stworzenie sesji powłoki pozwalającej na asynchroniczny odczyt wejścia użytkownika i wysyłanie poleceń do serwera zdalnego z poprawnym wyświetlaniem odpowiedzi (emulacja terminala).
- **Przeglądarka plików SFTP:** Listowanie katalogów zdalnych, pobieranie plików na dysk lokalny oraz wgrywanie (upload) plików przy użyciu metod asynchronicznych z obliczaniem prędkości transferu.
- **Bezpieczne połączenie z tunelowaniem:** Implementacja prostego przekierowania portów (Port Forwarding / SSH Tunneling) z poziomu kodu C#.

**Porady implementacyjne i dobre praktyki:**
Do realizacji projektu użyj biblioteki `Renci.SshNet` zaimportowanej przez menedżer pakietów NuGet. Pamiętaj, aby obiekty `SshClient` oraz `SftpClient` otwierać wewnątrz bloków `using`. Podczas asynchronicznego pobierania pliku przez SFTP wykorzystaj metodę `BeginDownloadFile` lub przeciążenia przyjmujące delegat akcji `Action<ulong>` raportujący liczbę przesłanych bajtów, co pozwoli na dynamiczne aktualizowanie paska postępu w konsoli. Zabezpiecz sesję powłoki SSH przed nagłym zerwaniem połączenia sieciowego.
Wzorzec projektowy: *Adapter (Adapter)*, *Facade (Fasada)*.
