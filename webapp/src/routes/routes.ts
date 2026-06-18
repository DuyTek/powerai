import { RouteObject } from "react-router";
import { TestScenarioCreationPage, VerifyPage } from "../page";
import { Result } from "../page/Result";

export const routes: RouteObject[] = [
  {
    index: true,
    path: "/",
    Component: TestScenarioCreationPage,
  },
  {
    path: "/result/:scenarioId",
    Component: Result,
  },
  {
    path: "/verify/:scenarioId",
    Component: VerifyPage,
  },
];
