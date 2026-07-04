## 105. Autoryzacja i Uwierzytelnianie JWT z Rolami (JWT Auth REST API)

**Szczegółowy opis i cele edukacyjne:**
Bezpieczeństwo punktów końcowych (endpoints) w bezstanowych (stateless) architekturach Web API najczęściej opiera się na tokenach JWT (JSON Web Token). Token JWT zawiera zaszyfrowany i podpisany cyfrowo ładunek (claims) niosący informacje o tożsamości użytkownika i jego uprawnieniach.
Projekt polega na zaimplementowaniu w usłudze ASP.NET Core Web API pełnego systemu uwierzytelniania i autoryzacji opartego o JWT.
Cele edukacyjne to zrozumienie struktury tokenów JWT (header, payload, signature), konfiguracja biblioteki uwierzytelniania Bearer w .NET (`Microsoft.AspNetCore.Authentication.JwtBearer`), generowanie tokenów z użyciem kluczy symetrycznych (`SymmetricSecurityKey`), wdrożenie autoryzacji opartej o role (Role-based) i roszczenia (Claims-based / Policy-based), oraz bezpieczny mechanizm odświeżania tokenów (Refresh Tokens) w bazie danych.

**Wymagane funkcje:**
- **Endpoint logowania i generowania JWT:** Logowanie użytkownika, walidacja hasła, pobieranie roli i generowanie podpisanego tokenu JWT (z ustawionym czasem ważności, np. 15 minut).
- **Konfiguracja autoryzacji (JWT Bearer):** Integracja middleware autoryzacji w pliku `Program.cs`, weryfikująca poprawność podpisów przychodzących tokenów w nagłówku `Authorization: Bearer <token>`.
- **Zabezpieczenie tras (Roles & Policies):** Użycie atrybutu `[Authorize]` z przypisaniem ról (np. `[Authorize(Roles = "Admin")]`) oraz tworzenie niestandardowych polityk autoryzacji (Policy-based Authorization, np. wymagany wiek > 18 lat).
- **Mechanizm Refresh Token:** Wdrażanie wzorca odświeżania: serwer zwraca parę `(JwtToken, RefreshToken)`. Refresh token jest długożyciowy, zapisywany w bazie i służy do generowania nowego JwtTokenu bez ponownego podawania hasła przez użytkownika.

**Porady implementacyjne i dobre praktyki:**
Klucz używany do podpisania tokenu JWT (Secret Key) musi mieć odpowiednią długość (minimum 256 bitów / 32 znaki dla algorytmu HS256) i być przechowywany w bezpieczny sposób (np. w plikach konfiguracyjnych `appsettings.json` niezatwierdzanych do repozytorium gita, a na środowiskach produkcyjnych jako zmienne środowiskowe lub usługa Azure Key Vault). Do sprawdzania ról użytkownika wykorzystaj systemową przestrzeń roszczeń (`ClaimTypes.Role`). Refresh tokeny przechowuj w bazie danych z powiązaniem do identyfikatora użytkownika, datą wygasania oraz flagą informującą, czy token został już użyty lub unieważniony (ochrona przed atakami typu token replay).
Wzorzec projektowy: *Token Provider*, *Security Proxy*.
