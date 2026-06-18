export type TestStep = {
  stepId: number; // Also is the order of the step
  description: string;
  testData?: string;
  isSensitive?: boolean;
};
