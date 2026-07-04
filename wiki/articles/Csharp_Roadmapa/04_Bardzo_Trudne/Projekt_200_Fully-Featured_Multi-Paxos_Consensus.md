## 200. Kompleksowy Rozproszony Silnik Konsensusu Multi-Paxos (Fully-Featured Multi-Paxos Consensus)

**Szczegółowy opis i cele edukacyjne:**
Osiągnięcie pełnej poprawności i odporności na awarie w rozproszonej bazie danych wymaga połączenia wszystkich zaawansowanych mechanizmów teorii konsensusu w jeden, spójny system. Silnik klasy produkcyjnej musi nie tylko osiągać porozumienie co do wartości, ale musi potrafić: wybierać stabilnego lidera (Leader Election), optymalizować RTT (Multi-Paxos 1-RTT execution), dynamicznie zmieniać konfigurację klastra (Joint Consensus), chronić dane przed utratą zapisu (Write-Ahead Log na dysku), czyścić pamięć (Log Compaction via Snapshots) oraz automatycznie przywracać spójność po długotrwałych awariach sieciowych (Snapshot Transfer & Log Catch-up).
Projekt 200 stanowi wielkie podsumowanie całej ścieżki i polega na stworzeniu kompletnego, w pełni wyposażonego rozproszonego silnika konsensusu Multi-Paxos (Replicated State Machine) działającego jako samodzielna usługa sieciowa.
Cele edukacyjne to integracja złożonych protokołów rozproszonych w jedną, wielowątkową architekturę, zaawansowane zarządzanie współbieżnością i stanami krytycznymi, oraz pełne mitygowanie problemów Split-brain, wyścigów sieciowych (Race Conditions) oraz utraty spójności danych.

**Wymagane funkcje:**
- **Wielowęzłowa sieć Multi-Paxos (Real Network Service):** Uruchomienie klastra składającego się z minimum 3/5 niezależnych procesów C# komunikujących się przez rzeczywistą sieć TCP (gniazda asynchroniczne).
- **Zintegrowany stos funkcjonalny konsensusu:**
  - *Lider i 1-RTT*: Automatyczna detekcja awarii lidera, bezpieczny wybór nowego i optymalizacja do 1-RTT dla zapisów.
  - *Trwałość (WAL)*: Każdy węzeł zapisuje stany Acceptora i Proposera oraz szczeliny logu do trwałego dyskowego Write-Ahead Logu przed wysłaniem odpowiedzi sieciowej.
  - *Snapshoty i Compaction*: Automatyczne generowanie snapshotów stanu bazy i usuwanie starych szczelin logu z dysku.
  - *Dynamiczna Rekonfiguracja*: Zmiana składu klastra w locie za pomocą bezpiecznej procedury Joint Consensus.
- **Odporność na skomplikowane podziały sieci (Network Partitions):** System poprawnie przechodzi testy "Split-brain" – gdy sieć zostanie podzielona na dwa niezależne segmenty (np. 2 węzły vs 3 węzły), mniejszy segment automatycznie blokuje zapisy (brak kworum), a większy działa dalej spójnie. Po złączeniu sieci segmenty automatycznie synchronizują logi (Log Catch-up / Snapshot Transfer).
- **Zintegrowany CLI Panel Kontrolny:** Konsolowe narzędzie monitorujące cały klaster, pozwalające wysyłać zapytania klienckie, symulować awarie (Kill nodes, Network partition) i śledzić spójność bazy w czasie rzeczywistym.

**Porady implementacyjne i dobre praktyki:**
W celu zachowania przejrzystości tak złożonej architektury, oddziel logikę protokołu Paxos (pure state machine, deterministyczne przejścia stanów) od warstwy I/O (obsługa socketów, operacje dyskowe). Pozwoli to na łatwe testowanie jednostkowe samej logiki konsensusu. Do przesyłania wiadomości w klastrze zaprojektuj ustrukturyzowany protokół binarny lub użyj gRPC. Pamiętaj, aby zapis do pliku WAL był synchroniczny (Flush do dysku) przed wysłaniem potwierdzenia sieciowego do lidera – bez tego awaria zasilania w momencie wysyłania pakietu złamie gwarancje konsensusu Paxos.
Wzorzec projektowy: *Replicated State Machine*, *Write-Ahead Logger*, *Joint Consensus*, *Active Object / Actor Model*.
