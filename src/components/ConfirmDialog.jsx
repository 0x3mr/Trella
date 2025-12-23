export default function ConfirmDialog() {
  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm">
        <h3 className="font-semibold text-lg text-slate-800">
          Are you sure?
        </h3>

        <p className="text-sm text-slate-500 mt-2">
          This action cannot be undone.
        </p>

        <div className="flex justify-end gap-2 mt-6">
          <button className="px-4 py-2 rounded-lg border border-slate-200">
            Cancel
          </button>
          <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
