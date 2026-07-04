## 122. Autoryzacja API z Użyciem Serwera Keycloak (OAuth2 Keycloak API)

**Szczegółowy opis i cele edukacyjne:**
Utrzymywanie własnej bazy użytkowników i haseł bezpośrednio w aplikacji niesie ryzyko bezpieczeństwa. W architekturach Enterprise uwierzytelnianie (Authentication) i autoryzację (Authorization) deleguje się do zewnętrznego, wyspecjalizowanego systemu klasy IAM (Identity and Access Management), takiego jak otwartoźródłowy serwer `Keycloak`.
Projekt polega na zintegrowaniu ASP.NET Core Web API z serwerem Keycloak przy użyciu protokołów OAuth2 oraz OpenID Connect (OIDC).
Cele edukacyjne to konfiguracja przepływu autoryzacji (Authorization Code Flow with PKCE), weryfikacja tokenów JWT wystawianych przez serwer Keycloak (w oparciu o endpointy metadanych OIDC - `Well-Known Configuration`), oraz dynamiczne mapowanie ról i uprawnień zdefiniowanych w panelu Keycloak na roszczenia (Claims) w aplikacji .NET.

**Wymagane funkcje:**
- **Integracja OpenID Connect (OIDC):** Konfiguracja middleware JWT Bearer w pliku `Program.cs` pobierająca parametry weryfikacji sygnatur (klucze publiczne) automatycznie z endpointu Keycloak: `http://<keycloak-server>/realms/<realm-name>/.well-known/openid-configuration`.
- **Zabezpieczenie punktów końcowych (Web API protection):** Zablokowanie nieautoryzowanego dostępu do kontrolerów z automatycznym parsowaniem ról przypisanych klientowi w Keycloaku (zarówno na poziomie ról klienta, jak i ról globalnych realm).
- **Custom Claims Transformation:** Napisanie klasy implementującej `IClaimsTransformation` w celu przepakowania specyficznej struktury ról JSON z tokenu Keycloaka (`resource_access.<client-id>.roles`) na standardowe roszczenia roli .NET (`ClaimTypes.Role`).
- **Endpoint weryfikacji sesji (Token Introspection):** Opcjonalna implementacja weryfikacji tokenów online za pomocą zapytania typu backchannel do endpointu introspekcji Keycloak w celu natychmiastowego wykrywania wylogowania lub unieważnienia konta użytkownika.

**Porady implementacyjne i dobre praktyki:**
Keycloak można uruchomić lokalnie z Dockera za pomocą komendy `docker run -p 8080:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:latest start-dev`. Po stworzeniu nowego obszaru (Realm) i klienta (Client) w panelu Keycloaka, w konfiguracji .NET podaj parametry `Authority` oraz `Audience`. Pamiętaj, aby zawsze włączać flagę weryfikacji emitenta (`ValidateIssuer = true`) oraz weryfikacji czasu ważności tokenu (`ValidateLifetime = true`) dla ochrony przed nieautoryzowanym dostępem.
Wzorzec projektowy: *Security Gateway*, *Claims Provider*.
