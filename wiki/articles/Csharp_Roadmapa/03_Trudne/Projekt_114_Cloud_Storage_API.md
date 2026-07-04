## 114. Integracja Chmurowego Składowania Plików AWS S3 / Azure (Cloud Storage API)

**Szczegółowy opis i cele edukacyjne:**
Zapisywanie plików przesłanych przez użytkowników bezpośrednio na dysku lokalnym serwera aplikacyjnego utrudnia skalowanie poziome (gdy uruchomimy 3 instancje aplikacji za load balancerem, plik zapisany na serwerze A będzie niewidoczny dla serwera B). Standardem w chmurze jest przechowywanie plików w dedykowanych usługach obiektowych (Object Storage), takich jak AWS S3 lub Azure Blob Storage.
Projekt polega na stworzeniu serwisu API do zarządzania mediami zintegrowanego z chmurą.
Cele edukacyjne to integracja z oficjalnym SDK (AWS SDK for .NET lub Azure SDK for .NET), asynchroniczny przesył dużych plików strumieniem w celu unikania przeciążenia pamięci serwera, generowanie bezpiecznych, tymczasowych linków dostępu (Pre-signed URLs / Shared Access Signatures - SAS), oraz wieloczęściowe przesyłanie plików (Multipart Upload) dla plików o rozmiarach rzędu gigabajtów.

**Wymagane funkcje:**
- **Asynchroniczny Upload i Download:** Uploadowanie plików bezpośrednio ze strumienia wejściowego żądania HTTP (`IFormFile.OpenReadStream()`) do chmury bez zapisywania pliku tymczasowego na dysku lokalnym serwera.
- **Generowanie linków tymczasowych (Pre-signed URLs):** Endpoint generujący unikalny adres URL (np. ważny przez 15 minut) pozwalający klientowi na pobranie prywatnego pliku bezpośrednio z AWS S3 / Azure z pominięciem serwera aplikacyjnego.
- **Multipart Upload (Duże pliki):** Implementacja procesu przesyłania dużych plików w mniejszych częściach (np. po 5MB), z możliwością wznawiania transferu po zerwaniu połączenia sieciowego.
- **Ujednolicony interfejs (Storage Abstraction):** Zaprojektowanie interfejsu `IStorageService`, co pozwala na bezproblemową zmianę dostawcy chmurowego (np. z AWS S3 na Azure Blob Storage) za pomocą jednej linijki konfiguracji w DI.

**Porady implementacyjne i dobre praktyki:**
Nigdy nie hardkoduj kluczy dostępowych (Access Key / Secret Key) w kodzie źródłowym. Wykorzystaj mechanizm zarządzania konfiguracją w .NET i pobieraj poświadczenia z pliku `appsettings.json` lub zmiennych środowiskowych. Podczas transferu plików dbaj o poprawne zwalnianie zasobów – strumienie wejściowe powinny być zamykane przy użyciu `using`. Przy generowaniu Pre-signed URL pamiętaj, że wygaśnięcie linku jest sprawdzane po stronie dostawcy chmury (np. AWS S3), więc nie musisz pisać żadnej logiki wygaszania po stronie swojego kodu.
Wzorzec projektowy: *Adapter (Adapter)*, *Factory (Fabryka)*.
