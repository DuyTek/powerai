import { useHttp } from "../../config";
import { GetLLMResponse, LLMModel, LLMRequestParams } from "./model/TypeLLM";

export const getModels = (): Promise<GetLLMResponse> => {
  const http = useHttp();
  return http.request("get", "/api/llm/models");
};

export const setLLMConfig = (
  data: LLMRequestParams,
): Promise<{ message: string }> => {
  const http = useHttp();
  return http.request("post", "/api/llm/select", data);
};

export const getCurrentLLMConfig = (): Promise<{
  model: LLMModel;
  temperature: number;
}> => {
  const http = useHttp();
  return http.request("get", "/api/llm/current");
};
