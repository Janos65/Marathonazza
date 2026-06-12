import { describe, it, expect } from 'vitest'
import {
  getHoleOrder,
  calcNetScore,
  sumStrokes,
  isRoundComplete,
  scoreLabel,
  shortScoreLabel,
  isBirdieHole8,
} from './scoring'

describe('getHoleOrder', () => {
  it('wraps from starting hole 3', () => {
    expect(getHoleOrder(3)).toEqual([3, 4, 5, 6, 7, 8, 9, 1, 2])
  })
  it('returns 1..9 for starting hole 1', () => {
    expect(getHoleOrder(1)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9])
  })
  it('wraps from starting hole 7', () => {
    expect(getHoleOrder(7)).toEqual([7, 8, 9, 1, 2, 3, 4, 5, 6])
  })
})

describe('calcNetScore', () => {
  it('subtracts handicap once', () => {
    expect(calcNetScore(40, 8)).toBe(32)
  })
  it('can go below zero (handicap > strokes)', () => {
    expect(calcNetScore(20, 13)).toBe(7)
  })
})

describe('sumStrokes', () => {
  it('sums entered holes, ignoring nulls', () => {
    expect(sumStrokes({ 1: 4, 2: 3, 3: null })).toBe(7)
  })
  it('returns 0 for empty map', () => {
    expect(sumStrokes({})).toBe(0)
  })
})

describe('isRoundComplete', () => {
  it('false when a hole is missing', () => {
    const s = { 1: 4, 2: 3, 3: 4, 4: 5, 5: 4, 6: 3, 7: 4, 8: 2, 9: null }
    expect(isRoundComplete(s)).toBe(false)
  })
  it('false when fewer than 9 holes present', () => {
    expect(isRoundComplete({ 1: 4 })).toBe(false)
  })
  it('true when all 9 filled and > 0', () => {
    const s = { 1: 4, 2: 3, 3: 4, 4: 5, 5: 4, 6: 3, 7: 4, 8: 2, 9: 4 }
    expect(isRoundComplete(s)).toBe(true)
  })
})

describe('scoreLabel', () => {
  it('returns raw strokes when par null', () => {
    expect(scoreLabel(4, null)).toBe('4')
  })
  it('Birdie at -1', () => {
    expect(scoreLabel(2, 3)).toBe('Birdie')
  })
  it('Par at 0', () => {
    expect(scoreLabel(3, 3)).toBe('Par')
  })
  it('Eagle at -2 or better', () => {
    expect(scoreLabel(2, 4)).toBe('Eagle')
    expect(scoreLabel(1, 4)).toBe('Eagle')
  })
  it('Bogey at +1, Double at +2', () => {
    expect(scoreLabel(5, 4)).toBe('Bogey')
    expect(scoreLabel(6, 4)).toBe('Double')
  })
  it('+3 over', () => {
    expect(scoreLabel(7, 4)).toBe('+3')
  })
})

describe('shortScoreLabel', () => {
  it('shows B for birdie, "−" prefix and +N otherwise', () => {
    expect(shortScoreLabel(2, 3)).toBe('B')
    expect(shortScoreLabel(3, 3)).toBe('0')
    expect(shortScoreLabel(5, 4)).toBe('+1')
    expect(shortScoreLabel(2, 4)).toBe('−2')
  })
  it('returns empty string when no par or no strokes', () => {
    expect(shortScoreLabel(4, null)).toBe('')
    expect(shortScoreLabel(null, 4)).toBe('')
  })
})

describe('isBirdieHole8', () => {
  it('true only for hole 8 with 2 strokes', () => {
    expect(isBirdieHole8(8, 2)).toBe(true)
    expect(isBirdieHole8(8, 3)).toBe(false)
    expect(isBirdieHole8(7, 2)).toBe(false)
    expect(isBirdieHole8(8, null)).toBe(false)
  })
})
