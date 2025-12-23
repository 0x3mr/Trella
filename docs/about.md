# Trella - Kanban Board Application

## 🎮 Usage

### Basic Operations

**Add a List**:

1. Click "+ Add List" button
2. Type list title
3. Press Enter or click outside

**Add a Card**:

1. Click "+ Add a card" in any list
2. Enter card title
3. Press Enter

**Edit a Card**:

1. Click on any card
2. Modal opens with title, description, and tags
3. Make changes and click "Save"

**Move a Card**:

- **Mouse**: Drag and drop cards
- **Keyboard**: Tab to card → Space to pick up → Arrow keys to move → Space to drop

**Undo/Redo**:

- Ctrl+Z (or Cmd+Z) to undo
- Ctrl+Shift+Z (or Cmd+Shift+Z) to redo

### Testing Offline Mode

1. Open Chrome DevTools (F12)
2. Go to Network tab
3. Change throttling to "Offline"
4. Create/edit cards and lists (they save locally)
5. Switch back to "Online"
6. Watch automatic sync in header status

## 📜 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint (must pass with 0 errors)
npm run test         # Run tests (to be implemented)
npm run test:coverage # Run tests with coverage (to be implemented)
npm run e2e          # Run E2E tests (to be implemented)
```

## 🏗️ Architecture

### State Management

All board data flows through a central `boardReducer` with 15 action types. The `BoardProvider` wraps the app and provides state + dispatch via Context API. Components use `useBoardState` hook for clean API access.

### Data Persistence

Every state change is saved to localStorage. On app load, data is restored from localStorage. This enables full offline functionality.

### Sync Strategy

1. User action → Instant UI update (optimistic)
2. Operation queued in sync queue
3. Background sync attempts when online
4. On success: Remove from queue
5. On failure: Retry up to 3 times
6. Server data merged using three-way merge algorithm

### Conflict Resolution

When local and server versions conflict:

1. Compare base (last known), local, and server versions
2. If both modified same field → conflict detected
3. Auto-resolve when possible
4. Otherwise: Log conflict and default to server version
5. (Future: Show UI for manual resolution)

## 🧪 Testing

```bash
# Unit tests
npm run test

# Coverage report
npm run test:coverage

# E2E tests
npm run e2e
```

## 🎨 Styling

- **Tailwind CSS** for utility-first styling
- **Custom CSS** in `src/styles/` for complex components
- **Responsive design** mobile-friendly

## 📚 Documentation

Detailed essays in `docs/` directory:

- **architecture.md**: System design and component hierarchy
- **about.md**: General information about the board
