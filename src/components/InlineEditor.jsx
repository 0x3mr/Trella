import { useState } from "react";

export default function InlineEditor({ value, onSave }) {
  const [text, setText] = useState(value);

  return (
    <input
      className="w-full border rounded px-2 py-1"
      value={text}
      onChange={(e) => setText(e.target.value)}
      onBlur={() => onSave(text)}
      onKeyDown={(e) => e.key === "Enter" && onSave(text)}
      autoFocus
    />
  );
}
