export type LLMModel = {
  id: string;
  modelName: string;
  name: string;
};

export type LLMRequestParams = {
  modelId: string;
  temperature?: number;
};

export type GetLLMResponse = {
  models: LLMModel[];
  selectedModel: string;
};
