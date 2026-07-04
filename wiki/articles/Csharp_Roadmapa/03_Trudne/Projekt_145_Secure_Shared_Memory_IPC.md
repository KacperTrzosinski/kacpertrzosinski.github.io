## 145. Szyfrowany Kanał IPC przez Pamięć Współdzieloną (Secure Shared Memory IPC)

**Szczegółowy opis i cele edukacyjne:**
Wysokowydajna komunikacja międzyprocesowa (IPC) przez pamięć współdzieloną (Shared Memory) jest niezwykle szybka, ale domyślnie mało bezpieczna – dowolny proces o odpowiednich uprawnieniach systemowych może wczytać zawartość pamięci RAM i podsłuchać przesyłane informacje. Bezpieczeństwo wymaga wdrożenia mechanizmów szyfrowania w locie (On-the-fly Encryption) bezpośrednio w pamięci oraz weryfikacji tożsamości procesów komunikujących się.
Projekt polega na stworzeniu bezpiecznego, szyfrowanego asynchronicznego kanału IPC opartego o pliki mapowane w pamięci.
Cele edukacyjne to zaawansowana kryptografia symetryczna (szyfrowanie AEAD - AES-GCM) w .NET, wdrożenie bezpiecznej wymiany kluczy (Key Exchange) za pomocą protokołu Diffiego-Hellmana (ECDH) w celu ustalenia wspólnego klucza sesyjnego, oraz weryfikacja tożsamości procesów po stronie systemu operacyjnego (Process Credential Verification).

**Wymagane funkcje:**
- **Bezpieczny uścisk dłoni (ECDH Key Exchange):** Proces nadawcy i odbiorcy generują pary kluczy publiczny/prywatny przy użyciu klasy `ECDiffieHellman` i wymieniają się kluczami publicznymi przez dedykowany, mały segment pamięci, wyznaczając wspólny klucz symetryczny sesji.
- **Szyfrowanie AES-GCM w locie:** Szyfrowanie pakietów danych przed ich zapisaniem do kolejki pamięci współdzielonej przy użyciu klasy `AesGcm` (zapewniającej zarówno poufność, jak i uwierzytelnienie integralności danych - AEAD) oraz deszyfrowanie po odczytaniu.
- **Weryfikacja procesu (Process Authenticator):** Przed zmapowaniem pamięci proces serwera weryfikuje identyfikator procesu klienta (PID), sprawdzając czy plik wykonywalny klienta jest podpisany odpowiednim certyfikatem oraz czy klient działa z uprawnieniami autoryzowanego użytkownika.
- **Odporność na ataki typu Replay (Anti-replay):** Dołączanie numerów sekwencyjnych i znaczników czasu (Timestamps) do zaszyfrowanego ładunku (Payload), zapobiegające powtórnemu wstrzykiwaniu wcześniej podsłuchanych pakietów binarnych.

**Porady implementacyjne i dobre praktyki:**
Do szyfrowania wykorzystaj nową klasę `System.Security.Cryptography.AesGcm` (dostępną od .NET Core 3.0 / .NET 5+), która jest zoptymalizowana sprzętowo i znacznie bezpieczniejsza niż tradycyjny tryb CBC, ponieważ automatycznie generuje tag uwierzytelniający (Authentication Tag) wykrywający jakąkolwiek modyfikację bajtów w pamięci współdzielonej. Pamiętaj o używaniu unikalnych wektorów inicjalizacyjnych (Nonce) dla każdej szyfrowanej wiadomości – najprościej zrealizować to za pomocą inkrementowanego licznika wiadomości.
Wzorzec projektowy: *Secure Channel*, *Proxy (Pełnomocnik)*, *Strategy*.
