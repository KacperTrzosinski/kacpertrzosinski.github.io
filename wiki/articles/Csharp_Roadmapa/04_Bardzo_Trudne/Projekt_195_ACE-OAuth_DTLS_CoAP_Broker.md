## 195. Serwer CoAP DTLS z Autoryzacją Tokenami ACE-OAuth (ACE-OAuth DTLS CoAP Broker)

**Szczegółowy opis i cele edukacyjne:**
W wielkich rozproszonych wdrożeniach IoT (np. inteligentne miasta, sensoryka przemysłowa) sama weryfikacja certyfikatów mTLS (DTLS) to za mało – potrzebujemy precyzyjnego zarządzania uprawnieniami (Autoryzacja). Przykładowo, sensor A może mieć uprawnienie do publikacji na temat `/sensors/temp`, ale nie może odczytywać danych z `/config`. Standardem autoryzacji dla urządzeń o ograniczonych zasobach komunikujących się przez CoAP/DTLS jest ACE-OAuth (RFC 9200 / RFC 9201). Klient autoryzuje się w centralnym serwerze (Authorization Server), pobiera token dostępowy w formacie CBOR Web Token (CWT) podpisany kluczem kryptograficznym COSE, a następnie przesyła ten token do brokera CoAP w celu uzyskania dostępu do zasobów.
Projekt polega na zaimplementowaniu w C# od zera brokera CoAP DTLS zintegrowanego z frameworkiem autoryzacji ACE-OAuth.
Cele edukacyjne to niskopoziomowa praca z formatami binarnymi zoptymalizowanymi pod IoT: CBOR (Concise Binary Object Representation) oraz COSE (CBOR Object Signing and Encryption), walidacja i deszyfrowanie kryptograficznych tokenów dostępowych w locie, oraz kontrola dostępu (Access Control) na bazie uprawnień tokena.

**Wymagane funkcje:**
- **Autoryzacja ACE-OAuth (ACE-CoAP Profile):** Serwer CoAP DTLS udostępnia specjalny punkt końcowy `/authz`. Klient przesyła tam swój binarny token dostępowy (CWT) za pomocą żądania `POST` przed próbą dostępu do chronionych zasobów.
- **Parser i walidator CBOR Web Token (CWT - RFC 8392):** Dekodowanie binarnego formatu CBOR reprezentującego roszczenia (Claims) tokena (Issuer, Subject, Audience, Expiration, Scope/Permissions).
- **Weryfikacja podpisów COSE (CBOR Object Signing and Encryption - RFC 9052):** Tokeny CWT są podpisane podpisem cyfrowym COSE_Sign1 lub szyfrowane COSE_Encrypt0. Silnik brokera weryfikuje podpis kryptograficzny tokena przy użyciu klucza publicznego serwera autoryzacji (AS Public Key) za pomocą algorytmów ECDSA / Ed25519.
- **Kontrola dostępu na bazie Scope (Access Control Engine):** Po pomyślnej walidacji tokena, broker zapisuje skojarzone uprawnienia dla danej sesji DTLS. Każde kolejne żądanie (np. GET `/secure/data`) jest weryfikowane z zakresem uprawnień zapisanym w tokenie (Scope matching, np. `scope: "read /secure/data"`).

**Porady implementacyjne i dobre praktyki:**
Do pracy z formatem CBOR wykorzystaj klasy z przestrzeni `System.Formats.Cbor` (wprowadzone natywnie w nowszych wersjach platformy .NET), co gwarantuje wysoką wydajność i niskie zużycie pamięci. Tokeny CWT są odpowiednikiem tokenów JWT (JSON Web Tokens), lecz spakowanymi do ultrakompaktowej postaci binarnej. Podczas przesyłania tokena do `/authz`, broker po pomyślnej walidacji kojarzy token z kluczem sesyjnym DTLS (Security Association) i adresem IP klienta, dzięki czemu kolejne zapytania nie muszą ponownie przesyłać tokena, co oszczędza pasmo sieciowe UDP.
Wzorzec projektowy: *Token Validation Pattern*, *Security Association*, *Interceptor (Przechwytywacz)*.
