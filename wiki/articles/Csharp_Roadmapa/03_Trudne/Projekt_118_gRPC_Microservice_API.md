## 118. Komunikacja Mikroserwisów przy użyciu protokołu gRPC (gRPC Microservice API)

**Szczegółowy opis i cele edukacyjne:**
W architekturze mikroserwisów tradycyjna komunikacja REST JSON między usługami wewnątrz sieci wewnętrznej bywa powolna i generuje duży narzut sieciowy (serializacja tekstowa, brak wsparcia dla stałego połączenia HTTP/2). Standardem wydajnościowym jest protokół gRPC (Google Remote Procedure Call) – przesyłający binarne dane (Protocol Buffers) przez jedno trwałe połączenie HTTP/2.
Projekt polega na stworzeniu dwóch mikroserwisów (np. OrderService i InventoryService) komunikujących się asynchronicznie za pomocą gRPC.
Cele edukacyjne to projektowanie kontraktów w plikach `.proto` (Protocol Buffers), automatyczne generowanie kodu klas w C# na bazie proto, implementacja różnych typów połączeń RPC (Unary, Server Streaming, Client Streaming, Bidirectional Streaming), oraz obsługa błędów sieciowych i przekazywanie nagłówków metadanych (Metadata / Context Propagation).

**Wymagane funkcje:**
- **Definicja kontraktu (.proto files):** Stworzenie plików `.proto` definiujących usługi, wiadomości wejściowe/wyjściowe oraz typy danych.
- **Implementacja serwisu gRPC w ASP.NET Core:** Klasa serwisu dziedzicząca po wygenerowanej klasie bazowej, obsługująca żądanie (np. `CheckStockUnary` lub strumieniowe przesyłanie zmian cen `StreamPriceUpdates`).
- **Klient gRPC (gRPC Client Factory):** Integracja klienta gRPC z kontenerem DI w mikroserwisie klienckim przy użyciu `Grpc.Net.ClientFactory`, z konfiguracją kanałów (Channels) i połączeniem asynchronicznym.
- **Strumieniowanie dwukierunkowe (Bidirectional Streaming):** Scenariusz synchronizacji danych w czasie rzeczywistym, w którym klient i serwer jednocześnie wysyłają do siebie asynchroniczne strumienie wiadomości przez jedno otwarte połączenie.

**Porady implementacyjne i dobre praktyki:**
W programie .NET włączenie wsparcia dla gRPC wymaga instalacji pakietu NuGet `Grpc.AspNetCore`. Po dodaniu pliku `.proto` do projektu, zadeklaruj go w pliku `.csproj` jako `<Protobuf Include="Protos\inventory.proto" GrpcServices="Server" />` dla serwera (lub `"Client"` dla klienta) i skompiluj projekt – klasy C# zostaną wygenerowane automatycznie przez kompilator. W komunikacji strumieniowej pamiętaj o poprawnym obsługiwaniu parametru `ServerCallContext.CancellationToken` w celu przerwania przetwarzania danych, jeśli klient zamknie połączenie.
Wzorzec projektowy: *Remote Procedure Call (RPC)*, *Observer (Obserwator)*.
