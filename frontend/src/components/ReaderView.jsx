import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Menu, 
  Settings, 
  Bookmark, 
  ChevronLeft, 
  ChevronRight,
  Sun,
  Moon,
  Type,
  AlignLeft,
  Highlighter,
  Palette
} from 'lucide-react';
import { HexColorPicker } from 'react-colorful';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Slider } from './ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { mockBooks, mockChapters, mockContent, readerSettings as defaultSettings } from '../mock';

const ReaderView = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [settings, setSettings] = useState({
    ...defaultSettings,
    customBgColor: '#ffffff',
    customTextColor: '#1e293b'
  });
  const [chapters, setChapters] = useState(mockChapters);
  const [bookmarks, setBookmarks] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const [selectedText, setSelectedText] = useState('');
  const [selectionPosition, setSelectionPosition] = useState({ x: 0, y: 0 });
  const [showSelectionMenu, setShowSelectionMenu] = useState(false);
  const [dictionaryData, setDictionaryData] = useState(null);
  const [showDictionary, setShowDictionary] = useState(false);

  useEffect(() => {
    // Load book data
    const foundBook = mockBooks.find(b => b.id === bookId);
    if (foundBook) {
      setBook(foundBook);
      setCurrentPage(foundBook.currentPage || 1);
      setBookmarks(foundBook.bookmarks || []);
      setHighlights(foundBook.highlights || []);
    }
  }, [bookId]);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (book && currentPage < book.totalPages) setCurrentPage(currentPage + 1);
  };

  const handleChapterClick = (page) => {
    setCurrentPage(page);
  };

  const toggleBookmark = () => {
    if (bookmarks.includes(currentPage)) {
      setBookmarks(bookmarks.filter(p => p !== currentPage));
    } else {
      setBookmarks([...bookmarks, currentPage]);
    }
  };

  const updateSetting = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    const text = selection.toString().trim();
    
    if (text.length > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      setSelectedText(text);
      setSelectionPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 10
      });
      setShowSelectionMenu(true);
      setShowDictionary(false);
    } else {
      setShowSelectionMenu(false);
      setShowDictionary(false);
    }
  };

  const handleHighlight = (color) => {
    if (selectedText) {
      const newHighlight = {
        id: `h${Date.now()}`,
        text: selectedText,
        color: color,
        page: currentPage,
        timestamp: new Date().toISOString()
      };
      setHighlights([...highlights, newHighlight]);
      setShowSelectionMenu(false);
      
      // Clear selection
      window.getSelection().removeAllRanges();
      setSelectedText('');
    }
  };

  const lookupDictionary = async () => {
    if (!selectedText) return;
    
    const word = selectedText.split(' ')[0].toLowerCase().replace(/[^a-z]/g, '');
    setShowDictionary(true);
    setDictionaryData({ loading: true });
    
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      if (response.ok) {
        const data = await response.json();
        setDictionaryData(data[0]);
      } else {
        setDictionaryData({ error: 'Definition not found' });
      }
    } catch (error) {
      setDictionaryData({ error: 'Failed to fetch definition' });
    }
  };

  const deleteHighlight = (id) => {
    setHighlights(highlights.filter(h => h.id !== id));
  };

  const getThemeStyles = () => {
    const themes = {
      light: { bg: 'bg-white', text: 'text-slate-900', bgColor: '#ffffff', textColor: '#1e293b' },
      sepia: { bg: 'bg-amber-50', text: 'text-amber-950', bgColor: '#fffbeb', textColor: '#451a03' },
      dark: { bg: 'bg-slate-800', text: 'text-slate-100', bgColor: '#1e293b', textColor: '#f1f5f9' },
      amoled: { bg: 'bg-black', text: 'text-white', bgColor: '#000000', textColor: '#ffffff' },
      custom: { bg: '', text: '', bgColor: settings.customBgColor, textColor: settings.customTextColor }
    };
    return themes[settings.theme] || themes.light;
  };

  const themeStyles = getThemeStyles();
  const progress = book ? Math.round((currentPage / book.totalPages) * 100) : 0;

  if (!book) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-slate-500">Loading book...</p>
      </div>
    );
  }

  return (
    <div 
      className={`min-h-screen transition-colors duration-300 ${settings.theme !== 'custom' ? `${themeStyles.bg} ${themeStyles.text}` : ''}`}
      style={settings.theme === 'custom' ? {
        backgroundColor: themeStyles.bgColor,
        color: themeStyles.textColor
      } : {}}
    >
      {/* Top Toolbar */}
      {showControls && (
        <div className="fixed top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/60 to-transparent backdrop-blur-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1 mx-4 text-center">
              <h2 className="text-sm font-medium text-white line-clamp-1">{book.title}</h2>
              <p className="text-xs text-white/70">{progress}% · Page {currentPage} of {book.totalPages}</p>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleBookmark}
                className="text-white hover:bg-white/20"
              >
                <Bookmark className={`w-5 h-5 ${bookmarks.includes(currentPage) ? 'fill-current' : ''}`} />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Reading Area */}
      <div
        className="px-6 py-20 max-w-3xl mx-auto cursor-pointer"
        onClick={() => setShowControls(!showControls)}
        onMouseUp={handleTextSelection}
        style={{
          fontSize: `${settings.fontSize}px`,
          fontFamily: settings.fontFamily === 'serif' ? 'Georgia, serif' : settings.fontFamily === 'sans' ? 'system-ui, sans-serif' : 'OpenDyslexic, sans-serif',
          lineHeight: settings.lineHeight,
          textAlign: settings.textAlign,
          color: settings.theme === 'custom' ? themeStyles.textColor : undefined
        }}
      >
        <div dangerouslySetInnerHTML={{ __html: mockContent }} />
      </div>

      {/* Text Selection Menu */}
      {showSelectionMenu && (
        <div
          className="fixed z-50 bg-white rounded-lg shadow-xl border border-slate-200 p-2 flex items-center gap-1"
          style={{
            left: `${selectionPosition.x}px`,
            top: `${selectionPosition.y}px`,
            transform: 'translate(-50%, -100%)'
          }}
        >
          <button
            onClick={() => handleHighlight('yellow')}
            className="p-2 hover:bg-slate-100 rounded transition-colors"
            title="Highlight Yellow"
          >
            <div className="w-6 h-6 rounded bg-yellow-300 border border-yellow-400" />
          </button>
          <button
            onClick={() => handleHighlight('green')}
            className="p-2 hover:bg-slate-100 rounded transition-colors"
            title="Highlight Green"
          >
            <div className="w-6 h-6 rounded bg-green-300 border border-green-400" />
          </button>
          <button
            onClick={() => handleHighlight('blue')}
            className="p-2 hover:bg-slate-100 rounded transition-colors"
            title="Highlight Blue"
          >
            <div className="w-6 h-6 rounded bg-blue-300 border border-blue-400" />
          </button>
          <button
            onClick={() => handleHighlight('pink')}
            className="p-2 hover:bg-slate-100 rounded transition-colors"
            title="Highlight Pink"
          >
            <div className="w-6 h-6 rounded bg-pink-300 border border-pink-400" />
          </button>
          <div className="w-px h-6 bg-slate-300 mx-1" />
          <button
            onClick={lookupDictionary}
            className="p-2 hover:bg-slate-100 rounded transition-colors"
            title="Dictionary"
          >
            <Type className="w-5 h-5 text-slate-700" />
          </button>
        </div>
      )}

      {/* Dictionary Popup */}
      {showDictionary && (
        <div
          className="fixed z-50 bg-white rounded-lg shadow-xl border border-slate-200 p-4 max-w-sm"
          style={{
            left: `${selectionPosition.x}px`,
            top: `${selectionPosition.y + 50}px`,
            transform: 'translateX(-50%)'
          }}
        >
          {dictionaryData?.loading ? (
            <div className="flex items-center gap-2 text-slate-600">
              <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm">Loading definition...</span>
            </div>
          ) : dictionaryData?.error ? (
            <div className="text-sm text-slate-600">
              <p className="font-semibold mb-1">"{selectedText}"</p>
              <p className="text-red-600">{dictionaryData.error}</p>
            </div>
          ) : dictionaryData ? (
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <h3 className="text-lg font-bold text-slate-900">{dictionaryData.word}</h3>
                <button
                  onClick={() => setShowDictionary(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ×
                </button>
              </div>
              {dictionaryData.phonetic && (
                <p className="text-sm text-slate-600 italic">{dictionaryData.phonetic}</p>
              )}
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {dictionaryData.meanings?.slice(0, 2).map((meaning, idx) => (
                  <div key={idx}>
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
                      {meaning.partOfSpeech}
                    </p>
                    <ol className="list-decimal list-inside space-y-1">
                      {meaning.definitions.slice(0, 2).map((def, defIdx) => (
                        <li key={defIdx} className="text-sm text-slate-700">
                          {def.definition}
                          {def.example && (
                            <p className="text-xs text-slate-500 italic mt-1 ml-5">
                              "{def.example}"
                            </p>
                          )}
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* Bottom Toolbar */}
      {showControls && (
        <div className="fixed bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/60 to-transparent backdrop-blur-sm">
          <div className="flex items-center justify-between px-4 py-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="text-white hover:bg-white/20 disabled:opacity-30"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>

            <div className="flex items-center gap-2">
              {/* Table of Contents */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Table of Contents</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-2">
                    {chapters.map((chapter) => (
                      <button
                        key={chapter.id}
                        onClick={() => handleChapterClick(chapter.page)}
                        className={`w-full text-left px-4 py-2 rounded-md hover:bg-slate-100 transition-colors ${
                          chapter.level === 1 ? 'pl-8 text-sm' : 'text-base font-medium'
                        } ${currentPage >= chapter.page ? 'text-slate-900' : 'text-slate-500'}`}
                      >
                        {chapter.title}
                      </button>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>

              {/* Settings Panel */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                    <Settings className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Reading Settings</SheetTitle>
                  </SheetHeader>
                  <Tabs defaultValue="display" className="mt-6">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="display">Display</TabsTrigger>
                      <TabsTrigger value="highlights">Highlights</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="display" className="space-y-6 mt-6">
                      {/* Theme Selection */}
                      <div>
                        <label className="text-sm font-medium mb-3 block">Theme</label>
                        <div className="grid grid-cols-2 gap-2">
                          {['light', 'sepia', 'dark', 'amoled', 'custom'].map((theme) => (
                            <button
                              key={theme}
                              onClick={() => updateSetting('theme', theme)}
                              className={`p-3 rounded-md border-2 transition-all capitalize ${
                                settings.theme === theme ? 'border-slate-900 bg-slate-50' : 'border-slate-200 hover:border-slate-300'
                              }`}
                            >
                              {theme === 'light' && <Sun className="w-5 h-5 mx-auto mb-1" />}
                              {theme === 'dark' && <Moon className="w-5 h-5 mx-auto mb-1" />}
                              {theme === 'custom' && <Palette className="w-5 h-5 mx-auto mb-1" />}
                              <span className="text-xs">{theme}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Custom Color Picker */}
                      {settings.theme === 'custom' && (
                        <div className="space-y-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                          <div>
                            <label className="text-sm font-medium mb-2 block">Background Color</label>
                            <HexColorPicker 
                              color={settings.customBgColor} 
                              onChange={(color) => updateSetting('customBgColor', color)}
                              className="w-full"
                            />
                            <div className="mt-2 flex items-center gap-2">
                              <div 
                                className="w-10 h-10 rounded border-2 border-slate-300"
                                style={{ backgroundColor: settings.customBgColor }}
                              />
                              <input
                                type="text"
                                value={settings.customBgColor}
                                onChange={(e) => updateSetting('customBgColor', e.target.value)}
                                className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded"
                                placeholder="#ffffff"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-sm font-medium mb-2 block">Text Color</label>
                            <HexColorPicker 
                              color={settings.customTextColor} 
                              onChange={(color) => updateSetting('customTextColor', color)}
                              className="w-full"
                            />
                            <div className="mt-2 flex items-center gap-2">
                              <div 
                                className="w-10 h-10 rounded border-2 border-slate-300"
                                style={{ backgroundColor: settings.customTextColor }}
                              />
                              <input
                                type="text"
                                value={settings.customTextColor}
                                onChange={(e) => updateSetting('customTextColor', e.target.value)}
                                className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded"
                                placeholder="#1e293b"
                              />
                            </div>
                          </div>

                          <div className="mt-4 p-3 rounded border-2" style={{ 
                            backgroundColor: settings.customBgColor,
                            color: settings.customTextColor
                          }}>
                            <p className="text-sm">Preview: This is how your text will look</p>
                          </div>
                        </div>
                      )}

                      {/* Font Size */}
                      <div>
                        <label className="text-sm font-medium mb-3 block">Font Size: {settings.fontSize}px</label>
                        <Slider
                          value={[settings.fontSize]}
                          onValueChange={(value) => updateSetting('fontSize', value[0])}
                          min={14}
                          max={28}
                          step={1}
                          className="w-full"
                        />
                      </div>

                      {/* Font Family */}
                      <div>
                        <label className="text-sm font-medium mb-3 block">Font Family</label>
                        <Select value={settings.fontFamily} onValueChange={(value) => updateSetting('fontFamily', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="serif">Serif</SelectItem>
                            <SelectItem value="sans">Sans-serif</SelectItem>
                            <SelectItem value="dyslexic">Dyslexic-friendly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Line Height */}
                      <div>
                        <label className="text-sm font-medium mb-3 block">Line Height: {settings.lineHeight}</label>
                        <Slider
                          value={[settings.lineHeight]}
                          onValueChange={(value) => updateSetting('lineHeight', value[0])}
                          min={1.2}
                          max={2.4}
                          step={0.1}
                          className="w-full"
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="highlights" className="mt-6">
                      {highlights.length === 0 ? (
                        <div className="text-center py-8 text-slate-500">
                          <Highlighter className="w-12 h-12 mx-auto mb-3 opacity-30" />
                          <p className="text-sm">No highlights yet</p>
                          <p className="text-xs mt-2">Select text while reading to highlight</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {highlights.map((highlight) => (
                            <div 
                              key={highlight.id} 
                              className="p-3 rounded-md border relative group"
                              style={{
                                backgroundColor: highlight.color === 'yellow' ? '#fef3c7' :
                                               highlight.color === 'green' ? '#d1fae5' :
                                               highlight.color === 'blue' ? '#dbeafe' :
                                               highlight.color === 'pink' ? '#fce7f3' : '#f1f5f9',
                                borderColor: highlight.color === 'yellow' ? '#fbbf24' :
                                            highlight.color === 'green' ? '#34d399' :
                                            highlight.color === 'blue' ? '#60a5fa' :
                                            highlight.color === 'pink' ? '#f472b6' : '#cbd5e1'
                              }}
                            >
                              <button
                                onClick={() => deleteHighlight(highlight.id)}
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/50 rounded"
                                title="Delete highlight"
                              >
                                <span className="text-slate-600 text-xs">×</span>
                              </button>
                              <p className="text-sm text-slate-700 mb-2 pr-6">"{highlight.text}"</p>
                              <div className="flex items-center gap-2 text-xs text-slate-600">
                                <span>Page {highlight.page}</span>
                                <span>•</span>
                                <span>{new Date(highlight.timestamp).toLocaleDateString()}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </SheetContent>
              </Sheet>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleNextPage}
              disabled={currentPage >= book.totalPages}
              className="text-white hover:bg-white/20 disabled:opacity-30"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="h-1 bg-white/20">
            <div 
              className="h-full bg-white transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ReaderView;
