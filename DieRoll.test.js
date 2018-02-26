import React from 'react'
import {rollFate} from './DieRoll'

it('rolls fate correctly', () => {
  const rolls = {}
  for (let i = 0; i < 10000; i++) {
    const roll = rollFate({modifier: 0})
    rolls[roll] = (rolls[roll] || 0) + 1
  }

  for (let mod = -4; mod <= 4; mod++) {
    expect(rolls[mod]).toBeGreaterThan(0)
  }
  expect(Object.keys(rolls).length).toBe(9)
})

it('rolls fate correctly with modifier', () => {
  const rolls = {}
  for (let i = 0; i < 10000; i++) {
    const roll = rollFate({modifier: 5})
    rolls[roll] = (rolls[roll] || 0) + 1
  }

  for (let mod = 1; mod <= 9; mod++) {
    expect(rolls[mod]).toBeGreaterThan(0)
  }
  expect(Object.keys(rolls).length).toBe(9)
})
