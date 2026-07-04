# Witaj w Twojej Osobistej Bazie Wiedzy! 👋

To miejsce jest zaprojektowane jako Twoje personalne **Wiki**. Możesz tutaj łatwo dodawać i organizować swoje notatki, fragmenty kodu, przemyślenia czy artykuły.

## Jak to działa?

Aplikacja renderuje pliki w formacie **Markdown** (`.md`) i używa `marked.js` oraz `highlight.js` do ich pięknego wyświetlania, wliczając w to podświetlanie składni kodu.

Aby dodać nowy artykuł:
1. Utwórz plik `.md` w folderze `wiki/articles/`. Jeśli chcesz przypisać go do kategorii, umieść go w odpowiednim folderze (np. `wiki/articles/Frontend WebDev/css_glassmorphism.md`). Podfoldery automatycznie staną się podkategoriami.
2. Uruchom skrypt generujący indeks za pomocą polecenia:
   ```bash
   node wiki/generate_index.js
   ```
3. Odśwież stronę! Artykuł automatycznie pojawi się w menu bocznym oraz na stronie głównej w odpowiedniej kategorii.


## Funkcjonalności
* 🚀 **Szybkość:** Brak bazy danych, po prostu statyczne pliki (wymagany serwer http jak GitHub Pages).
* 💅 **Design:** Nowoczesny, szklany interfejs (*Glassmorphism*).
* 🔍 **Wyszukiwarka:** Szybko znajdź odpowiedni wpis po tytule lub tagach.
* 💻 **Kod:** Automatyczne kolorowanie składni.

### Przykładowy kod JavaScript:
```javascript
function greet(name) {
    console.log(`Cześć, ${name}! Witaj w Wiki.`);
}

greet('Kacper');
```

> **Wskazówka:** Markdown pozwala na dodawanie obrazków! Wystarczy umieścić plik w folderze, np. `wiki/assets/` i zalinkować w dokumencie: `![Opis](./assets/obraz.png)`

Miłego pisania! ✍️
