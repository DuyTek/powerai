import { AxiosResponse } from "axios";
import { TestStep } from "../../TestSteps";

export type SensitiveData = Record<string, any>[];

export type TestScenarioEntity = {
  testName: string;
  expectedResult: string;
  websiteUrl: string;
  captureScreenshots?: boolean;
  description?: string;
  precondition?: string;
  sensitiveData?: SensitiveData;
  testSteps?: TestStep[];
};
export type CreateTestScenarioParams = TestScenarioEntity;

export type InteractedElements = {
  cssSelector: string;
  elementClass: string;
  id?: string; // This is the HTML id
  relativeXpath: string;
  tabIndex: number;
  tag: string;
  type: string;
  xpath: string;
};

export type TestScenarioData = {
  interactedElements: InteractedElements[];
  scenario: TestScenarioEntity;
};

export type GenerateCodeParams = TestScenarioData;
export type GenerateCodeDTO = AxiosResponse<{
  seleniumFilePath: string;
}>;

export type CreateTestScenarioDTO = AxiosResponse<TestScenarioData>;
