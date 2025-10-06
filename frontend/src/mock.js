// Mock data for EPUB reader

export const mockBooks = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&q=80',
    progress: 45,
    lastRead: '2025-09-15T14:30:00Z',
    totalPages: 180,
    currentPage: 81,
    bookmarks: [12, 45, 78],
    highlights: [
      { id: 'h1', chapter: 1, text: 'So we beat on, boats against the current...', color: 'yellow', note: 'Beautiful ending' }
    ]
  },
  {
    id: '2',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80',
    progress: 12,
    lastRead: '2025-09-14T10:20:00Z',
    totalPages: 432,
    currentPage: 52,
    bookmarks: [5],
    highlights: []
  },
  {
    id: '3',
    title: '1984',
    author: 'George Orwell',
    cover: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&q=80',
    progress: 78,
    lastRead: '2025-09-16T20:15:00Z',
    totalPages: 328,
    currentPage: 256,
    bookmarks: [23, 67, 89, 120],
    highlights: [
      { id: 'h2', chapter: 3, text: 'War is peace. Freedom is slavery...', color: 'red', note: 'Party slogans' }
    ]
  },
  {
    id: '4',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&q=80',
    progress: 0,
    lastRead: null,
    totalPages: 281,
    currentPage: 0,
    bookmarks: [],
    highlights: []
  }
];

export const mockChapters = [
  { id: 1, title: 'Chapter I', level: 0, page: 1 },
  { id: 2, title: 'Chapter II', level: 0, page: 15 },
  { id: 3, title: 'The Valley of Ashes', level: 1, page: 23 },
  { id: 4, title: 'Chapter III', level: 0, page: 39 },
  { id: 5, title: 'Chapter IV', level: 0, page: 65 },
  { id: 6, title: 'Chapter V', level: 0, page: 81 },
  { id: 7, title: 'Chapter VI', level: 0, page: 99 },
  { id: 8, title: 'Chapter VII', level: 0, page: 117 },
  { id: 9, title: 'Chapter VIII', level: 0, page: 147 },
  { id: 10, title: 'Chapter IX', level: 0, page: 163 }
];

export const mockContent = `
  <div class="chapter">
    <h1>Chapter I</h1>
    <p>In my younger and more vulnerable years my father gave me some advice that I've been turning over in my mind ever since.</p>
    <p>"Whenever you feel like criticizing anyone," he told me, "just remember that all the people in this world haven't had the advantages that you've had."</p>
    <p>He didn't say any more, but we've always been unusually communicative in a reserved way, and I understood that he meant a great deal more than that. In consequence, I'm inclined to reserve all judgements, a habit that has opened up many curious natures to me and also made me the victim of not a few veteran bores.</p>
    <p>The abnormal mind is quick to detect and attach itself to this quality when it appears in a normal person, and so it came about that in college I was unjustly accused of being a politician, because I was privy to the secret griefs of wild, unknown men.</p>
    <p>Most of the confidences were unsought—frequently I have feigned sleep, preoccupation, or a hostile levity when I realized by some unmistakable sign that an intimate revelation was quivering on the horizon; for the intimate revelations of young men, or at least the terms in which they express them, are usually plagiaristic and marred by obvious suppressions.</p>
  </div>
`;

export const readerSettings = {
  fontSize: 18,
  fontFamily: 'serif',
  lineHeight: 1.6,
  theme: 'light',
  textAlign: 'justify',
  pageTransition: 'slide',
  customBgColor: '#ffffff',
  customTextColor: '#1e293b'
};
