# Stopword Removal & Keyword Extraction System

> A web-based NLP application for English stopword removal, keyword extraction, frequency analysis, and text statistics.

**Remove common words, discover meaningful keywords, and analyze text with NLP.**

An academic project for **Text and Speech Analysis**. The whole NLP pipeline is written in TypeScript and runs **locally in the browser**: no backend, no database, no authentication, no API keys, and no external AI services.

---

## Project Overview

The application takes raw English text, runs it through a classic text-preprocessing pipeline, and presents the results in a SaaS-style analytics dashboard: cleaned text, removed stopwords, ranked keywords, a frequency chart, a keyword explorer, and detailed statistics. Results can be copied to the clipboard or downloaded as a text report.

```
Raw Text → Normalization → Tokenization → Stopword Detection → Stopword Removal
         → Frequency Analysis → Keyword Extraction → Keyword Ranking
```

## Objectives

- Demonstrate fundamental NLP preprocessing: tokenization and stopword removal.
- Show how word frequency can be used to extract the key concepts of a document.
- Make every pipeline stage visible and measurable with live statistics.
- Keep NLP logic cleanly separated from the user interface.

## Features

- **Text input** with live character and word counts, a long sample article, and Analyze / Load Sample / Clear buttons.
- **Stopword removal** using a built-in dictionary of about 300 English stopwords and contractions, with an on/off toggle.
- **Original vs filtered text** panels with stopwords dimmed and keywords highlighted, plus words removed and reduction percentage.
- **Removed stopwords** shown as chips with counts, a search filter, total and unique counts, and the most frequent stopwords.
- **Keyword extraction** with rank, frequency, percentage, and relative importance.
- **Keyword frequency chart**: horizontal bar chart for the Top 5 / 10 / 15 / 20 keywords, drawn from the real results.
- **Keyword explorer**: search a word to see its frequency, percentage, rank, and status (Extracted Keyword, Stopword, Not Found).
- **Statistics cards**: characters, words, unique words, stopwords found and removed, meaningful words, unique keywords, most frequent keyword, reduction percentage.
- **Filter settings**: minimum keyword length (2-5) and maximum keywords (5-30) update the results instantly.
- **Copy Results** to the clipboard and **Download Report** as `stopword_keyword_analysis.txt`.
- **Light and dark mode**, saved in `localStorage`, and a responsive layout for desktop, tablet, and mobile.
- **Friendly error handling** for empty input, very short input, text with no readable words, no stopwords, no keywords, and searches that find nothing.

## NLP Concepts

### Stopword removal
Stopwords are very common function words (*the, is, and, of, to, in*) that hold sentences together but say little about topic. Removing them during preprocessing reduces noise and shrinks the data, so the remaining words describe the document better. The dictionary lives in `src/utils/stopwords.ts` and also contains contractions such as *don't* and *it's*. Words that often carry topical meaning (such as *used* or *many*) are intentionally not included.

### Keyword extraction
Keyword extraction finds the words that best represent the main concepts of a document. This project uses a transparent, frequency-based method:

