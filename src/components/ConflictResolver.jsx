export default function ConflictResolver({ local, server, onResolve }) {
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-[500px]">
        <h2 className="font-bold mb-4">Conflict detected</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold">Your version</h3>
            <pre>{JSON.stringify(local, null, 2)}</pre>
          </div>

          <div>
            <h3 className="font-semibold">Server version</h3>
            <pre>{JSON.stringify(server, null, 2)}</pre>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={() => onResolve("local")}>Keep mine</button>
          <button onClick={() => onResolve("server")}>Use server</button>
        </div>
      </div>
    </div>
  );
}
