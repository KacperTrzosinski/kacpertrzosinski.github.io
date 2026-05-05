# Glassmorphism w CSS

Glassmorphism to jeden z najpopularniejszych trendów w projektowaniu UI z ostatnich lat. Charakteryzuje się efektem "matowego szkła" (*frosted glass*), przez które delikatnie przebija się kolorowe tło.

## Jak to osiągnąć?

Podstawą efektu jest właściwość `backdrop-filter`.

```css
.glass-panel {
    /* Półprzezroczyste tło (możesz użyć dowolnego koloru) */
    background: rgba(255, 255, 255, 0.05);
    
    /* Rozmycie tła za elementem */
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px); /* Dla Safari */
    
    /* Cienka, półprzezroczysta ramka dodająca głębi */
    border: 1px solid rgba(255, 255, 255, 0.1);
    
    /* Zaokrąglone rogi i cień */
    border-radius: 16px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}
```

## Ważne uwagi
1. Efekt `backdrop-filter` nie będzie widoczny, jeśli element znajduje się na jednolitym białym/czarnym tle. Potrzebujesz czegoś kolorowego lub zdjęcia z tyłu!
2. Niektóre starsze przeglądarki mogą nie obsługiwać w pełni `backdrop-filter`, więc zawsze warto zdefiniować bezpieczny, lekko przezroczysty kolor `background` (tzw. *fallback*).
