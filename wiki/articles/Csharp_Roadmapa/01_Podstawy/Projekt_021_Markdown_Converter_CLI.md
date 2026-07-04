## 21. Parser i Konwerter Markdown do HTML (Markdown Converter CLI)

**Szczegółowy opis i cele edukacyjne:**
Projekt polega na zbudowaniu konwertera plików tekstowych z formatu Markdown (`.md`) do ustrukturyzowanego kodu HTML (`.html`). Aplikacja musi przetwarzać strukturę dokumentu: nagłówki (h1-h6), bloki tekstu (akapity), listy nieuporządkowane (`-` lub `*`), bloki kodu oraz formatowanie wewnątrz wiersza (pogrubienie, pochylenie, odnośniki sieciowe).
Głównym celem edukacyjnym jest nauka zaawansowanej manipulacji tekstami (String Processing), przetwarzania blokowego przy użyciu strumieni znaków (Stream/Reader) oraz użycia wyrażeń regularnych (`Regex`) w celu identyfikacji i zamiany znaczników inline (np. `**tekst**` na `<strong>tekst</strong>`).

**Wymagane funkcje:**
- **Analiza blokowa dokumentu (Block Parsing):** Wyodrębnianie struktury dokumentu (np. linie zaczynające się od `#` traktowane jako nagłówki, linie puste jako podział akapitów).
- **Parsowanie elementów inline:** Zamiana formatowania tekstu: pogrubienie (`**` / `__`), pochylenie (`*` / `_`), kody blokowe (backticki) oraz odnośniki w formacie `[tekst](url)`.
- **Obsługa list zagnieżdżonych:** Poprawne zamykanie i otwieranie tagów `<ul>` i `<li>` dla wielopoziomowych wcięć (spacji) w listach punktowanych.
- **Konfiguracja wyglądu (HTML Boilerplate Template):** Możliwość osadzenia wynikowego kodu HTML w szablonie zawierającym podstawowy arkusz stylów CSS (wstrzykiwany plik stylu) w celu estetycznego wyglądu.

**Porady implementacyjne i dobre praktyki:**
Zamiast przetwarzać cały dokument jednym, skomplikowanym wyrażeniem regularnym, podziel proces na dwa etapy: najpierw zidentyfikuj bloki (nagłówki, akapity, listy, bloki kodu), a dopiero na tekście wewnątrz tych bloków wykonaj parsowanie znaczników inline. Do wydajnej obsługi parsowania list i bloków kodu (które rozciągają się na wiele linii) zaimplementuj prosty bufor linii tekstowych. Pamiętaj o bezpieczeństwie wygenerowanego kodu HTML – zabezpiecz parser przed atakami typu XSS (Cross-Site Scripting) poprzez ucieczkę (escaping) znaków `<` i `>` za pomocą klasy `System.Net.WebUtility.HtmlEncode`, chyba że znaki te są częścią celowo parsowanych znaczników HTML.
Wzorzec projektowy: *Builder* (do składania wynikowego dokumentu HTML line-by-line), *Interpreter* (do parsowania reguł gramatyki Markdown).
