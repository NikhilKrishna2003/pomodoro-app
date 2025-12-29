import { useEffect } from "react";

export default function Toast({ show, message, onClose }) {
  useEffect(() => {
    if (!show) return;
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="toast" onClick={onClose}>
      {message}
    </div>
  );
}
