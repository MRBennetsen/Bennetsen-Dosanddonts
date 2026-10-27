# ⚖️ Fordele & Ulemper (Pros & Cons)

Et lynhurtigt, to-kolonnet beslutningsværktøj designet til at køre direkte på **Azure Static Web Apps**. 
Bygget med autentisk **VSCode Dark Mode**-æstetik, flersproget understøttelse (Dansk / Engelsk) og fuld tastaturnavigation, så du kan taste løs uden at røre musen.

---

## ✨ Funktioner

- **Emne / Beslutning**: Skriv overskriften på det valg du overvejer (f.eks. *Køb af elbil*, *Nyt jobtilbud*).
- **To kolonner (Word-stil)**:
  - 🟢 **Fordele (Pros)**
  - 🔴 **Ulemper (Cons)**
- **Tastaturgenveje (Hurtig indtastning)**:
  - `Enter`: Opret nyt punkt på næste linje (ligesom en punktopstilling i Word).
  - `Backspace`: Slet et tomt punkt og flyt fokus til forrige punkt.
  - `Tab` eller `Alt + →` / `Alt + ←`: Skift lynhurtigt mellem Fordele og Ulemper.
  - `Alt + 1`: Hop direkte til Fordele.
  - `Alt + 2`: Hop direkte til Ulemper.
  - `Alt + T`: Hop direkte til Emnefeltet.
  - `↑` / `↓`: Navigér lodret mellem punkterne.
  - `Alt + ↑` / `Alt + ↓`: Byt rækkefølge på punkterne.
  - `Ctrl + Shift + C`: Kopier hele listen pænt formatteret som Markdown.
  - `?`: Vis tastaturoversigt.
- **Sprogskifter**: Skift mellem **Dansk (DA)** og **Engelsk (EN)** med ét klik.
- **Temaer**:
  - **VSCode Dark Mode** (standard): Mørke editor-toner (`#1e1e1e`), VSCode cyan `#4ec9b0` og rød `#f14c4c`, statuslinje og knapper.
  - **Lys Mode**: Rent, minimalistisk lyst tema.
- **Lokal lagring (Offline/LocalStorage)**: Dit indhold gemmes automatisk i browseren, så du aldrig mister dine tanker.
- **Eksport**: Kopier alt direkte til udklipsholderen som Markdown klar til Teams, Slack, Word eller GitHub.

---

## 🚀 Hosting på Azure Static Web Apps

Denne app er statisk (HTML, CSS, JavaScript) og kræver ingen build-server, hvilket gør den optimal og lynhurtig at hoste på Azure Static Web Apps (gratis niveau).

### Mulighed 1: Opret via Azure Portal & GitHub (Anbefalet)

1. Opret et nyt repository på GitHub og push denne kode:
   ```bash
   git add .
   git commit -m "Initial commit: Pros and Cons webapp"
   git remote add origin https://github.com/<dit-brugernavn>/<dit-repo>.git
   git push -u origin main
   ```
2. Gå til [Azure Portal](https://portal.azure.com/).
3. Søg efter **Static Web Apps** og klik **Create**.
4. Udfyld oplysningerne:
   - **Subscription** & **Resource Group**
   - **Name**: f.eks. `bennetsen-pros-cons`
   - **Plan type**: `Free`
   - **Deployment details**: Vælg `GitHub` og godkend.
   - Vælg dit repository og branchen `main`.
5. Under **Build Details**:
   - **Build Presets**: Vælg `Custom`.
   - **App location**: `/`
   - **Api location**: *(efterlades tomt)*
   - **Output location**: *(efterlades tomt eller `/`)*
6. Klik **Review + create** -> **Create**.
   Azure opretter automatisk en GitHub Actions workflow og udruller dit website på få minutter!

### Mulighed 2: Deploy direkte med Azure Static Web Apps CLI (`swa`)

Hvis du foretrækker terminalen:
```bash
npm install -g @azure/static-web-apps-cli
swa deploy ./ --app-name bennetsen-pros-cons
```

---

## 📁 Filstruktur

```text
├── index.html                  # Hovedside og semantisk struktur
├── style.css                   # VSCode Dark & Light styling
├── app.js                      # Tastaturlogik, i18n, state og navigation
├── staticwebapp.config.json    # Azure SWA routing & sikkerhedskonfiguration
├── .gitignore                  # Git ignorerede filer
└── README.md                   # Dokumentation og vejledning
```

