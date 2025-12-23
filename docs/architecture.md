# Architecture Choices

## System Design Overview

Trella's architecture follows a unidirectional data flow pattern with centralized state management using React's Context API and useReducer. This decision was made to ensure predictable state updates and easier debugging throughout the application lifecycle.

## Component Hierarchy

The component tree follows a strict hierarchy:
- `App.jsx` (root) wraps everything in `BoardProvider` 
- `Header.jsx` displays sync status and undo/redo controls
- `Toolbar.jsx` handles list creation
- `Board.jsx` manages drag-and-drop context and coordinates between lists
- `ListColumn.jsx` renders individual lists with their cards
- `Card.jsx` (memoized) displays task cards

This structure ensures clear data ownership where the `BoardProvider` in `src/context/BoardProvider.jsx` (lines 15-62) owns all state, while components only dispatch actions.

## State Ownership

All board state lives in `src/context/boardReducer.js`. The reducer pattern (lines 37-239) handles 15 action types covering lists, cards, sync operations, and history management. This centralized approach prevents prop-drilling and makes state changes traceable through Redux DevTools-style action logging.

## Data Flow

User interactions trigger callbacks in components → callbacks dispatch actions via `useBoardState` hook (src/hooks/useBoardState.js) → reducer updates state immutably → Context propagates changes → components re-render. For example, when a user adds a card in `ListColumn.jsx` (line 47), it calls `addCard` from `useBoardState` which dispatches `ADD_CARD` action to the reducer.

## Folder Structure Rationale

The structure separates concerns clearly:
- `components/` contains presentational React components
- `context/` holds global state logic (provider + reducer)
- `hooks/` provides reusable custom hooks that encapsulate complex logic
- `services/` handles external operations (API calls, storage)
- `utils/` contains pure helper functions
- `mocks/` isolates MSW server simulation

This organization makes it easy to locate functionality and promotes code reusability. The separation of `services/api.js` from components enables easy testing and potential future migration to different backend services.

## Performance Considerations

The `Card` component uses `React.memo` with custom comparison (src/components/Card.jsx, lines 67-76) to prevent unnecessary re-renders when parent lists update. The `useMemo` hook in `ListColumn.jsx` (line 22) memoizes card IDs for the sortable context, reducing computation on each render.