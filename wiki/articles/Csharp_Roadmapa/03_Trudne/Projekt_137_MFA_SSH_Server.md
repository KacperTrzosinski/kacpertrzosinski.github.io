## 137. Serwer SSH z Obsługą Autoryzacji Dwuetapowej MFA (MFA SSH Server)

**Szczegółowy opis i cele edukacyjne:**
Tradycyjna autoryzacja hasłem w SSH jest wrażliwa na ataki typu Brute-Force. Zabezpieczenie dostępu do krytycznych terminali systemowych wymaga wdrożenia Autoryzacji Wieloskładnikowej (Multi-Factor Authentication - MFA / 2FA).
Projekt polega na stworzeniu w C# od zera asynchronicznego serwera SSH (nasłuchującego na porcie TCP 2222), który wymaga od klienta przejścia dwuetapowej weryfikacji: najpierw podania poprawnego hasła użytkownika, a następnie wpisania dynamicznego kodu jednorazowego (TOTP - Time-Based One-Time Password) wygenerowanego w aplikacji uwierzytelniającej na telefonie (np. Google Authenticator).
Cele edukacyjne to niskopoziomowa obsługa sesji SSH, autoryzacja keyboard-interactive, integracja z algorytmem TOTP (RFC 6238) oraz asynchroniczne zarządzenie sesją i bezpiecznym kanałem terminala.

**Wymagane funkcje:**
- **Silnik serwera SSH:** Nasłuch na gniazdach TCP, inicjalizacja sesji SSH, negocjacja algorytmów kryptograficznych (Key Exchange, Encryption). W tym projekcie zaleca się wykorzystanie gotowych bibliotek SSH do obsługi samego protokołu (np. biblioteki FxSsh lub integracja z systemowym daemonem), aby skupić się na logice MFA.
- **Autoryzacja Keyboard-Interactive:** Konfiguracja serwera tak, aby po udanej walidacji hasła zażądał dodatkowego kroku interaktywnego, wyświetlając klientowi w terminalu monit o wpisanie 6-cyfrowego kodu weryfikacyjnego.
- **Generowanie i walidacja TOTP:** Implementacja algorytmu TOTP generującego kody na podstawie tajnego klucza (Base32) i czasu systemowego (30-sekundowe okna czasowe).
- **Generator kodów QR:** Konsolowe narzędzie generujące kod QR (lub link) w formacie tekstowym ASCII, pozwalający na łatwe sparowanie nowej komórki użytkownika z aplikacją Google Authenticator.

**Porady implementacyjne i dobre praktyki:**
Algorytm TOTP bazuje na HMAC-SHA1. Wzór to: $TOTP(K) = HOTP(K, C)$, gdzie $C$ to liczba 30-sekundowych okresów, które upłynęły od epoki UNIX. Aby zapobiec problemom z rozbieżnością czasu zegara na telefonie klienta i serwerze (Clock Drift), zaimplementuj tolerancję czasu (Time window tolerance) – sprawdzaj kod TOTP dla aktualnego okna czasowego $C$ oraz okien sąsiednich ($C-1$ i $C+1$). Wykorzystane kody TOTP oznaczaj jako zużyte w bazie danych w celu ochrony przed atakami typu Replay.
Wzorzec projektowy: *Chain of Responsibility*, *Decorator*, *Strategy*.
