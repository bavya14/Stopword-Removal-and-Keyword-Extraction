import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Copy, Download, FileSearch, RefreshCw } from 'lucide-react';
import About from './components/About';
import Education from './components/Education';
import Footer from './components/Footer';
import Header from './components/Header';
import Hero from './components/Hero';
import KeywordChart from './components/KeywordChart';
import KeywordExplorer from './components/KeywordExplorer';
import KeywordTable from './components/KeywordTable';
import Pipeline from './components/Pipeline';
import SettingsPanel from './components/SettingsPanel';
import Statistics from './components/Statistics';
import StopwordControl from './components/StopwordControl';
import StopwordPanel from './components/StopwordPanel';
import TextComparison from './components/TextComparison';
import TextInput, { type Notice } from './components/TextInput';
import Toast, { type ToastMessage } from './components/Toast';
import { Card, CardHeading } from './components/ui';
import { useTheme } from './hooks/useTheme';
import { analyzeText, DEFAULT_OPTIONS } from './utils/keywordExtractor';
import { buildReport } from './utils/report';
import { SAMPLE_TEXT } from './utils/sampleText';
import { countWords } from './utils/textProcessor';

const SHORT_TEXT_WORDS = 8;

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for browsers or contexts where the Clipboard API is unavailable.
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(area);
    return ok;
  }
}

export default function App() {
  const { theme, toggleTheme } = useTheme();

  const [text, setText] = useState('');
  const [analyzedText, setAnalyzedText] = useState<string | null>(null);
  const [analysisId, setAnalysisId] = useState(0);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const [removeStopwords, setRemoveStopwords] = useState(DEFAULT_OPTIONS.removeStopwords);
  const [minLength, setMinLength] = useState(DEFAULT_OPTIONS.minLength);
  const [maxKeywords, setMaxKeywords] = useState(DEFAULT_OPTIONS.maxKeywords);

  const resultsRef = useRef<HTMLDivElement>(null);
  const toastTimer = useRef<number>(undefined);

  const wordCount = useMemo(() => countWords(text), [text]);

  // Results react live to the settings; the text itself is only analyzed on demand.
  const result = useMemo(
    () => (analyzedText === null ? null : analyzeText(analyzedText, { removeStopwords, minLength, maxKeywords })),
    [analyzedText, removeStopwords, minLength, maxKeywords],
  );

  const showToast = useCallback((message: string, type: ToastMessage['type'] = 'success') => {
    window.clearTimeout(toastTimer.current);
    setToast({ id: Date.now(), type, message });
    toastTimer.current = window.setTimeout(() => setToast(null), 2800);
  }, []);

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  // Scroll to the results after each new analysis.
  useEffect(() => {
    if (analysisId > 0) resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [analysisId]);

  const handleAnalyze = () => {
    if (text.trim() === '') {
      setNotice({ type: 'error', message: 'Please enter some text first, or click Load Sample to try an example.' });
      return;
    }
    if (wordCount === 0) {
      setNotice({
        type: 'error',
        message: 'No readable words were found. Enter English text that contains letters or numbers.',
      });
      return;
    }
    setNotice(
      wordCount < SHORT_TEXT_WORDS
        ? {
            type: 'info',
            message: `This text is very short (${wordCount} ${wordCount === 1 ? 'word' : 'words'}). Keyword frequencies will be mostly 1, so try a longer paragraph for meaningful rankings.`,
          }
        : null,
    );
    setAnalyzedText(text);
    setAnalysisId((id) => id + 1);
  };

  const handleLoadSample = () => {
    setText(SAMPLE_TEXT);
    setNotice(null);
    showToast('Sample loaded. Click Analyze Text to run the pipeline.');
  };

  const handleClear = () => {
    setText('');
    setAnalyzedText(null);
    setNotice(null);
  };

  const handleCopy = async () => {
    if (!result) return;
    const ok = await copyToClipboard(buildReport(result));
    if (ok) showToast('Analysis copied to clipboard');
    else showToast('Copy failed. Your browser blocked clipboard access.', 'error');
  };

  const handleDownload = () => {
    if (!result) return;
    const blob = new Blob([buildReport(result)], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'stopword_keyword_analysis.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast('Report downloaded: stopword_keyword_analysis.txt');
  };

  const isStale = analyzedText !== null && analyzedText !== text;

  return (
    <div id="top" className="min-h-screen">
      <Header theme={theme} onToggleTheme={toggleTheme} />

      <main>
        <Hero />

        <section id="analyzer" className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-20">
          <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <TextInput
              text={text}
              characterCount={text.length}
              wordCount={wordCount}
              notice={notice}
              onChange={setText}
              onLoadSample={handleLoadSample}
              onAnalyze={handleAnalyze}
              onClear={handleClear}
            />
            <div className="space-y-5">
              <StopwordControl enabled={removeStopwords} onChange={setRemoveStopwords} />
              <SettingsPanel
                minLength={minLength}
                maxKeywords={maxKeywords}
                onMinLengthChange={setMinLength}
                onMaxKeywordsChange={setMaxKeywords}
              />
            </div>
          </div>

          <div ref={resultsRef} className="mt-10 scroll-mt-24">
            {result && analyzedText !== null ? (
              <div className="space-y-5">
                <Card className="p-5 sm:p-6">
                  <CardHeading
                    as="h2"
                    icon={FileSearch}
                    title="Analysis Results"
                    description={result.summary}
                    action={
                      <div className="flex flex-wrap gap-2">
                        <button type="button" onClick={handleCopy} className="btn-secondary">
                          <Copy className="h-4 w-4" aria-hidden />
                          Copy Results
                        </button>
                        <button type="button" onClick={handleDownload} className="btn-primary">
                          <Download className="h-4 w-4" aria-hidden />
                          Download Report
                        </button>
                      </div>
                    }
                  />
                  {isStale && (
                    <p className="mt-4 flex items-center gap-2 rounded-xl border border-mark/50 bg-mark/15 px-3.5 py-2.5 text-sm">
                      <RefreshCw className="h-4 w-4 shrink-0" aria-hidden />
                      The text changed since this analysis. Click Analyze Text to refresh the results.
                    </p>
                  )}
                </Card>

                <Statistics stats={result.stats} maxKeywords={maxKeywords} />
                <TextComparison originalText={analyzedText} result={result} />
                <StopwordPanel result={result} />

                <div className="pt-4">
                  <h2 className="text-2xl font-semibold sm:text-3xl">Extracted Keywords</h2>
                  <p className="mt-2 text-sm text-muted">
                    Ranked by frequency after stopword removal. Change the filter settings above to update these results
                    instantly.
                  </p>
                </div>
                <KeywordChart keywords={result.keywords} />
                <KeywordTable keywords={result.keywords} />
                <KeywordExplorer result={result} />
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-line px-6 py-14 text-center">
                <FileSearch className="mx-auto h-9 w-9 text-muted" aria-hidden />
                <h2 className="mt-4 text-xl font-semibold">Your analysis will appear here</h2>
                <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
                  Enter some text and click Analyze Text to see statistics, removed stopwords, ranked keywords, and a
                  frequency chart.
                </p>
              </div>
            )}
          </div>
        </section>

        <Pipeline result={result} />
        <Education />
        <About />
      </main>

      <Footer />
      <Toast toast={toast} />
    </div>
  );
}
