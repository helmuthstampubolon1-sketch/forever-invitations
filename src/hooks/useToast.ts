import { useSyncExternalStore } from "react";

type ToastItem = { id: number; message: string; duration: number };

let toasts: ToastItem[] = [];
const listeners = new Set<() => void>();
let nextId = 1;

function emit() {
  listeners.forEach((l) => l());
}

export function showToast(message: string, duration = 3000) {
  const id = nextId++;
  toasts = [...toasts, { id, message, duration }];
  emit();
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    emit();
  }, duration);
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
function getSnapshot() {
  return toasts;
}
function getServerSnapshot(): ToastItem[] {
  return [];
}

export function useToast() {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return { toasts: items, showToast };
}
