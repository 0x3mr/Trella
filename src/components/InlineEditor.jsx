import { useState } from "react";

export default function InlineEditor({ value, onSave, ariaLabel }) {
  const [text, setText] = useState(value);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSave(text);
    } else if (e.key === "Escape") {
      setText(value); // Reset to original value
      e.target.blur();
    }
  };

  return (
    <input
      className="w-full border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={text}
      onChange={(e) => setText(e.target.value)}
      onBlur={() => onSave(text)}
      onKeyDown={handleKeyDown}
      autoFocus
      aria-label={ariaLabel || "Edit text"}
      type="text"
    />
  );
}