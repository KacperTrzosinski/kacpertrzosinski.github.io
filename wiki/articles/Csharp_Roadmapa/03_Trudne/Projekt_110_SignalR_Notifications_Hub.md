## 110. System Powiadomień Czasu Rzeczywistego z SignalR (SignalR Notifications Hub)

**Szczegółowy opis i cele edukacyjne:**
Powiadamianie użytkowników o zdarzeniach w systemie (np. nowe powiadomienie, zmiana statusu zamówienia, wiadomość od innego użytkownika) w czasie rzeczywistym wymaga utrzymywania stałego połączenia dwukierunkowego między klientem (przeglądarką) a serwerem. W technologii .NET standardem do tego celu jest biblioteka `SignalR`.
Projekt polega na stworzeniu systemu powiadomień w czasie rzeczywistym z obsługą autoryzacji, grupowaniem połączeń i automatyczną synchronizacją stanu.
Cele edukacyjne to wdrożenie protokołów komunikacji dwukierunkowej (WebSockets, Server-Sent Events, Long Polling), tworzenie i zarządzanie Hubami SignalR, integrowanie autoryzacji opartej o tokeny JWT z połączeniem WebSocket, oraz skalowanie SignalR za pomocą Redis Backplane w architekturze rozproszonej.

**Wymagane funkcje:**
- **Hub powiadomień (Notifications Hub):** Implementacja klasy `NotificationHub` dziedziczącej po `Hub` z metodami wysyłania powiadomień do konkretnego użytkownika (`Clients.User(userId)`), grupy (`Clients.Group(groupName)`) lub wszystkich.
- **Autoryzacja połączeń SignalR:** Konfiguracja autoryzacji JWT Bearer. Ponieważ WebSockets nie wspierają nagłówków HTTP przy nawiązywaniu połączenia w przeglądarkach, system musi wyodrębniać token JWT przesyłany w parametrze Query String (`?access_token=...`).
- **Grupowanie połączeń (Connection Groups):** Automatyczne dodawanie i usuwanie połączeń użytkownika do grup (np. grupa powiązana z konkretnym projektem) w metodach `OnConnectedAsync` oraz `OnDisconnectedAsync`.
- **Redis Backplane (Skalowanie poziome):** Integracja z Redisem za pomocą biblioteki `Microsoft.AspNetCore.SignalR.StackExchangeRedis`, co pozwala na synchronizację wiadomości między wieloma instancjami serwera (użytkownik podłączony do serwera A otrzyma wiadomość wysłaną przez serwer B).

**Porady implementacyjne i dobre praktyki:**
Do mapowania połączeń na identyfikatory użytkowników wykorzystaj wbudowany mechanizm `IUserIdProvider`, który domyślnie parsuje roszczenie `ClaimTypes.NameIdentifier` z tokenu JWT. Zabezpiecz serwer przed wyciekiem zasobów: SignalR automatycznie usuwa połączenia po rozłączeniu, ale jeśli przechowujesz własne mapowania połączeń w pamięci (np. `ConcurrentDictionary`), upewnij się, że sprzątasz je w metodzie `OnDisconnectedAsync`. Do przesyłania wiadomości w tle używaj interfejsu `IHubContext<NotificationHub>`, co pozwala na wysyłanie powiadomień z poziomu serwisów biznesowych czy demonów tła (Background Services) niezależnie od samych kontrolerów.
Wzorzec projektowy: *Publish-Subscribe (Pub-Sub)*, *Observer (Obserwator)*.
