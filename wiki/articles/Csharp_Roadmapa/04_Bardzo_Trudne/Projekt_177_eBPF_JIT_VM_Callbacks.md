## 177. Kompilator JIT Maszyny eBPF z Wywołaniami Zwrotnymi (eBPF JIT VM Callbacks)

**Szczegółowy opis i cele edukacyjne:**
W zaawansowanych architekturach monitorowania systemów (np. systemy telemetryczne APM, firewalle) programy eBPF muszą nie tylko odczytywać i modyfikować parametry w locie, ale również asynchronicznie zgłaszać zdarzenia do systemu nadrzędnego. W eBPF realizuje się to za pomocą mechanizmów wywołań zwrotnych (Callbacks) oraz asynchronicznych buforów pierścieniowych (BPF Ring Buffer), które pozwalają programowi w piaskownicy (Sandbox) zapisać zdarzenie i wyzwolić powiadomienie po stronie hosta.
Projekt polega na rozbudowaniu wirtualnej maszyny eBPF JIT o pełne wsparcie dla wywołań zwrotnych oraz implementację asynchronicznego mechanizmu zdarzeń opartego o bezblokowy Ring Buffer.
Cele edukacyjne to integracja delegatów i wskaźników do funkcji C# z dynamicznie generowanym kodem IL (JIT callback resolution), bezblokowe strumieniowanie zdarzeń z maszyny wirtualnej do systemu hosta, oraz zaawansowane zarządzanie cyklem życia pamięci.

**Wymagane funkcje:**
- **Asynchroniczny Ring Buffer zdarzeń (eBPF Ring Buffer):** Zaimplementowanie struktury pamięci współdzielonej między VM a hostem, do której program eBPF może za pomocą helpera `bpf_ringbuf_output` asynchronicznie wrzucać zdarzenia (Events).
- **Obsługa wywołań zwrotnych (JIT Callback Invocation):** Możliwość zarejestrowania w maszynie eBPF delegatów C# (np. `Action<int, IntPtr>`). Kompilator JIT parsuje instrukcje eBPF i emituje kod IL wywołujący te delegaty z odpowiednimi argumentami (np. po wykryciu określonej anomalii w pakiecie).
- **Zintegrowany Event Loop po stronie hosta:** Usługa hosta asynchronicznie monitorująca bufor kołowy eBPF za pomocą zdarzeń systemowych (Epoll / EventWaitHandle) i wywołująca powiązane metody obsługi zdarzeń.
- **Weryfikacja bezpieczeństwa callbacków (Verifier integration):** Verifier sprawdza statycznie, czy przekazywane do callbacków wskaźniki na pamięć kontekstu (Context pointers) są bezpieczne i nie pozwalają programowi eBPF na modyfikację pamięci chronionej systemu hosta.

**Porady implementacyjne i dobre praktyki:**
Do zaimplementowania wydajnego przesyłania zdarzeń bez narzutu synchronizacji wykorzystaj model Single Producer Single Consumer (SPSC) Ring Buffer. Ponieważ producentem jest wątek wykonujący kod eBPF JIT, a konsumentem jest Event Loop hosta, do synchronizacji wskaźników zapisu i odczytu wystarczą operacje atomowe `Interlocked.Read` i bariery pamięciowe. Przy kompilacji wywołań zwrotnych w IL, jeśli przekazujesz delegata C# do metody dynamicznej, upewnij się, że delegat nie zostanie zebrany przez Garbage Collector w trakcie wykonywania kodu (przypisz go do statycznej zmiennej lub użyj `GCHandle`).
Wzorzec projektowy: *Callback*, *Event Loop*, *Low-Latency Ring Buffer*.
