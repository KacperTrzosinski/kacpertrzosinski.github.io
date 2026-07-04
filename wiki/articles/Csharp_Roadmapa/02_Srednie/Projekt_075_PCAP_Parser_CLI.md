## 75. Narzędzie CLI do Analizy Plików Przechwyconych Pakietów PCAP (PCAP Parser CLI)

**Szczegółowy opis i cele edukacyjne:**
Analiza ruchu sieciowego to kluczowy element bezpieczeństwa i diagnostyki systemów. Pliki `.pcap` (Packet Capture) są standardem branżowym używanym przez programy takie jak Wireshark do zapisu surowych pakietów przesyłanych przez karty sieciowe.
Projekt polega na stworzeniu parsera plików PCAP w wersji CLI. Program wczytuje binarny plik z przechwyconym ruchem i dokonuje sekwencyjnego dekodowania warstw sieciowych: nagłówka pliku PCAP, nagłówków pakietów, ramki Ethernet, nagłówków IPv4/IPv6 oraz nagłówków protokołów warstwy transportowej (TCP/UDP).
Cele edukacyjne to zaawansowana praca z binarnymi strumieniami wejściowymi, mapowanie struktur bajtowych na typy C#, wyliczanie statystyk ruchu (przepustowość, top IP, sesje TCP) oraz zrozumienie podstaw działania sieci i protokołów TCP/IP na poziomie surowych bajtów.

**Wymagane funkcje:**
- **Parser nagłówka globalnego PCAP:** Odczyt magicznej liczby (Magic Number) w celu identyfikacji wersji formatu oraz kolejności bajtów (Little-Endian vs Big-Endian) w pliku.
- **Dekodowanie ramek Ethernet:** Ekstrakcja adresów MAC (źródłowy/docelowy) oraz identyfikacja typu protokołu wyższego poziomu (EtherType, np. IPv4).
- **Dekodowanie pakietów IP i warstwy transportowej:** Ekstrakcja adresów IP, identyfikacja protokołu (TCP/UDP), numerów portów oraz flag TCP (SYN, ACK, FIN, RST).
- **Analiza statystyk i wykresy:** Obliczanie całkowitej ilości danych, przepustowości sieci (bajty/sekundę) w czasie, top 10 adresów IP generujących największy ruch, oraz rekonstrukcja sesji TCP (wykrywanie połączeń i ich zamykania).

**Porady implementacyjne i dobre praktyki:**
Pliki PCAP mogą mieć rozmiary wielu gigabajtów. Pod żadnym pozorem nie wczytuj całego pliku do pamięci. Użyj klasy `BinaryReader` i czytaj plik sekwencyjnie. Struktura pliku PCAP składa się z globalnego nagłówka (24 bajty), po którym następują rekordy pakietów (każdy ma nagłówek rekordu o rozmiarze 16 bajtów, określający m.in. długość przechwyconych danych, a następnie surowe bajty ramki sieciowej). Wykorzystaj typy `ReadOnlySpan<byte>` do parsowania surowych bajtów pakietu bez alokowania dodatkowych tablic pośrednich, co zagwarantuje błyskawiczne działanie programu.
Wzorzec projektowy: *Chain of Responsibility (Łańcuch odpowiedzialności)* (gdzie dekodery kolejnych warstw: Ethernet -> IP -> TCP stanowią ogniwa łańcucha).
