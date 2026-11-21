import { calculateFine } from './fine-calculator';

describe('calculateFine', () => {
  const ratePerDay = 2.5;

  it('should return 0 fine when returned on time or early', () => {
    const dueDate = new Date('2026-11-20T10:00:00Z');
    const onTimeReturn = new Date('2026-11-20T09:30:00Z');
    const earlyReturn = new Date('2026-11-15T10:00:00Z');

    expect(calculateFine(dueDate, onTimeReturn, ratePerDay)).toBe(0);
    expect(calculateFine(dueDate, earlyReturn, ratePerDay)).toBe(0);
  });

  it('should compute the correct fine when returned late', () => {
    const dueDate = new Date('2026-11-20T10:00:00Z');
    // 3 days late
    const lateReturn = new Date('2026-11-23T10:00:00Z');

    const fine = calculateFine(dueDate, lateReturn, ratePerDay);
    expect(fine).toBe(7.5); // 3 days * $2.50 = $7.50
  });

  it('should default ratePerDay to 1.0 if not provided', () => {
    const dueDate = new Date('2026-11-20T00:00:00Z');
    const lateReturn = new Date('2026-11-22T00:00:00Z'); // 2 days late

    const fine = calculateFine(dueDate, lateReturn);
    expect(fine).toBe(2.0);
  });
});
