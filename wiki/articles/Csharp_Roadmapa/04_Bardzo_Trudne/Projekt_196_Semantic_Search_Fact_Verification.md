## 196. Hybrydowa Wyszukiwarka Semantyczna z Weryfikacją Faktów (Semantic Search Fact Verification)

**Szczegółowy opis i cele edukacyjne:**
Wyszukiwanie hybrydowe (tekstowo-wektorowe) gromadzi dokumenty wysoce dopasowane pod kątem językowym i tematycznym. Jednak w zastosowaniach krytycznych (np. bazy wiedzy medycznej, prawnej, procedury techniczne Enterprise) sama bliskość semantyczna to za mało – dokumenty mogą zawierać sprzeczne informacje, nieaktualne wersje procedur lub fałszywe fakty (np. zdezaktualizowane cenniki). Baza wiedzy musi wdrożyć warstwę Weryfikacji Faktów (Fact Verification) w locie, aby eliminować lub oznaczać dokumenty, których zawartość merytoryczna stoi w sprzeczności z ustalonymi faktami (Golden Metadata) lub nowszymi wersjami dokumentów.
Projekt polega na rozbudowaniu wyszukiwarki semantycznej o moduł weryfikacji logicznej faktów z użyciem grafu faktów i krzyżowej walidacji metaparametrów.
Cele edukacyjne to modelowanie logicznych sieci powiązań (Fact Graphs), weryfikacja poprawności logicznej zdań przy użyciu reprezentacji grafowej i reguł wnioskowania, oraz eliminacja sprzeczności semantycznych w wynikach wyszukiwania.

**Wymagane funkcje:**
- **Graf faktów referencyjnych (Golden Fact Graph):** Baza wiedzy w pamięci przechowująca stwierdzenia (Triples: Podmiot - Relacja - Dopełnienie, np. `Produkt_A - Cena - 120` oraz `Cena_A - Status - Nieaktualna`).
- **Detektor sprzeczności logicznych (Contradiction Detector):** Silnik parsuje kluczowe zdania z odnalezionych dokumentów i porównuje je z grafem faktów. Jeśli dokument twierdzi, że "Cena produktu A wynosi 150 zł", a graf faktów zawiera potwierdzoną regułę z nowszą datą o innej wartości, system flaguje dokument jako sprzeczny (Contradictory).
- **Rankingowanie z filtrem faktograficznym:** Obniżanie oceny dopasowania (Relevance score) lub całkowite ukrywanie dokumentów ze zweryfikowanymi błędami faktograficznymi lub niespójnościami w metadanych.
- **Zintegrowany CLI Explorer:** Konsolowy panel wyszukiwania prezentujący wskaźnik wiarygodności (Fact Confidence Index) obok każdego wyniku oraz wypisujący wykryte sprzeczności (np. "Uwaga: dokument zawiera nieaktualną cenę").

**Porady implementacyjne i dobre praktyki:**
Do budowy i przeszukiwania grafu faktów referencyjnych wykorzystaj strukturę grafu w pamięci (opartą na tablicy sąsiedztwa lub dedykowanym formacie RDF/Triple Store w C#). Weryfikację logiczną zdań ułatwi mapowanie informacji na struktury klucz-wartość w metadanych dokumentu (np. pola `version`, `effective_date`). Przy porównywaniu faktów liczbowych (np. ceny, wymiary) zaimplementuj tolerancję (Epsilon), a przy sprzecznościach logicznych zawsze priorytetyzuj dokumenty o wyższym statusie zatwierdzenia lub nowszym znaczniku czasu (Timestamping).
Wzorzec projektowy: *Fact-checking Pipeline*, *Knowledge Graph*, *Rule Engine*.
