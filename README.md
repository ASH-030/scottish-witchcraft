# The Scottish Witch Trials
### A scrolling data storyboard — 1563 to 1736

Built with D3.js and Python, using the [Survey of Scottish Witchcraft](https://datashare.ed.ac.uk/handle/10283/45) dataset from the University of Edinburgh.

---

## Project Structure

```
scottish-witchcraft/
├── data/
│   ├── raw/
│   │   └── witchcraft_survey_2003.mdb     # original Access database
│   └── processed/
│       ├── accused.csv
│       ├── cases.csv
│       ├── trials.csv
│       ├── confessions.csv
│       ├── torture.csv
│       ├── timeline.json                  # Chapter 1 data
│       ├── who.json                       # Chapter 2 data
│       ├── funnel.json                    # Chapter 3 data
│       └── charges.json                   # Chapter 4 data
├── scripts/
│   ├── extract.py                         # MDB → CSV
│   ├── explore.py                         # data exploration
│   └── prepare.ipynb                      # CSV → JSON for D3
├── src/
│   ├── index.html
│   ├── styles.css
│   ├── main.js
│   └── chapters/
│       ├── 01_timeline.js
│       ├── 02_who.js
│       ├── 03_funnel.js
│       └── 04_charges.js
├── vercel.json
└── README.md
```

---

## Setup

**1. Extract the data**
```bash
pip install pyodbc pandas
python scripts/extract.py
```

**2. Prepare JSON files**

Open and run `scripts/prepare.ipynb` in Jupyter from the project root.

**3. Run locally**

Open `src/index.html` directly in a browser, or use a local server:
```bash
npx serve src
```

---

## Chapters

| # | Title | Story |
|---|-------|-------|
| 0 | Prologue | Context and scale |
| 1 | The Wave | Accusations over time — the 1649 peak |
| 2 | Who They Were | 84% women, ordinary occupations |
| 3 | The Machinery | Accused → tried → convicted → executed |
| 4 | The Charges | What they were actually accused of |

---

## Data Source

> Goodare, Julian; Yeoman, Louise; Martin, Lauren; Miller, Joyce. (2003).
> *Survey of Scottish Witchcraft, 1563–1736*.
> University of Edinburgh.
> https://doi.org/10.7488/ds/100

---

## Deployment

Deployed via [Vercel](https://vercel.com). Connect the GitHub repository and Vercel will serve the `src/` directory automatically.
