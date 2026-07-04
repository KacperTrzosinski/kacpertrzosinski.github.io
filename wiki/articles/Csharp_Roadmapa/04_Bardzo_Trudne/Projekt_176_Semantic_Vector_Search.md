## 176. Hybrydowy Silnik Wyszukiwania Semantycznego i Wektorowego (Semantic Vector Search)

**Szczegółowy opis i cele edukacyjne:**
Klasyczne wyszukiwanie pełnotekstowe (oparte na słowach kluczowych i algorytmach typu TF-IDF/BM25) zawodzi, gdy użytkownik wpisuje zapytanie o synonimy lub pojęcia powiązane ideowo (np. szukając "czworonogi domowe" i chcąc znaleźć dokumenty zawierające słowa "pies" lub "kot"). Nowoczesnym standardem rozwiązującym ten problem jest wyszukiwanie semantyczne (Semantic Vector Search), które polega na reprezentacji dokumentów i zapytań jako gęstych wektorów liczb zmiennoprzecinkowych (Embeddings) wygenerowanych przez modele AI (LLM) i wyszukiwaniu wektorów o najbliższym sąsiedztwie.
Projekt polega na stworzeniu w C# hybrydowego silnika wyszukiwania łączącego tradycyjny odwrócony indeks z wyszukiwarką wektorową.
Cele edukacyjne to integracja z modelami osadzania (Embedding Models) za pomocą biblioteki dynamicznej lub zewnętrznego API, implementacja algorytmu wyliczania podobieństwa cosinusowego (Cosine Similarity) w przestrzeniach wielowymiarowych (np. 1536 wymiarów), oraz optymalizacja przeszukiwania wektorowego przy użyciu algorytmu K-Najbliższych Sąsiadów (K-Nearest Neighbors - k-NN) z hybrydowym scalaniem ocen (Reciprocal Rank Fusion - RRF).

**Wymagane funkcje:**
- **Silnik osadzania (Embedding Client):** Moduł wysyłający teksty do API (np. OpenAI, Ollama lub lokalny model ONNX) i odbierający wektory reprezentujące semantykę tekstu.
- **Wyszukiwarka wektorowa (Vector Database Suite):** Przechowywanie wektorów w pamięci i wyszukiwanie $K$ wektorów o najmniejszym kącie nachylenia względem wektora zapytania za pomocą podobieństwa cosinusowego.
- **Hybrydowe scalanie wyników (RRF Merger):** Zaimplementowanie algorytmu Reciprocal Rank Fusion (RRF), który bierze pod uwagę pozycje dokumentów w rankingu tekstowym (BM25) oraz rankingu wektorowym (Cosine Similarity) i wylicza ostateczny, zunifikowany ranking dla użytkownika.
- **Optymalizacja SIMD dla obliczeń wektorowych:** Przyspieszenie wyliczania iloczynu skalarnego i długości wektorów przy użyciu sprzętowych instrukcji SIMD (`Vector<float>`) w C#.

**Porady implementacyjne i dobre praktyki:**
Obliczanie podobieństwa cosinusowego wektorów $A$ i $B$ definiuje wzór: $\text{sim}(A, B) = \frac{A \cdot B}{\|A\| \|B\|}$. Przy milionach dokumentów wyliczanie tego w pętli dla każdego wektora (Linear Scan) spowalnia system. Wykorzystaj typ `System.Runtime.Intrinsics.Vector256<float>` do wykonywania operacji matematycznych na 8 liczbach `float` jednocześnie, co drastycznie skróci czas skanowania. Pamiętaj o uprzednim znormalizowaniu wektorów (długość $\|A\| = 1$) przed zapisaniem ich w bazie – dzięki temu podobieństwo cosinusowe upraszcza się do zwykłego iloczynu skalarnego ($A \cdot B$), co eliminuje operacje dzielenia i pierwiastkowania w pętli wyszukiwania.
Wzorzec projektowy: *Vector Search*, *SIMD Execution*, *Strategy*.
