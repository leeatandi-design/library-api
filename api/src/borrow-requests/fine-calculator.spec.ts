import { calculateFine } from './fine-calculator';

describe('calculateFine', () => {
  it('returns 0 when returned on time', () => {
    expect(calculateFine(new Date('2026-01-10'), new Date('2026-01-10'))).toBe(0);
  });

  it('charges for each day late', () => {
    expect(calculateFine(new Date('2026-01-10'), new Date('2026-01-13'))).toBe(30);
  });
});
