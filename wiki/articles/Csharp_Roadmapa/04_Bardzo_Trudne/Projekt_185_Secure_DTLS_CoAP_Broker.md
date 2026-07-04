## 185. Silnik Kolejek CoAP over Secure DTLS z Weryfikacją Klienta (Secure DTLS CoAP Broker)

**Szczegółowy opis i cele edukacyjne:**
Bezpieczeństwo sieci IoT w standardzie przemysłowym wymaga nie tylko szyfrowania transmisji, ale również silnej autoryzacji urządzeń końcowych. W protokole CoAP over secure DTLS (coaps) najlepszą praktyką jest dwustronna weryfikacja certyfikatów kryptograficznych (Mutual TLS / mTLS). Serwer weryfikuje certyfikat urządzenia (np. sensora), a sensor weryfikuje certyfikat serwera, co chroni sieć przed podłączeniem złośliwych urządzeń (Rogue Nodes). Ponadto, ze względu na specyfikę UDP, system musi radzić sobie z atakami powtórzenia pakietów (Anti-Replay Attack).
Projekt polega na rozbudowaniu serwera DTLS CoAP o obsługę mTLS, zaawansowane zarządzanie infrastrukturą klucza publicznego (PKI) oraz filtry anty-powtórzeniowe.
Cele edukacyjne to implementacja mTLS nad UDP (Mutual DTLS), weryfikacja łańcuchów certyfikatów klienta (X509 Chain Verification), zarządzanie czarnymi listami certyfikatów (CRL - Certificate Revocation List), oraz wdrożenie kryptograficznego bufora przesuwnego (Sliding Window Anti-Replay) do ochrony przed replay-attack.

**Wymagane funkcje:**
- **Obsługa Mutual DTLS (mTLS):** Serwer żąda od klienta przesłania certyfikatu cyfrowego podczas uścisku dłoni (Certificate Request) i asynchronicznie przesyła własny certyfikat.
- **Weryfikacja certyfikatów PKI (Certificate Chain Validator):** Implementacja asynchronicznej weryfikacji podpisu certyfikatu klienta za pomocą głównego certyfikatu urzędu certyfikacji (CA Certificate). Sprawdzanie dat ważności oraz obsługa sprawdzania list unieważnionych certyfikatów (CRL).
- **Zabezpieczenie przed atakami powtórzenia (Anti-Replay Window):** Zaimplementowanie algorytmu okna przesuwnego (Sliding Window) o rozmiarze $W$ (np. 64 pakiety). Serwer śledzi najwyższy odebrany numer sekwencyjny pakietu DTLS $S_{max}$. Pakiety o numerze $S < S_{max} - W$ są odrzucane, a pakiety wewnątrz okna są sprawdzane pod kątem duplikatów przy użyciu maski bitowej.
- **Mapowanie tożsamości klienta (Identity Mapping):** Po pomyślnym uwierzytelnieniu, system odczytuje nazwę pospolitą (Common Name - CN) z certyfikatu klienta (np. `sensor-01.local`) i automatycznie mapuje ją jako właściciela tematów i subskrypcji CoAP Observe (autoryzacja na bazie tożsamości).

**Porady implementacyjne i dobre praktyki:**
Weryfikację łańcuchów certyfikatów w C# można zrealizować za pomocą klasy `X509Chain` z przestrzeni `System.Security.Cryptography.X509Certificates`. Możesz skonfigurować parametry weryfikacji (np. wyłączyć sprawdzanie online CRL w środowiskach offline za pomocą `X509ChainPolicy.RevocationMode = X509RevocationMode.NoCheck`). Algorytm okna przesuwnego dla Anti-Replay jest kluczowy w DTLS, ponieważ UDP nie gwarantuje dostarczenia pakietów w kolejności – pakiety lekko opóźnione w czasie (w granicach rozmiaru okna $W$) muszą być dopuszczane, ale pakiety już raz przetworzone muszą być natychmiast odrzucane, co chroni transakcje przed ponownym wykonaniem.
Wzorzec projektowy: *Mutual TLS Pattern*, *Sliding Window Anti-Replay Filter*, *Security Chain*.
