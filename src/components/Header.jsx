export default function Header() {
  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-slate-200 bg-white">
      <h1 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
        Kanban
      </h1>

      <span className="text-sm px-3 py-1 rounded-full bg-violet-50 text-violet-600">
        Online
      </span>
    </header>
  );
}
