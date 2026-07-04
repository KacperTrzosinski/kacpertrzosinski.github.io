## 174. Szyfrowany Priorytetowy Bufor Ring Buffer IPC (Secure Priority Ring Buffer IPC)

**Szczegółowy opis i cele edukacyjne:**
Bezpieczna i szybka komunikacja międzyprocesowa w środowiskach typu Enterprise (np. komunikacja agentów bezpieczeństwa z demonem systemowym) wymaga jednoczesnego wdrożenia priorytetyzacji wiadomości (aby krytyczne alerty wyprzedzały zwykłe logi), bezblokowej synchronizacji (aby zapewnić minimalne opóźnienia i brak wąskich gardeł), oraz silnego szyfrowania w locie (aby chronić dane przed odczytaniem przez inne złośliwe procesy w systemie).
Projekt polega na stworzeniu w C# od zera zaawansowanej biblioteki łączącej technologię pamięci współdzielonej, szyfrowania symetrycznego AES-GCM, wymiany kluczy ECDH oraz bezblokowej wielopoziomowej kolejki Ring Buffer.
Cele edukacyjne to integracja bezpiecznej wymiany kluczy (Diffie-Hellman) na współdzielonej pamięci, ultrawydajna bezblokowa synchronizacja producentów i konsumentów w strukturach priorytetowych, oraz kryptograficzne zabezpieczanie danych zero-alokacyjnymi metodami (zapis bezpośrednio do wskaźników).

**Wymagane funkcje:**
- **Wielopoziomowy bezblokowy Ring Buffer w pamięci:** Kilka niezależnych kolejek kołowych (dla różnych priorytetów) zsynchronizowanych bezblokowo (algorytm MPMC z atomowymi numerami sekwencyjnymi).
- **Automatyczna wymiana kluczy sesyjnych (ECDH handshake):** Przy inicjalizacji kanału procesy wymieniają klucze publiczne przez dedykowany obszar pamięci współdzielonej przy użyciu krzywych eliptycznych, generując wspólny klucz AES.
- **Szyfrowanie AEAD (AES-GCM) zero-alokacyjne:** Szyfrowanie ładunku binarnego wiadomości za pomocą klasy `AesGcm`. Dane wejściowe, wyjściowe oraz klucze są przekazywane jako wskaźniki (`byte*` i `Span<byte>`), co zapobiega powstawaniu niezaszyfrowanych kopii wiadomości w stercie RAM platformy .NET.
- **Ochrona przed atakami replay i modyfikacją danych:** Każda zaszyfrowana wiadomość zawiera wewnątrz zintegrowany znacznik czasu, losową sól (Nonce) oraz numer sekwencyjny, weryfikowany po odszyfrowaniu (wykrycie retransmisji starych pakietów).

**Porady implementacyjne i dobre praktyki:**
Szyfrowanie AES-GCM wymaga podania bufora wejściowego, wyjściowego, klucza, wektora inicjalizacyjnego (Nonce) o długości 12 bajtów oraz tagu uwierzytelniającego o długości 16 bajtów. Aby zaimplementować to zero-alokacyjnie, stwórz strukturę ramki wiadomości w pamięci współdzielonej, w której pierwsze 12 bajtów to Nonce, kolejne 16 bajtów to Tag, a pozostała część to zaszyfrowany Payload. Użycie metod `AesGcm.Encrypt` i `AesGcm.Decrypt` przyjmujących jako argumenty `ReadOnlySpan<byte>` i `Span<byte>` pozwala na operowanie bezpośrednio na pamięci zmapowanej na dysku (za pomocą wskaźników), co eliminuje narzut alokacji tablic bajtowych (`new byte[]`) w GC.
Wzorzec projektowy: *Secure Channel*, *MPMC Priority Queue*, *Diffie-Hellman Key Exchange*.
