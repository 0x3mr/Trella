import Board from "./components/Board";
import Header from "./components/Header";
import Toolbar from "./components/Toolbar";
import { BoardProvider } from "./context/BoardProvider";

export default function App() {
  return (
    <BoardProvider>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <Toolbar />
        <Board />
      </div>
    </BoardProvider>
  );
}
