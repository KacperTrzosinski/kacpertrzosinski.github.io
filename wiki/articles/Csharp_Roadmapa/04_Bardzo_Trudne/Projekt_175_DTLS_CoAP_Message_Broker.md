## 175. Silnik Kolejek CoAP over DTLS z Szyfrowaniem (DTLS CoAP Message Broker)

**Szczegółowy opis i cele edukacyjne:**
Wdrożenie protokołu CoAP w środowiskach produkcyjnych (np. systemy automatyki budynkowej, urządzenia medyczne IoT) niesie duże ryzyko ataków podsłuchu i fałszowania danych przesyłanych przez UDP. Standardem zapewniającym bezpieczeństwo na poziomie transportowym dla protokołów opartych o UDP jest DTLS (Datagram Transport Layer Security - RFC 7390 / RFC 9146). DTLS to adaptacja protokołu TLS dostosowana do natury bezpołączeniowych pakietów UDP (obsługa gubienia i zamiany kolejności pakietów podczas uścisku dłoni).
Projekt polega na rozbudowaniu napisanego wcześniej brokera CoAP o pełne wsparcie dla szyfrowania DTLS.
Cele edukacyjne to głębokie zrozumienie protokołu DTLS, obsługa asynchronicznej komunikacji UDP z szyfrowaniem, zarządzanie uściskiem dłoni DTLS (handshake retransmission, cookies do ochrony przed atakami DoS), oraz uwierzytelnianie klientów za pomocą certyfikatów X.509.

**Wymagane funkcje:**
- **Silnik nasłuchujący DTLS (DTLS Server over UDP):** Serwer nasłuchuje na porcie UDP 5684 (standardowy port secure CoAP - coaps), akceptuje pakiety i przeprowadza asynchroniczny uścisk dłoni DTLS.
- **Obsługa uścisku dłoni DTLS (Handshake Engine):** Ponieważ UDP nie gwarantuje dostarczenia pakietów, silnik DTLS musi zaimplementować mechanizm retransmisji wiadomości handshake w przypadku zagubienia pakietu (Timer-based retransmission) oraz poprawnie sortować pakiety na podstawie numerów sekwencyjnych DTLS (Epoch numbers).
- **Zabezpieczenie przed atakami DoS (HelloVerifyRequest):** Serwer weryfikuje tożsamość klienta na początku połączenia wysyłając pakiet `HelloVerifyRequest` zawierający ciasteczko (Cookie) wyliczone jako hasz adresu IP klienta i tajnej soli serwera, co zapobiega atakom typu IP Spoofing.
- **Szyfrowanie i deszyfrowanie pakietów CoAP:** Po udanym uścisku dłoni wszystkie pakiety CoAP Observe/Publish są przesyłane w postaci zaszyfrowanych rekordów DTLS Application Data.

**Porady implementacyjne i dobre praktyki:**
W bibliotece standardowej .NET brak jest wbudowanej, bezpośredniej klasy do obsługi serwera DTLS (w przeciwieństwie do `SslStream` dla TCP/TLS). Do zaimplementowania warstwy szyfrowania DTLS nad UDP wykorzystaj otwartoźródłowe biblioteki kryptograficzne (np. BouncyCastle w C#) lub zaimplementuj własny lekki wrapper kryptograficzny realizujący uścisk dłoni i szyfrowanie rekordów przy użyciu algorytmów z przestrzeni `System.Security.Cryptography`. Pamiętaj o regularnej zmianie soli serwera wykorzystywanej do generowania ciasteczek w celu podniesienia odporności systemu na ataki DoS.
Wzorzec projektowy: *Secure Gate*, *Proxy*, *Decorator*.
