import { useHttp } from "../../config";
import {
  CreateTestScenarioDTO,
  CreateTestScenarioParams,
  GenerateCodeDTO,
  GenerateCodeParams,
} from "./model";

export const getTestScenario = () => {
  const http = useHttp<CreateTestScenarioParams>();
  return http.request("get", "/api/scenario");
};

export const createTestScenario = async (
  data: CreateTestScenarioParams,
): Promise<CreateTestScenarioDTO> => {
  const http = useHttp<CreateTestScenarioParams>();
  return http.request("post", "/api/scenario/create", data);
};

export const generateCode = async (
  params: GenerateCodeParams,
): Promise<GenerateCodeDTO> => {
  const http = useHttp<GenerateCodeParams>();
  return http.request("post", "/api/scenario/generate-code", params);
};
