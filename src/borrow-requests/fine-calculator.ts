/**
 * Calculates late return fine for borrow requests.
 * @param dueDate The deadline when the book was due to be returned
 * @param returnDate The actual date when the book was returned
 * @param ratePerDay Fine amount per day overdue
 * @returns Total fine amount rounded to two decimal places
 */
export function calculateFine(
  dueDate: Date | string,
  returnDate: Date | string,
  ratePerDay: number = 1.0,
): number {
  const due = new Date(dueDate);
  const returned = new Date(returnDate);

  // If returned on or before due date, fine is 0
  if (returned.getTime() <= due.getTime()) {
    return 0;
  }

  const diffInMs = returned.getTime() - due.getTime();
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysOverdue = Math.ceil(diffInMs / msPerDay);

  if (daysOverdue <= 0) {
    return 0;
  }

  const fine = daysOverdue * ratePerDay;
  return Math.round(fine * 100) / 100;
}
