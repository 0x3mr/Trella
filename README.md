# Trella - Kanban Board Application

A collaborative, offline-first Kanban board built with React, featuring drag-and-drop, optimistic updates, conflict resolution, and full accessibility support.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone or download the project
cd trella

# Install dependencies
npm install

# Initialize MSW
# npx msw init public/ --save

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## 📁 Project Structure

```
trella/
├── src/
│   ├── components/         # React components
│   │   ├── Board.jsx       # Main board with drag-and-drop
│   │   ├── ListColumn.jsx  # List container with cards
│   │   ├── Card.jsx        # Individual card (memoized)
│   │   ├── CardDetailModal.jsx  # Card editing modal (lazy-loaded)
│   │   ├── Header.jsx      # App header with sync status
│   │   ├── Toolbar.jsx     # Action toolbar
│   │   ├── ConfirmDialog.jsx    # Confirmation modal
│   │   └── InlineEditor.jsx     # Inline text editor
│   ├── context/           # State management
│   │   ├── BoardProvider.jsx    # Context provider
│   │   └── boardReducer.js      # State reducer
│   ├── hooks/             # Custom React hooks
│   │   ├── useBoardState.js     # Board operations
│   │   ├── useOfflineSync.js    # Sync logic
│   │   └── useUndoRedo.js       # Undo/redo functionality
│   ├── services/          # External services
│   │   ├── api.js         # API calls
│   │   └── storage.js     # localStorage handlers
│   ├── utils/             # Helper functions
│   │   ├── validators.js  # Input validation
│   │   └── helpers.js     # Utility functions
│   ├── mocks/             # MSW mock server
│   │   ├── handlers.js    # API handlers
│   │   └── browser.js     # MSW setup
│   ├── styles/            # CSS files
│   │   ├── global.css     # Global styles
│   │   └── components.css # Component styles
│   ├── App.jsx            # Root component
│   └── main.jsx           # Entry point
├── docs/                  # Documentation
│   ├── architecture.md
│   └── about.md
├── package.json
├── vite.config.js
├── .eslintrc.cjs
└── .prettierrc
```

## ✨ Features

### Core Functionality
- ✅ **Lists Management**: Create, rename, and archive lists
- ✅ **Cards Management**: Add, edit, delete cards with title, description, and tags
- ✅ **Drag & Drop**: Reorder cards within lists and move between lists using @dnd-kit
- ✅ **Offline Mode**: Full functionality without internet connection
- ✅ **Optimistic Updates**: Instant UI feedback with background sync
- ✅ **Conflict Resolution**: Three-way merge algorithm for offline conflicts
- ✅ **Undo/Redo**: Multi-level history with Ctrl+Z / Ctrl+Shift+Z shortcuts

### Technical Features
- ✅ **State Management**: useReducer + Context API
- ✅ **Persistence**: localStorage for offline data
- ✅ **Sync Queue**: Background sync with retry logic
- ✅ **Code Splitting**: Lazy-loaded modal components
- ✅ **Memoization**: React.memo for Card components
- ✅ **Mock Server**: MSW for simulating API with delays/failures

### Accessibility
- ✅ **Keyboard Navigation**: Full keyboard support for all operations
- ✅ **Focus Management**: Focus trapping in modals
- ✅ **ARIA Labels**: Comprehensive ARIA attributes
- ✅ **Screen Reader**: Semantic HTML and proper roles
- ✅ **WCAG AA**: Color contrast compliance