import {
  Divider,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
  SelectChangeEvent,
  Slider,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  getCurrentLLMConfig,
  getModels,
  LLMModel,
  setLLMConfig,
} from "../../api";
import { SubInputLabel } from "../../components";
import { CreateScenarioForm } from "./CreateScenarioForm";

export const TestScenarioCreationPage = () => {
  const [llmModels, setLlmModels] = useState<LLMModel[]>([]);
  const [selectedModelId, setSelectedModelId] = useState<string>("");
  const [temperature, setTemperature] = useState<number>(0);
  const handleTemperatureChange = (_event: Event, newValue: number) => {
    setTemperature(newValue as number);
    setLLMConfig({
      modelId: selectedModelId,
      temperature: newValue as number,
    }).then((res) => {
      alert(res.message);
    });
  };

  const handleModelChange = (e: SelectChangeEvent) => {
    setSelectedModelId(e.target.value as string);
    setLLMConfig({
      modelId: e.target.value as string,
    }).then((res) => {
      alert(res.message);
    });
  };

  useEffect(() => {
    getCurrentLLMConfig().then((res) => {
      setSelectedModelId(res.model.id);
      setTemperature(res.temperature);
    });
    getModels().then((res) => {
      setLlmModels(res.models);
    });
  }, []);
  return (
    <Stack mt={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h1">Create Test Scenario</Typography>
        <Stack sx={{ width: 300, alignItems: "end" }}>
          <SubInputLabel>Temperature</SubInputLabel>
          <Slider
            onChange={handleTemperatureChange}
            value={temperature}
            size="small"
            marks={[
              { label: "0", value: 0 },

              { label: "0.5", value: 0.5 },

              { label: "1", value: 1 },
            ]}
            min={0}
            max={1}
            step={0.1}
          />
          <Select
            sx={{ mt: 2 }}
            onChange={handleModelChange}
            value={selectedModelId}
          >
            {llmModels.map((model) => (
              <MenuItem key={model.modelName} value={model.id}>
                {model.modelName}
              </MenuItem>
            ))}
          </Select>
        </Stack>
      </Stack>
      <Typography variant="subtitle1">
        Enter details about the test you want to create
      </Typography>
      <Divider sx={{ my: 3 }} />
      <Paper elevation={3} sx={{ height: "100%", px: 4, pb: 4, pt: 8 }}>
        <CreateScenarioForm />
      </Paper>
    </Stack>
  );
};
