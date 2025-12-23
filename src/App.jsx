import Header from "./components/Header";
import Toolbar from "./components/Toolbar";
import Board from "./components/Board";

export default function App() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header />
      <Toolbar />
      <main className="px-6 py-4">
        <Board />
      </main>
    </div>
  );
}
