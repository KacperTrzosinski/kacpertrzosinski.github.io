## 37. Symulator Sklepu z Silnikiem Promocji (Shopping Cart Simulator)

**Szczegółowy opis i cele edukacyjne:**
E-commerce wymaga elastycznych systemów naliczania rabatów (np. "Kup 3, zapłać za 2", "10% rabatu na całe zamówienie od 200 zł", "Darmowa wysyłka przy zakupie określonej kategorii produktów").
Projekt polega na stworzeniu konsolowego koszyka zakupowego połączonego z dynamicznym silnikiem naliczania zniżek.
Głównym celem edukacyjnym jest nauka poprawnego modelowania obiektowego (separacja encji biznesowych od usług kalkulacyjnych), tworzenie własnych generycznych kolekcji oraz implementacja silnika reguł (Rule Engine) przy użyciu dopasowywania wzorców (Pattern Matching) i polimorfizmu, aby nowe promocje można było dodawać bez modyfikowania kodu koszyka (zasada OCP).

**Wymagane funkcje:**
- **Zarządzanie koszykiem:** Klasa `ShoppingCart` przechowująca listę pozycji (`CartItem`), oferująca operacje dodawania, zmiany ilości i usuwania z automatyczną walidacją limitów dostępności produktów.
- **Dynamiczny silnik promocji (Discounter Engine):** Serwis aplikujący zarejestrowane reguły rabatowe na koszyk i wyliczający ostateczną kwotę zniżki.
- **Hierarchia i reguły promocji:** Klasa bazowa `DiscountRule` oraz klasy specyficzne: `PercentageDiscount`, `BuyXGetYFree`, `CategoryThresholdDiscount`.
- **Raport kasowy (Receipt Generator):** Wygenerowanie szczegółowego podsumowania zakupu w konsoli z wypisaniem wszystkich pozycji, nałożonych promocji (wraz z ich nazwą i kwotą obniżki) oraz końcowej kwoty do zapłaty.

**Porady implementacyjne i dobre praktyki:**
Zaprojektuj koszyk zakupowy w taki sposób, aby pozycje były reprezentowane przez unikalne obiekty `Product` (identyfikator, nazwa, cena bazowa, kategoria). Zniżki powinny być obliczane sekwencyjnie. Uważaj na pułapki architektoniczne – nałożenie jednej promocji (np. obniżenie ceny produktu) może wpływać na kryteria innej promocji (np. minimalny próg wartości koszyka). Stwórz mechanizm priorytetyzacji reguł rabatowych (np. sortowanie reguł po priorytecie przed ich aplikacją). Do kalkulacji cen zawsze używaj typu `decimal`.
Wzorzec projektowy: *Strategy (Strategia)* (do aplikowania różnych algorytmów rabatowania), *Composite* (do łączenia wielu promocji w jedno wywołanie).
