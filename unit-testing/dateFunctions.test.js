import { setFullYear, setMonth, setDate } from "./dateFunctions";

describe("setFullYear", () => {
  test("should set year to 2025", () => {
    const date = new Date(2020, 0, 1);

    setFullYear(date, 2025);

    expect(date.getFullYear()).toBe(2025);
  });

  test("should set year to 2000", () => {
    const date = new Date(2024, 5, 15);

    setFullYear(date, 2000);

    expect(date.getFullYear()).toBe(2000);
  });

  test("should keep month unchanged after setting year", () => {
    const date = new Date(2020, 7, 10);

    setFullYear(date, 2030);

    expect(date.getMonth()).toBe(7);
  });

  test("should keep day unchanged after setting year", () => {
    const date = new Date(2020, 3, 22);

    setFullYear(date, 2022);

    expect(date.getDate()).toBe(22);
  });

  test("should return timestamp after setting year", () => {
    const date = new Date(2020, 0, 1);

    const result = setFullYear(date, 2021);

    expect(typeof result).toBe("number");
  });
});

describe("setMonth", () => {
  test("should set month to January", () => {
    const date = new Date(2024, 5, 10);

    setMonth(date, 0);

    expect(date.getMonth()).toBe(0);
  });

  test("should set month to December", () => {
    const date = new Date(2024, 2, 10);

    setMonth(date, 11);

    expect(date.getMonth()).toBe(11);
  });

  test("should set month to June", () => {
    const date = new Date(2024, 0, 10);

    setMonth(date, 5);

    expect(date.getMonth()).toBe(5);
  });

  test("should keep year unchanged after setting month", () => {
    const date = new Date(2024, 1, 15);

    setMonth(date, 8);

    expect(date.getFullYear()).toBe(2024);
  });

  test("should return timestamp after setting month", () => {
    const date = new Date(2024, 1, 15);

    const result = setMonth(date, 3);

    expect(typeof result).toBe("number");
  });
});

describe("setDate", () => {
  test("should set day to 1", () => {
    const date = new Date(2024, 0, 15);

    setDate(date, 1);

    expect(date.getDate()).toBe(1);
  });

  test("should set day to 10", () => {
    const date = new Date(2024, 0, 1);

    setDate(date, 10);

    expect(date.getDate()).toBe(10);
  });

  test("should set day to 28", () => {
    const date = new Date(2024, 1, 1);

    setDate(date, 28);

    expect(date.getDate()).toBe(28);
  });

  test("should keep month unchanged when day is valid", () => {
    const date = new Date(2024, 6, 1);

    setDate(date, 20);

    expect(date.getMonth()).toBe(6);
  });

  test("should return timestamp after setting day", () => {
    const date = new Date(2024, 0, 1);

    const result = setDate(date, 15);

    expect(typeof result).toBe("number");
  });
});
