export function allowOnlyNumbers(event: KeyboardEvent): boolean {
  const allowedKeys = [
    'Backspace',
    'Tab',
    'Enter',
    'ArrowLeft',
    'ArrowRight',
    'Delete',
  ];

  // Allow control keys
  if (allowedKeys.includes(event.key)) {
    return true;
  }

  // Allow digits 0–9
  if (/^\d$/.test(event.key)) {
    return true;
  }

  event.preventDefault(); // Block any other input
  return false;
}
