import { describe, it, expect } from 'vitest'

// Utility functions from name-card.tsx
const usageQuantityFormat = (score: number) => {
  if (score >= 1000) {
    return `${(score / 1000).toFixed(1)}K`;
  }
  return score.toString();
}

const MAX_USAGE_SCORE = 603004; // from shared/constants/names

function useageToString(score: number): string {
  const usageDictionary: Record<number, string> = {
    1: "Poco Usado",
    2: "Usado",
    3: "Muy usado"
  }

  const normalized = Math.log(score) / Math.log(MAX_USAGE_SCORE);
  return usageDictionary[Math.max(1, Math.round(normalized * 2) + 1)];
}

describe('usageQuantityFormat', () => {
  it('should return the number as string when less than 1000', () => {
    expect(usageQuantityFormat(10)).toBe('10')
    expect(usageQuantityFormat(500)).toBe('500')
    expect(usageQuantityFormat(999)).toBe('999')
  })

  it('should format numbers >= 1000 with K suffix and 1 decimal', () => {
    expect(usageQuantityFormat(1000)).toBe('1.0K')
    expect(usageQuantityFormat(1500)).toBe('1.5K')
    expect(usageQuantityFormat(5432)).toBe('5.4K')
    expect(usageQuantityFormat(10000)).toBe('10.0K')
  })
})

describe('useageToString', () => {
  it('should return "Poco Usado" for very low usage scores', () => {
    expect(useageToString(1)).toBe('Poco Usado')
    expect(useageToString(10)).toBe('Poco Usado')
  })

  it('should return "Usado" for low to medium usage scores', () => {
    expect(useageToString(100)).toBe('Usado')
    expect(useageToString(1000)).toBe('Usado')
    expect(useageToString(5000)).toBe('Usado')
  })

  it('should return "Muy usado" for high usage scores', () => {
    expect(useageToString(50000)).toBe('Muy usado')
    expect(useageToString(100000)).toBe('Muy usado')
    expect(useageToString(603004)).toBe('Muy usado')
  })
})
