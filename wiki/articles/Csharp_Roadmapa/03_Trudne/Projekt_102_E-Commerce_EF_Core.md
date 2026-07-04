## 102. System Sklepu z Entity Framework Core i Migracjami (E-Commerce EF Core)

**Szczegółowy opis i cele edukacyjne:**
Entity Framework Core (EF Core) to główny system mapowania obiektowo-relacyjnego (ORM) stosowany w ekosystemie .NET. Pozwala on na programowanie bazy danych z poziomu kodu C# (podejście Code-First). 
Projekt polega na stworzeniu warstwy bazodanowej dla sklepu internetowego (produkty, zamówienia, klienci, koszyki, płatności).
Głównym celem edukacyjnym jest opanowanie zaawansowanych funkcji EF Core. Student dowiaduje się, jak mapować relacje jeden-do-wielu (One-to-Many) oraz wielu-do-wielu (Many-to-Many), jak tworzyć i aplikować migracje bazy danych, jak konfigurować właściwości przy użyciu Fluent API (zamiast atrybutów w klasach encji), jak optymalizować zapytania LINQ do bazy danych za pomocą `AsNoTracking()` oraz jak unikać typowych pułapek wydajnościowych, takich jak problem zapytań $N+1$ (poprawne stosowanie `Include` / Eager Loading).

**Wymagane funkcje:**
- **Modelowanie bazy (Code-First):** Klasa kontekstu `ApplicationDbContext` wraz z konfiguracją Fluent API dla encji: klucze główne, unikalne indeksy, klucze obce oraz automatyczne generowanie wartości (np. klucze typu `Guid`).
- **Migracje i Seed Data:** Narzędzie generujące migracje EF Core oraz automatycznie aplikujące je przy starcie aplikacji (Database Auto-migration) wraz z wypełnianiem bazy danymi testowymi (Seeding).
- **Złożone transakcje i SaveChanges:** Złożenie zamówienia z rezerwacją produktów i płatnością realizowane wewnątrz jednej transakcji EF Core, zapewniającej spójność danych.
- **Optymalizacja zapytań (Query Tuning):** Implementacja zapytań raportowych pobierających dane bez śledzenia stanu obiektów (`AsNoTracking()`) oraz zoptymalizowana projekcja danych bezpośrednio do DTO (`Select`), co minimalizuje ilość pobieranych kolumn.

**Porady implementacyjne i dobre praktyki:**
Zawsze konfiguruj relacje w osobnych klasach implementujących interfejs `IEntityTypeConfiguration<T>`, a nie bezpośrednio w metodzie `OnModelCreating` – ułatwi to utrzymanie porządku w kodzie. Unikaj ładowania leniwego (Lazy Loading) w aplikacjach Web API, ponieważ może to prowadzić do ukrytego problemu $N+1$ zapytań podczas serializacji obiektów do JSON – zamiast tego korzystaj z Eager Loading (`Include`, `ThenInclude`) lub jawnych projekcji (Projection do DTO). Do operacji masowych (np. aktualizacja cen 10 000 produktów) zamiast wczytywania ich do pamięci i wywoływania `SaveChanges()`, wykorzystaj nowe metody `ExecuteUpdateAsync` i `ExecuteDeleteAsync` wprowadzone w EF Core 7/8.
Wzorzec projektowy: *Data Mapper*, *Unit of Work* (reprezentowany przez DbContext).
