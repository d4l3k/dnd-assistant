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
})
