// fine-calculator.ts
export function calculateFine(dueDate: Date | string, returnDate: Date | string, ratePerDay = 10): number {
  const due = new Date(dueDate);
  const returned = new Date(returnDate);

  const daysLate = Math.max(
    0,
    Math.ceil((returned.getTime() - due.getTime()) / (1000 * 60 * 60 * 24)),
  );
  return daysLate * ratePerDay;
}
