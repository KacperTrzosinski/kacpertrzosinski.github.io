## 144. Silnik Fizyki 2D oparty o Drzewo Czwórkowe (2D Quadtree Physics Engine)

**Szczegółowy opis i cele edukacyjne:**
Symulacje fizyczne i gry 2D (np. symulatory zderzeń ciał, fizyka cieczy oparta o cząsteczki) wymagają obliczania ruchu obiektów pod wpływem sił (grawitacja, tarcie) oraz wykrywania kolizji między setkami ciał. Aby utrzymać wydajność pętli gry na poziomie 60 FPS, stosuje się przestrzenny podział przestrzeni dwuwymiarowej za pomocą Drzewa Czwórkowego (Quadtree).
Projekt polega na stworzeniu konsolowego silnika fizyki 2D.
Cele edukacyjne to implementacja równań ruchu ciał sztywnych (Rigid-body dynamics, całkowanie metodą Eulera lub Verlet), wyliczanie wektorów odbicia i przenikania energii przy zderzeniach elastycznych/nieelastycznych, oraz optymalizacja testów kolizyjnych przy użyciu dynamicznego drzewa Quadtree w 2D.

**Wymagane funkcje:**
- **Model fizyczny ciała sztywnego (Rigidbody):** Klasa reprezentująca koło lub prostokąt posiadający pozycję (`Vector2`), prędkość, masę, współczynnik sprężystości (Restitution) oraz siły działające na ciało.
- **Drzewo Czwórkowe (Quadtree) w 2D:** Klasa dzieląca dwuwymiarowy ekran na 4 równe ćwiartki (dzieci) po przekroczeniu limitu obiektów w węźle, z dynamicznym aktualizowaniem pozycji obiektów.
- **Detektor i resolver kolizji:** Wykrywanie zderzeń (np. koło-koło, koło-ściana) i obliczanie nowych prędkości obiektów po odbiciu (Impulse-based physics resolution) z zapobieganiem stapianiu się obiektów (Position correction).
- **Konsolowy renderer 2D:** Pętla gry rysująca obiekty na ekranie konsoli w stałych odstępach czasu (60 FPS) przy użyciu buforowania w pamięci.

**Porady implementacyjne i dobre praktyki:**
Do zapisu wektorów i operacji matematycznych (iloczyn skalarny, długość wektora) wykorzystaj wbudowany typ `System.Numerics.Vector2`. Przy rozwiązywaniu kolizji impulsowych, zmiana prędkości ciał po zderzeniu zależy od ich mas oraz współczynnika sprężystości $e$ (gdzie $e=1$ to zderzenie idealnie sprężyste - brak utraty energii, a $e=0$ to zderzenie całkowicie niesprężyste - ciała łączą się). Zaimplementuj korektę pozycji (Linear projection), która przesuwa ciała delikatnie na zewnątrz wzdłuż normalnej kolizji, co zapobiega powolnemu zapadaniu się (przenikaniu) ciał pod wpływem grawitacji.
Wzorzec projektowy: *Entity Component System (ECS)* (opcjonalnie do organizacji ciał), *Game Loop*.
