import { AlertTriangle } from "lucide-react";
import Modal from "./Modal";
import Button from "./Button";
export default function Confirm({ open, onClose, onConfirm, title = "Are you sure?", message, confirmLabel = "Confirm", danger }) {
  return (
    <Modal open={open} onClose={onClose} title={title}
      footer={<>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button variant={danger ? "danger" : "primary"} onClick={() => { onConfirm?.(); onClose?.(); }}>{confirmLabel}</Button>
      </>}>
      <div className="flex gap-3">
        {danger && <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-red-50 text-red-600"><AlertTriangle size={20} /></span>}
        <p className="text-sm text-navy-700">{message}</p>
      </div>
    </Modal>
  );
}
