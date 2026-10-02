import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  ELEMENTS,
  PRESETS,
  QUESTIONS,
  STATIONS,
  TRENDS,
} from "./course-data.ts";

describe("course-data", () => {
  it("stations have unique, non-empty ids", () => {
    const ids = STATIONS.map((station) => station.id);
    assert.ok(ids.length > 0);
    assert.equal(new Set(ids).size, ids.length);
    for (const station of STATIONS) {
      assert.ok(station.id.length > 0);
      assert.ok(station.title.length > 0);
      assert.ok(station.summary.length > 0);
      assert.ok(station.index.length > 0);
    }
  });

  it("elements run Z 1..20 with sane records", () => {
    assert.equal(ELEMENTS.length, 20);
    ELEMENTS.forEach((element, index) => {
      assert.equal(element.z, index + 1);
      assert.ok(element.symbol.length > 0);
      assert.ok(element.name.length > 0);
      assert.ok(element.stable.length > 0);
      const sorted = [...element.stable].sort((a, b) => a - b);
      assert.deepEqual(element.stable, sorted);
    });
  });

  it("presets land on a stable isotope of their element", () => {
    assert.ok(PRESETS.length > 0);
    for (const preset of PRESETS) {
      const element = ELEMENTS[preset.p - 1];
      assert.ok(element, `no element for Z=${preset.p}`);
      assert.equal(element.z, preset.p);
      const mass = preset.p + preset.n;
      assert.ok(
        element.stable.includes(mass),
        `${preset.label}: A=${mass} not in stable list [${element.stable}]`,
      );
    }
  });

  it("questions have valid answers and explanations", () => {
    assert.ok(QUESTIONS.length > 0);
    for (const question of QUESTIONS) {
      assert.ok(question.prompt.length > 0);
      assert.ok(question.choices.length >= 2);
      assert.ok(
        question.answer >= 0 && question.answer < question.choices.length,
        `answer index out of range: "${question.prompt}"`,
      );
      assert.ok(question.why.length > 0);
      assert.equal(new Set(question.choices).size, question.choices.length);
    }
  });

  it("trends cover Z 1..20 with valid values", () => {
    assert.equal(TRENDS.length, 20);
    TRENDS.forEach((point, index) => {
      assert.equal(point.z, index + 1);
      assert.equal(point.symbol, ELEMENTS[index].symbol);
      assert.ok(point.radiusPm > 0);
      assert.ok(
        point.electronegativity === null ||
          (point.electronegativity > 0 && point.electronegativity < 4.5),
        `${point.symbol}: bad electronegativity ${point.electronegativity}`,
      );
    });
  });
});
