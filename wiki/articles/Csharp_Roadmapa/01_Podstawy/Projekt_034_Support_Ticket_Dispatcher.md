## 34. System Przydziału Zgłoszeń Technicznych (Support Ticket Dispatcher)

**Szczegółowy opis i cele edukacyjne:**
W centrach pomocy technicznej (Helpdesk) zgłoszenia klientów muszą być kolejkowane i automatycznie przydzielane do odpowiednich agentów na podstawie kategorii zgłoszenia, poziomu trudności oraz aktualnego obciążenia pracowników.
Projekt polega na stworzeniu konsolowego dyspozytora zgłoszeń wsparcia.
Cele edukacyjne to praca z zaawansowanymi strukturami kolejkowymi (`Queue<T>`, `PriorityQueue<TKey, TValue>`), implementacja algorytmów dopasowania (matching algorithms), wykorzystanie dopasowywania wzorców (Pattern Matching) do automatycznej klasyfikacji zgłoszeń na podstawie słów kluczowych oraz obsługa błędów za pomocą wyjątków przy przekroczeniu limitów SLA (Service Level Agreement).

**Wymagane funkcje:**
- **Kolejkowanie priorytetowe zgłoszeń:** Nowe zgłoszenia lądują w globalnej kolejce. Zgłoszenia od klientów VIP lub zgłoszenia o statusie "CRITICAL" mają wyższy priorytet i są obsługiwane w pierwszej kolejności.
- **Profilowanie i stan agentów:** Zarządzanie zespołem agentów posiadających różne specjalizacje (np. Bazy danych, Sieci, Hardware) i poziomy (Junior, Senior).
- **Automatyczny dyspozytor (Dispatcher):** Silnik przypisujący zgłoszenie do pierwszego wolnego agenta o odpowiednich kwalifikacjach. Jeśli brak wolnych agentów, zgłoszenie czeka w kolejce.
- **Raporty SLA i eskalacja:** Okresowe sprawdzanie czasu oczekiwania zgłoszeń w kolejce. Jeśli zgłoszenie czeka zbyt długo, następuje automatyczna zmiana priorytetu (eskalacja) lub rzucenie zdarzenia `OnSlaViolated`.

**Porady implementacyjne i dobre praktyki:**
Zaimplementuj zgłoszenie jako rekord `Ticket` z niezmiennymi danymi wejściowymi. Do automatycznej klasyfikacji kategorii zgłoszenia (np. jeśli opis zawiera słowo "hasło" -> kategoria Security, jeśli "router" -> kategoria Networks) użyj mechanizmu Pattern Matching i wyrażeń switch. Do kolejkowania zgłoszeń wykorzystaj `PriorityQueue<Ticket, TicketPriority>`, gdzie priorytet jest typem wyliczeniowym. Zabezpiecz stan agentów przed niespójnością – agent nie może obsługiwać dwóch zgłoszeń jednocześnie. Napisz testy jednostkowe weryfikujące, czy zgłoszenie o wyższym priorytecie faktycznie opuściło kolejkę przed zgłoszeniem o niższym priorytecie zgłoszonym wcześniej.
Wzorzec projektowy: *State (Stan)* (dla cyklu życia zgłoszenia: New, Assigned, InProgress, Resolved), *Strategy* (dla różnych polityk przydziału zadań, np. Round-Robin vs Least-Busy).
