## 120. Dynamiczne Zarządzanie Konfiguracją i Vault (Secure Config Vault API)

**Szczegółowy opis i cele edukacyjne:**
Bezpieczne zarządzanie konfiguracją i sekretami (hasła do baz, klucze API) to kluczowy wymóg bezpieczeństwa w systemach Enterprise. Zapisywanie sekretów w postaci jawnego tekstu w plikach konfiguracyjnych `appsettings.json` grozi ich wyciekiem w przypadku przejęcia repozytorium kodu.
Projekt polega na stworzeniu aplikacji integrującej się z bezpiecznym repozytorium sekretów (np. Azure Key Vault lub HashiCorp Vault) przy użyciu oficjalnego SDK.
Cele edukacyjne to konfiguracja dostawców konfiguracji w .NET (`ConfigurationProvider`), dynamiczne odczytywanie zmian konfiguracji bez restartu aplikacji przy użyciu interfejsu `IOptionsSnapshot<T>` i `IOptionsMonitor<T>`, oraz bezpieczne uwierzytelnianie bez użycia haseł za pomocą mechanizmu tożsamości zarządzanej (Managed Identity) w chmurze.

**Wymagane funkcje:**
- **Integracja z Vault SDK:** Połączenie aplikacji z chmurowym Azure Key Vault (lub lokalnym HashiCorp Vault) i pobieranie sekretów na etapie startu aplikacji przy użyciu biblioteki `Azure.Identity` i `Azure.Security.KeyVault.Secrets`.
- **Custom Configuration Provider:** Napisanie własnego dostawcy konfiguracji (`IConfigurationSource` oraz `ConfigurationProvider`), który integruje się z niestandardowym źródłem konfiguracji (np. bazą danych SQLite) i mapuje dane na hierarchię konfiguracji w .NET.
- **Dynamiczne odświeżanie (Dynamic Reload):** Konfiguracja powiadamiania o zmianie wartości ustawień i automatyczne przeładowanie parametrów działania aplikacji w locie (np. zmiana stóp procentowych lub parametrów limitów bez zatrzymywania serwera) przy użyciu wzorca `IOptionsMonitor<T>`.
- **Szyfrowanie konfiguracji w bazie:** Usługa zapisująca wrażliwe klucze konfiguracyjne w lokalnej bazie danych, szyfrując je algorytmem AES z kluczem pobieranym bezpiecznie z systemu Key Vault.

**Porady implementacyjne i dobre praktyki:**
W .NET konfiguracja opiera się na hierarchicznym systemie dostawców. Kolejność rejestracji dostawców w `Program.cs` ma znaczenie – dostawcy zarejestrowani później nadpisują wartości ustawione przez wcześniejszych dostawców. Zawsze rejestruj Vault na samym końcu, co pozwoli na nadpisanie lokalnych wartości deweloperskich z `appsettings.json` przez rzeczywiste sekrety pobrane z chmury na produkcji. Do wstrzykiwania parametrów konfiguracyjnych w klasach logiki biznesowej używaj interfejsu `IOptionsSnapshot<T>` (dla cyklu życia scoped - odświeżany na każde żądanie HTTP) lub `IOptionsMonitor<T>` (dla singletonów).
Wzorzec projektowy: *Provider (Dostawca)*, *Proxy (Pełnomocnik)*, *Options Pattern*.
