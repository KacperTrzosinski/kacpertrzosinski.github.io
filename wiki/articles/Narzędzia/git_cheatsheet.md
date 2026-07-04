# Git Cheat Sheet

Przydatne komendy systemu Git do codziennej pracy.

## Podstawy
Inicjalizacja i klonowanie repozytoriów.
```bash
git init                   # Inicjalizuje puste repozytorium
git clone [url]            # Klonuje repozytorium ze wskazanego URL
```

## Zmiany i Commity
```bash
git status                 # Sprawdza status zmodyfikowanych plików
git add .                  # Dodaje wszystkie zmiany do stage'a
git commit -m "Wiadomość"  # Zapisuje zmiany z podaną wiadomością
```

## Gałęzie (Branches)
Tworzenie i zarządzanie gałęziami ułatwia pracę nad wieloma funkcjonalnościami naraz.
```bash
git branch                 # Wyświetla lokalne gałęzie
git branch [nazwa]         # Tworzy nową gałąź
git checkout [nazwa]       # Przełącza się na gałąź
git checkout -b [nazwa]    # Tworzy gałąź i od razu się na nią przełącza
git merge [nazwa]          # Scala wybraną gałąź z obecną
```

## Zdalne repozytoria
```bash
git push origin [nazwa_galezi]  # Wypycha zmiany na serwer
git pull origin [nazwa_galezi]  # Pobiera i scala zmiany z serwera
```

> **Wskazówka:** Jeśli zepsujesz lokalne zmiany przed commitowaniem i chcesz wrócić do stanu z repozytorium, użyj `git checkout -- .` (Przywróci wszystkie pliki, usunie nienagrane zmiany!).
