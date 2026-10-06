import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

// Deterministic matching formula simulation
function calculateScore(requiredQty, availableQty) {
  let sumMatched = 0;
  let sumRequired = 0;
  for (let i = 0; i < requiredQty.length; i++) {
    const matched = Math.min(availableQty[i], requiredQty[i]);
    sumMatched += matched;
    sumRequired += requiredQty[i];
  }
  return sumRequired > 0 ? Math.round((sumMatched / sumRequired) * 100) : 0;
}

function calculateWasteReductionGrams(matchedItems, massPerUnit) {
  return matchedItems.reduce((acc, curr, idx) => acc + (curr * massPerUnit[idx]), 0);
}

describe('ReCircuit Deterministic Matching Engine Tests', () => {
  test('Formula Test 1: Full BOM Available = 100% Score', () => {
    // 5 components needed, 1 of each owned
    const required = [1, 1, 1, 1, 1];
    const available = [1, 1, 1, 1, 1];
    const score = calculateScore(required, available);
    assert.equal(score, 100, 'All components available should yield 100%');
  });

  test('Formula Test 2: Zero Inventory = 0% Score', () => {
    const required = [1, 1, 1, 1];
    const available = [0, 0, 0, 0];
    const score = calculateScore(required, available);
    assert.equal(score, 0, 'No components available should yield 0%');
  });

  test('Formula Test 3: Smart Irrigation Exact Fixture (4 of 5 matched = 80%)', () => {
    // Smart irrigation requires 5 items: ESP32 (1), Soil Sensor (1), 5V Relay (1), Pump (1), Breadboard (1)
    // User Vikram has ESP32 (1), Soil Sensor (1), 5V Relay (1), Breadboard (1), but NO Pump (0)
    const required = [1, 1, 1, 1, 1];
    const available = [1, 1, 1, 0, 1];
    const score = calculateScore(required, available);
    assert.equal(score, 80, '4 of 5 components matched must produce exactly 80%');
  });

  test('Formula Test 4: Obstacle Robot Partial Match (4 of 6 units matched = 67%)', () => {
    // Required: Arduino (1), HC-SR04 (1), L298N (1), TT Motors (2), Servo (1) -> Total 6
    // Available: Arduino (1), HC-SR04 (1), TT Motors (2), missing L298N (0) & Servo (0) -> 4 matched
    const required = [1, 1, 1, 2, 1];
    const available = [1, 1, 0, 2, 0];
    const score = calculateScore(required, available);
    // 4 / 6 = 66.666% -> 67%
    assert.equal(score, 67, '4 of 6 units matched must round to 67%');
  });

  test('Empirical Waste Mass Calculation', () => {
    // 1 ESP32 (35g) + 1 Soil Sensor (20g) + 1 Relay (25g) + 1 Breadboard (95g)
    const matched = [1, 1, 1, 1];
    const masses = [35.0, 20.0, 25.0, 95.0];
    const totalGrams = calculateWasteReductionGrams(matched, masses);
    assert.equal(totalGrams, 175.0, 'Total mass should equal sum of matched components');
  });

  test('Alias Normalization matches uno and Arduino Uno', () => {
    const catalog = [
      { canonical_name: 'Arduino Uno R3', aliases: ['arduino uno', 'uno r3', 'uno'] },
      { canonical_name: 'ESP32 DevKit V1', aliases: ['esp32', 'nodemcu 32'] }
    ];

    function normalize(query) {
      const q = query.toLowerCase().trim();
      for (const item of catalog) {
        if (item.canonical_name.toLowerCase() === q || item.aliases.includes(q)) {
          return item.canonical_name;
        }
      }
      return null;
    }

    assert.equal(normalize('uno'), 'Arduino Uno R3');
    assert.equal(normalize('arduino uno'), 'Arduino Uno R3');
    assert.equal(normalize('esp32'), 'ESP32 DevKit V1');
  });
});
