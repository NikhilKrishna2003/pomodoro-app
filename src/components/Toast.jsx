import { useEffect } from "react";
import "./Toast.css";

function Toast({ message, show, onClose }) {
  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="toast" onClick={onClose}>
      <span>{message}</span>
    </div>
  );
}

export default Toast;
