## 69. Silnik Serializacji Własnych Protokołów Binarnych (Binary Protocol Serializer)

**Szczegółowy opis i cele edukacyjne:**
W komunikacji o niskich opóźnieniach (np. protokoły gier sieciowych, komunikacja z urządzeniami IoT, systemy High-Frequency Trading) tekstowe formaty takie jak JSON czy XML są zbyt duże i powolne w parsowaniu. Stosuje się wtedy dedykowane protokoły binarne o sztywnym układzie bitów i bajtów.
Projekt polega na stworzeniu własnego silnika do serializacji i deserializacji obiektów C# do/z surowych strumieni bajtów o z góry narzuconej strukturze binarnej.
Cele edukacyjne to niskopoziomowa manipulacja bitami (Bit Shifting, operatory bitowe `&`, `|`, `<<`, `>>`), praca z pamięcią niezarządzaną i wskaźnikami (słowo kluczowe `unsafe`, rzutowanie struktur przy użyciu `LayoutKind.Explicit` i `FieldOffset`), oraz optymalizacja zapisu binarnego za pomocą strumieni `BinaryWriter`/`BinaryReader` i klas typu `BitConverter`.

**Wymagane funkcje:**
- **Sztywny układ pamięci (Explicit Struct Layout):** Wykorzystanie atrybutu `[StructLayout(LayoutKind.Explicit)]` i definicja dokładnego położenia pól w bajtach w celu bezpośredniego rzutowania struktur C# na tablice bajtów (Zero-copy serialization).
- **Kompresja i pakowanie bitowe:** Metody pakujące flagi logiczne i małe liczby w pojedyncze bajty (np. 8 flag logicznych spakowanych w jeden bajt typu `byte` jako maska bitowa).
- **Zmienna długość pól (Varints):** Implementacja kodowania liczb o zmiennej długości (np. Variable-length quantity / Varint stosowany w Protocol Buffers), co pozwala zaoszczędzić miejsce dla małych liczb.
- **Weryfikacja sumy kontrolnej (CRC32):** Automatyczne dołączanie sumy kontrolnej CRC32 na końcu strumienia binarnego i jej weryfikacja przy deserializacji.

**Porady implementacyjne i dobre praktyki:**
Unikaj nadmiernego alokowania tablic bajtów. Wykorzystaj struktury `Span<byte>` oraz klasę `System.Buffers.Binary.BinaryPrimitives` do konwersji typów liczbowych na bajty w określonym porządku (Endianness). Zwróć uwagę na wyrównanie pamięci (Memory Alignment) – systemy 64-bitowe domyślnie wyrównują pola struktur do wielokrotności 4 lub 8 bajtów, co może powodować nieoczekiwane "dziury" (padding) w surowych bajtach. Użycie `[StructLayout(LayoutKind.Sequential, Pack = 1)]` wymusi gęste upakowanie pól jedno po drugim, co jest kluczowe przy integracji z zewnętrznym sprzętem lub innymi językami (C/C++).
Wzorzec projektowy: *Flyweight (Pyłek)*, *Serializer*.
