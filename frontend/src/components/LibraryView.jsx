import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Grid3x3, List, BookOpen } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Progress } from './ui/progress';
import { mockBooks } from '../mock';

const LibraryView = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    // Simulate loading books from IndexedDB
    setBooks(mockBooks);
  }, []);

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBookClick = (bookId) => {
    navigate(`/reader/${bookId}`);
  };

  const handleAddBook = () => {
    // Mock file upload
    alert('EPUB upload feature - In a full implementation, this would open a file picker');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not started';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-8 h-8 text-slate-800" />
              <h1 className="text-2xl font-bold text-slate-900">My Library</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              >
                {viewMode === 'grid' ? <List className="w-5 h-5" /> : <Grid3x3 className="w-5 h-5" />}
              </Button>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Search books or authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-50 border-slate-200 focus:ring-slate-300"
            />
          </div>
        </div>
      </div>

      {/* Books Grid/List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredBooks.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg mb-6">
              {searchQuery ? 'No books found' : 'Your library is empty'}
            </p>
            <Button onClick={handleAddBook} className="bg-slate-900 hover:bg-slate-800">
              <Plus className="w-5 h-5 mr-2" />
              Add Your First Book
            </Button>
          </div>
        ) : (
          <>
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6'
              : 'flex flex-col gap-4'
            }>
              {filteredBooks.map((book) => (
                <Card
                  key={book.id}
                  className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-slate-200 overflow-hidden"
                  onClick={() => handleBookClick(book.id)}
                >
                  {viewMode === 'grid' ? (
                    <div>
                      <div className="aspect-[2/3] overflow-hidden bg-slate-100">
                        <img
                          src={book.cover}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-3">
                        <h3 className="font-semibold text-sm text-slate-900 line-clamp-2 mb-1">
                          {book.title}
                        </h3>
                        <p className="text-xs text-slate-600 mb-2 line-clamp-1">{book.author}</p>
                        {book.progress > 0 && (
                          <div className="space-y-1">
                            <Progress value={book.progress} className="h-1" />
                            <p className="text-xs text-slate-500">{book.progress}% complete</p>
                          </div>
                        )}
                      </CardContent>
                    </div>
                  ) : (
                    <div className="flex gap-4 p-4">
                      <div className="w-20 h-28 flex-shrink-0 overflow-hidden rounded bg-slate-100">
                        <img
                          src={book.cover}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900 mb-1">{book.title}</h3>
                        <p className="text-sm text-slate-600 mb-2">{book.author}</p>
                        <p className="text-xs text-slate-500 mb-2">Last read: {formatDate(book.lastRead)}</p>
                        {book.progress > 0 && (
                          <div className="space-y-1">
                            <Progress value={book.progress} className="h-1.5" />
                            <p className="text-xs text-slate-500">{book.progress}% complete</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Floating Add Button */}
      <Button
        onClick={handleAddBook}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg bg-slate-900 hover:bg-slate-800 hover:shadow-xl transition-all duration-300"
        size="icon"
      >
        <Plus className="w-6 h-6" />
      </Button>
    </div>
  );
};

export default LibraryView;
