## 198. Serwer RadSec TLS z dynamiczną dystrybucją kluczy PAC (mTLS EAP-FAST RadSec Server)

**Szczegółowy opis i cele edukacyjne:**
Uwierzytelnianie EAP-FAST opiera się na poświadczeniach PAC (Protected Access Credential). Najsłabszym punktem tego systemu jest faza początkowa (In-Band Provisioning), w której klient nie posiada jeszcze klucza PAC i musi go pobrać od serwera. Jeśli faza ta opiera się na słabych metodach (np. anonimowym Diffie-Hellmanie), jest narażona na ataki typu Man-in-the-Middle (MitM). Najbezpieczniejszym rozwiązaniem klasy Enterprise jest dynamiczne udostępnianie PAC wewnątrz tunelu TLS uwierzytelnionego za pomocą mTLS (Mutual TLS) z certyfikatem jednorazowym lub korporacyjnym, po czym codzienne szybkie uwierzytelnianie odbywa się już wyłącznie przy użyciu pobranego PAC (bez używania certyfikatów).
Projekt polega na rozbudowaniu serwera RadSec o hybrydowe uwierzytelnianie mTLS i EAP-FAST z dynamiczną dystrybucją i automatyczną rotacją kluczy PAC.
Cele edukacyjne to hybrydowe systemy bezpieczeństwa sieci bezprzewodowych, dynamiczna kryptografia symetryczno-asymetryczna, zarządzanie łańcuchami zaufania certyfikatów w locie, oraz zautomatyzowana rotacja kluczy kryptograficznych.

**Wymagane funkcje:**
- **Dynamiczne mTLS Provisioning:** Serwer zestawia tunel TLS EAP-FAST wymagający obustronnej weryfikacji certyfikatów (mTLS). Wewnątrz tego wysoce bezpiecznego tunelu serwer generuje i przesyła do klienta unikalny token PAC.
- **Szybkie uwierzytelnianie PAC-only (Faza 2):** Przy kolejnych połączeniach klient przesyła token PAC. Serwer weryfikuje go bez udziału certyfikatów (szybki uścisk dłoni na kluczu symetrycznym), co odciąża procesor serwera i skraca czas logowania.
- **Zautomatyzowana rotacja kluczy głównych (Master Key Rotation):** Serwer automatycznie generuje nowy klucz Master Key (służący do szyfrowania PAC) w zadanych interwałach czasowych, szyfrując nowe PAC-i nowym kluczem, jednocześnie zachowując stare klucze do czasu wygaśnięcia starych PAC-ów.
- **Wymiana i aktualizacja PAC w locie (PAC Refresh):** Gdy klient loguje się przy użyciu PAC, który wkrótce wygaśnie (np. za mniej niż 5 dni), serwer w locie generuje nowy token PAC i odsyła go wewnątrz tunelu przed zatwierdzeniem sesji.

**Porady implementacyjne i dobre praktyki:**
Do dynamicznego przesyłania danych w fazie provisioning wykorzystaj protokół TLV (Type-Length-Value) przesyłany wewnątrz tunelu TLS. Konfiguracja `X509ChainPolicy` powinna precyzyjnie sprawdzać flagi rozszerzeń klucza (Extended Key Usage - EKU) certyfikatów klienta pod kątem przeznaczenia do uwierzytelniania w sieciach 802.1X. Zaimplementuj wątek monitora w tle, który asynchronicznie dba o bezpieczne wymazywanie wygasłych kluczy Master Key z pamięci RAM (Zeroing memory) za pomocą metod `CryptographicOperations.ZeroMemory`, zapobiegając odczytaniu ich ze zrzutów pamięci (Memory Dumps) w przypadku ataku na serwer.
Wzorzec projektowy: *Credential Broker*, *Key Provisioning*, *Secure Memory Eraser*.
