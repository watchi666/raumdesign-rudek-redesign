# RaumDesign Rudek — Redesign-Testlauf

Quelle: <https://www.raumdesign-rudek.de/> · Malerfachbetrieb, Inhaber Daniel Rudek, Kirchstraße 37, 40227 Düsseldorf
Erstellt mit dem **impeccable**-Skill (Register: *Brand*). Stand: 2026-06-14.

## 🌐 Live (Vercel)

**https://raumdesign-rudek-redesign.vercel.app** — Canvas-Übersicht mit allen Konzepten.
Konzept 1 + 2 haben das **3D-Zylinder-Karussell** im Hero (Ziehen / Pfeile / Auto-Dreh, Klick öffnet groß). Wiederverwendbarer Code in `assets/carousel.{css,js}`.

---

## 1. Was extrahiert wurde

Die alte Seite ist ein IONOS/DUDA-Baukasten: Die Startseite zeigt nur den Firmennamen, die **Galerie liegt komplett in einer JavaScript-Slideshow** (PhotoSwipe), die Bild-URLs sind im HTML signiert versteckt (`le-cdn.website-editor.net`).

- **29 eindeutige Motive** aus der Galerie extrahiert → `quelle/bilder/` (je beste verfügbare Auflösung).
- **24 davon kuratiert** und mit sprechenden Namen in `assets/img/` abgelegt (gemeinsam von allen 3 Versionen genutzt).
- Alle Unterseiten als HTML gesichert → `quelle/*.html` (Texte für Leistungen, Über uns, Kontakt, Impressum).

## 2. Visuelle Bewertung der Galerie

Das Portfolio ist **deutlich hochwertiger, als die alte Website vermuten lässt** — ein Kunsthandwerker für dekorative Oberflächen. Kategorien:

| Stärke | Motive (Beispiele) | Bewertung |
|---|---|---|
| **Spachtel-/Marmortechnik** | blaue Marmorwand im Wohnzimmer, Marmor-Treppenhaus (Stuccolustro), Grau-Gold-Statementwand | ⭐ Spitzenarbeiten, „Wow"-Material |
| **Metall-/Patinalasuren** | Feuer-/Sonnenuntergang-Treppenhaus, Rost-/Kupferwand | ⭐ stärkste, einzigartigste Motive |
| **Stuccolustro glänzend** | leuchtend orange Wanne, goldener Hochglanz, rote/ocker Trennwand | sehr edel |
| **Fugenlose Bäder** | Tadelakt-Beige, Anthrazit-Mosaik, Spa-Bad metallic, Mikrozement | premium |
| **Wandgestaltung Farbe** | Aubergine-Flur, Pflaume-Wohnzimmer, grüne Küche | solide, wohnlich |
| **Tapezieren / Fassade** | Damast-Tapete, Stadthaus-Fassade | gut |

**Kernerkenntnis fürs Redesign:** Die Arbeit ist luxuriös/künstlerisch — die alte Seite verschenkt das völlig. Wiederkehrende echte Farbwelten: **Aubergine/Pflaume, Rost/Kupfer, Marmor-Grau, Ocker/Terrakotta** + Markenorange `#E36B0A`.

## 3. Die drei Redesign-Versionen

Jede folgt den Storytelling-Flow-Regeln (Gradient-Übergänge statt Baukasten-Blöcke, schräge Bilder mit Hover-Ausrichtung, Story-Float über Section-Grenzen, nummerierte Editorial-Listen statt Icon-Karten, Scroll-Reveal mit `prefers-reduced-motion`). Bewusst **beide Reflex-Lanes der Skill vermieden** (Editorial-Serif & Dark-Agency-Kupfer).

| | Richtung | Farbe / Stimmung | Typografie | Galerie | Job |
|---|---|---|---|---|---|
| **[Version 1 — „Der Colorist"](version-1-colorist/index.html)** | hell, Farbatlas | Full-Palette aus echten Pigmenten, warmes Kreidepapier | Bricolage Grotesque + Hanken Grotesk | Masonry + Lightbox | Maler als **Colorist** |
| **[Version 2 — „Patina"](version-2-patina/index.html)** | dunkel, immersiv | Drenched Aubergine + Kreide; Farbe lebt nur in den Fotos | Spectral + Albert Sans | Film­strip (horizontal) + Lightbox | **Edeltechnik / Atelier** |
| **[Version 3 — „Handwerk"](version-3-handwerk/index.html)** | warm, vertrauensvoll | Committed Orange auf Kalkputz-Greige | Figtree (Single-Family, 300–900) | Filterbares Raster + Lightbox | **lokaler Profi → Anruf** |

Besonderheiten V3: Trust-Leiste, 3-Schritte-Ablauf, Filter (Edeltechnik/Bad/Wohnen/Fassade), **LocalBusiness-Structured-Data (JSON-LD)** für lokale SEO.

## 4. Ansehen

**Einstieg: [Canvas-Übersicht](index.html)** (`index.html` im Stamm) — zeigt alle drei Konzepte als skalierte Browser-Mockups nebeneinander, mit Auswahl-Button und Wunsch-Feld (Kundenpräsentation, „Schaufenster-Gold"). Auswahl wird in `localStorage` gespeichert.

Einzeln: Doppelklick auf eine `version-*/index.html` — oder lokal servern:

```powershell
node serve.mjs    # dann http://localhost:3050/  (Canvas) bzw. /version-1-colorist/
```

## 5. Qualitätsprüfung

- ✅ Impeccable-Detector: sauber (nur bewusste Single-Family-Notiz bei V3)
- ✅ Browser-Verifikation: Fonts/Farben korrekt, kein horizontaler Overflow (Desktop 1200 px & Mobile 375 px), Lightbox/Filter funktionieren, keine Konsolenfehler
- ⚠️ Inhalte sind aus der alten Seite übernommen; Telefon/Adresse/Impressum vor Live-Gang final gegenprüfen.

## Ordnerstruktur

```
raumdesign-rudek_redesign_Fable5/
├─ index.html             # ← Canvas-Übersicht (3 Konzepte nebeneinander)
├─ impressum.html         # sauberes Impressum (Footer-Verlinkung)
├─ assets/img/            # 24 kuratierte Bilder (sprechende Namen)
├─ assets/carousel.css|js # wiederverwendbares 3D-Zylinder-Karussell (Hero V1+V2)
├─ version-1-colorist/    # Redesign V1 (Karussell-Hero)
├─ version-2-patina/      # Redesign V2 (Karussell-Hero)
├─ version-3-handwerk/    # Redesign V3
├─ experiment-3d-karussell/ # Experiment: 3D-Zylinder mit Mausrad-Vollsteuerung
├─ serve.mjs              # kleiner lokaler Vorschau-Server
├─ quelle/                # NUR lokal: rohes Quellmaterial — aus Git & Deploy ausgeschlossen
└─ README.md
```
