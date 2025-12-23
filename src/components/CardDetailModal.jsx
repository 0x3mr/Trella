export default function CardDetailModal() {
  return (
    <div className="fixed inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6">
        <input
          className="w-full text-xl font-semibold border-b border-slate-200 focus:outline-none focus:border-violet-500"
          placeholder="Card title"
        />

        <textarea
          className="w-full mt-4 p-3 border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-violet-400"
          rows={5}
          placeholder="Description"
        />

        <div className="flex justify-end gap-2 mt-6">
          <button className="px-4 py-2 rounded-lg border border-slate-200">
            Cancel
          </button>
          <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
