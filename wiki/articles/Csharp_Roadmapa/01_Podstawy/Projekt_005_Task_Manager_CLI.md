## 5. Menadżer Zadań CLI z Serializacją JSON (Task Manager CLI)

**Szczegółowy opis i cele edukacyjne:**
Projekt polega na stworzeniu konsolowej aplikacji typu "To-Do List" o rozbudowanej strukturze. Aplikacja pozwala na dodawanie zadań, przypisywanie im priorytetów (Low, Medium, High), tagów, daty zakończenia (deadline), a także grupowanie ich w projekty. Dane muszą być trwale zapisywane na dysku w formacie JSON, aby były dostępne po ponownym uruchomieniu programu.
Cele edukacyjne obejmują naukę pracy z wbudowaną biblioteką serializacji `System.Text.Json`, poprawne posługiwanie się słownikami (`Dictionary<TKey, TValue>`) i kolekcjami w celu szybkiego wyszukiwania, wdrożenie wzorca repozytorium (Repository Pattern) na poziomie podstawowym w celu separacji logiki przechowywania danych od logiki interfejsu użytkownika, oraz zaawansowaną walidację dat i stanów obiektów.

**Wymagane funkcje:**
- **Zarządzanie zadaniami:** Operacje CRUD (Create, Read, Update, Delete) na zadaniach. Zadania mogą mieć statusy: Oczekujące, W toku, Zakończone, Anulowane.
- **Trwałość danych (JSON Persistence):** Automatyczny zapis listy zadań przy każdej zmianie oraz odczyt podczas startu aplikacji przy użyciu asynchronicznych (lub synchronicznych na tym etapie) metod klasy `JsonSerializer`.
- **Filtrowanie i wyszukiwanie:** Wyszukiwanie zadań przeterminowanych, zadań z konkretnym tagiem lub o określonym priorytecie.
- **Repozytorium zadań (Task Repository):** Abstrakcja dostępu do danych w postaci klasy `JsonTaskRepository` implementującej interfejs `ITaskRepository`.

**Porady implementacyjne i dobre praktyki:**
Zaimplementuj serializację z opcją `WriteIndented = true` w klasie `JsonSerializerOptions`, aby plik JSON na dysku był czytelny dla człowieka. Do walidacji dat używaj typu `DateTime` lub `DateTimeOffset` (rekomendowany ze względu na strefy czasowe). Nie przechowuj powiązań między zadaniami za pomocą twardych referencji wewnątrz struktur danych przeznaczonych do serializacji – może to doprowadzić do zapętleń (circular references). Zamiast tego powiąż zadania za pomocą identyfikatorów `Guid`. Przy zapisie pliku zabezpiecz aplikację przed uszkodzeniem danych (np. poprzez zapis do pliku tymczasowego, a następnie atomową zamianę plików przy użyciu `File.Replace`).
Wzorzec projektowy: *Repository (Repozytorium)*, *Singleton* (dla konfiguracji lub instancji repozytorium).
