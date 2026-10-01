import assert from "node:assert/strict";
import test from "node:test";
import { compoundScenario } from "../src/lib/content.ts";

test("the default scenario compounds for 10 years and loses three years with a pause", () => {
  const scenario = compoundScenario(20, 3);
  assert.ok(Math.abs(scenario.now - 6.1917364224) < 1e-9);
  assert.ok(Math.abs(scenario.paused - 3.5831808) < 1e-9);
  assert.ok(Math.abs(scenario.gap - 42.1296296296) < 1e-9);
});

test("no delay means the two scenarios coincide at every supported rate", () => {
  for (let rate = 5; rate <= 40; rate++) {
    const scenario = compoundScenario(rate, 0);
    assert.equal(scenario.now, scenario.paused);
    assert.equal(scenario.gap, 0);
  }
});

test("a longer delay never improves the outcome across the control's full range", () => {
  for (let rate = 5; rate <= 40; rate++) {
    let previous = Infinity;
    for (const delay of [0, 1, 3, 5]) {
      const scenario = compoundScenario(rate, delay);
      assert.ok(scenario.paused <= previous);
      assert.ok(scenario.paused >= 1);
      assert.ok(scenario.gap >= 0 && scenario.gap < 100);
      previous = scenario.paused;
    }
  }
});