1. Normalize the text (unify apostrophes, collapse whitespace, lowercase).
2. Tokenize it into words (punctuation is dropped; contractions stay whole; possessives like *model's* become *model*).
3. Remove stopwords.
4. Ignore irrelevant tokens: pure numbers and words shorter than the minimum length.
5. Count the frequency of every remaining word.
6. Rank by frequency (ties keep the order of first appearance).
7. Return the strongest keywords, up to the chosen maximum.

For each keyword:

| Value | Meaning |
|---|---|
| **Frequency** | Number of occurrences in the text |
| **Percentage** | Frequency ÷ meaningful words × 100 (meaningful words = words that remain after all filters) |
| **Relative importance** | Frequency ÷ frequency of the top keyword × 100 |

Other reported figures: *Reduction percentage* = stopwords removed ÷ original words × 100.

## Technology Stack

React 19 · TypeScript · Vite · Tailwind CSS 3 · Lucide React icons · Vitest (unit tests for the NLP logic). Fonts (Bricolage Grotesque, IBM Plex Sans/Mono) are bundled through Fontsource, so the app works fully offline.

## Processing Pipeline

| # | Stage | What happens |
|---|---|---|
| 1 | Raw Text | The input exactly as entered |
| 2 | Text Normalization | Quotes unified, whitespace collapsed, lowercased |
| 3 | Tokenization | Text split into word tokens |
| 4 | Stopword Detection | Tokens checked against the dictionary |
| 5 | Stopword Removal | Matching tokens filtered out (toggle) |
| 6 | Frequency Analysis | Numbers and short words ignored; the rest counted |
| 7 | Keyword Extraction | Each distinct remaining word becomes a candidate |
| 8 | Keyword Ranking | Candidates sorted; top keywords returned |

The "How the NLP Pipeline Works" section of the app shows the live numbers for each stage after an analysis.

## Installation

Requires **Node.js 18 or newer**.

```bash
git clone https://github.com/<your-username>/Stopword-Removal-and-Keyword-Extraction.git
cd Stopword-Removal-and-Keyword-Extraction
npm install
npm run dev
```

Then open the URL printed in the terminal (usually http://localhost:5173).

Other commands:

```bash
npm run build     # type-check and create the production build in dist/
npm run preview   # serve the production build locally
npm test          # run the NLP unit tests
```

## Usage

1. Paste your text into **Enter Your Text**, or click **Load Sample**.
2. Click **Analyze Text** (or press Ctrl/⌘ + Enter).
3. Adjust **Remove English Stopwords**, **Minimum Keyword Length**, and **Maximum Keywords**. The results update immediately.
4. Explore the statistics, text comparison, removed stopwords, chart, ranking table, and **Keyword Explorer**.
5. Click **Copy Results** or **Download Report** to export the analysis.
6. Use the sun/moon button in the header to switch between light and dark mode.

## Project Structure

```text
src/
├── components/
│   ├── Header.tsx           # navigation + theme toggle
│   ├── Hero.tsx             # title and live pipeline preview
│   ├── TextInput.tsx        # input card and action buttons
│   ├── StopwordControl.tsx  # stopword explanation + removal toggle
│   ├── SettingsPanel.tsx    # minimum length / maximum keywords
│   ├── Statistics.tsx       # statistic cards
│   ├── TextComparison.tsx   # original vs filtered text
│   ├── StopwordPanel.tsx    # removed stopwords + search
│   ├── KeywordChart.tsx     # horizontal frequency chart
│   ├── KeywordTable.tsx     # keyword ranking table
│   ├── KeywordExplorer.tsx  # word lookup
│   ├── Pipeline.tsx         # how the pipeline works
│   ├── Education.tsx        # stopwords & keyword extraction explained
│   ├── About.tsx            # about this project
│   ├── Footer.tsx
│   ├── Toast.tsx            # notifications
│   └── ui.tsx               # shared UI primitives
├── hooks/
│   └── useTheme.ts          # light/dark mode with localStorage
├── utils/                   # all NLP logic (no React)
│   ├── stopwords.ts         # stopword dictionary
│   ├── textProcessor.ts     # normalization + tokenization
│   ├── keywordExtractor.ts  # analysis, ranking, word lookup
│   ├── report.ts            # copy / download report text
│   ├── format.ts            # number formatting
│   ├── sampleText.ts        # sample article + example sentence
│   └── nlp.test.ts          # unit tests
├── types.ts
├── App.tsx
├── main.tsx
└── index.css
```

## Example

**Original**

> The field of natural language processing is used in many artificial intelligence applications.

**After stopword removal** (*the, of, is, in* removed: 4 of 13 words, a 30.8% reduction)

> field natural language processing used many artificial intelligence applications

**Core topic terms:** natural, language, processing, artificial, intelligence, applications. In a one-sentence input every remaining word appears once and ranks equally; frequency separates them in longer texts.

## Future Enhancements

- Stemming or lemmatization so that *application* and *applications* count as one keyword.
- TF-IDF, RAKE, or TextRank scoring for multi-document and phrase-level keywords.
- N-gram (multi-word) keyword extraction, such as "natural language processing".
- Custom stopword lists and support for other languages.
- File upload (.txt, .pdf) and export to CSV/PDF.
- Word clouds and sentiment analysis.

## Academic Relevance

The project covers core topics of **Text and Speech Analysis**: text normalization, tokenization, stopword filtering, term-frequency analysis, and keyword extraction. These are the standard preprocessing steps that precede search, classification, summarization, and speech-transcript analysis. Because every stage is implemented in plain TypeScript and shown with live statistics, the application doubles as a teaching aid for how classic NLP pipelines work.

## Author

**Student:** Bavyashree S
**Department:** Computer Science and Engineering
**Institution:** Prathyusha Engineering College

---

*Suggested repository name:* `Stopword-Removal-and-Keyword-Extraction`
*Suggested GitHub description:* A web-based NLP application for English stopword removal, keyword extraction, frequency analysis, and text statistics.
