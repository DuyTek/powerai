import { InteractedElements, TestScenarioData } from "../api";
import { getWithExpiry, setWithExpiry, STORAGE_KEYS } from "./localStorage";

type ScenarioStorage = TestScenarioData & {
  id: number;
  seleniumFilePath?: string;
};

export const updateScenario = (scenario: TestScenarioData): number | null => {
  const scenarios = getScenarios();
  const updatedScenario: ScenarioStorage = {
    ...scenario,
    id: scenarios.length > 0 ? scenarios[scenarios.length - 1].id + 1 : 1,
  };
  try {
    scenarios.push(updatedScenario);
    setWithExpiry(STORAGE_KEYS.SCENARIOS, scenarios);
    return updatedScenario.id;
  } catch (error) {
    console.error(`updateScenario: Error updating scenarios: ${error}`);
  }
  return null;
};

export const getScenarios = (): ScenarioStorage[] => {
  const scenarios = getWithExpiry<ScenarioStorage[]>(STORAGE_KEYS.SCENARIOS);
  if (!scenarios || scenarios.length === 0) {
    console.warn(
      `getScenarios: No scenarios found in localStorage for key: ${STORAGE_KEYS.SCENARIOS}. Intializing empty array.`,
    );
    return [];
  }
  return scenarios;
};

export const getPreviousScenario = (id: number): ScenarioStorage | null => {
  const scenarios = getScenarios();
  const previousScenario = scenarios.find((scenario) => scenario.id === id);
  if (!previousScenario) {
    console.warn(`getPreviousScenario: No scenario found with id: ${id}`);
    return null;
  }
  return previousScenario;
};

export const updatePreviousScenario = (
  id: number,
  scenario: ScenarioStorage,
): void => {
  const scenarios = getScenarios();
  const index = scenarios.findIndex((s) => s.id === id);
  if (index === -1) {
    console.warn(`updatePreviousScenario: No scenario found with id: ${id}`);
    return;
  }
  scenarios[index] = scenario;
  setWithExpiry(STORAGE_KEYS.SCENARIOS, scenarios);
};

export const getInteractedElements = (id: number): InteractedElements[] => {
  const scenario = getPreviousScenario(id);
  if (!scenario) {
    console.warn(`getInteractedElements: No scenario found with id: ${id}`);
    return [];
  }
  return scenario.interactedElements;
};

export const saveSeleniumFilePath = (path: string, id: number): void => {
  const scenarios = getScenarios();
  const index = scenarios.findIndex((s) => s.id === id);
  if (index === -1) {
    console.warn(`saveSeleniumFilePath: No scenario found with id: ${id}`);
    return;
  }
  scenarios[index].seleniumFilePath = path;
  setWithExpiry(STORAGE_KEYS.SCENARIOS, scenarios);
};
