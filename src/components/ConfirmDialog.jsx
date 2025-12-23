export default function ConfirmDialog({ local, server, onChoose }) {
  if (!local || !server) return null; // prevent rendering early

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-4 rounded w-96">
        <h2 className="font-bold mb-2">Conflict detected</h2>

        <div className="mb-2">
          <h3 className="font-semibold">Local</h3>
          <p>{local.title}</p>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold">Server</h3>
          <p>{server.title}</p>
        </div>

        <div className="flex gap-2">
          <button onClick={() => onChoose("local")} className="btn">
            Keep Local
          </button>
          <button onClick={() => onChoose("server")} className="btn">
            Keep Server
          </button>
        </div>
      </div>
    </div>
  );
}
