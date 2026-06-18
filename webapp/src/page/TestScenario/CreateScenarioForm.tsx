import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  TextField,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router";
import { SubInputLabel } from "../../components";
import {
  CreateTestScenarioParams,
  TestStep,
  createTestScenario,
} from "../../api";
import { updateScenario } from "../../util/scenarioStorage";
import TestStepTable from "./TestStepTable";

export const CreateScenarioForm = () => {
  const {
    control,
    handleSubmit: formSubmit,
    formState: { errors },
    setValue,
    setError,
    watch,
    clearErrors,
  } = useForm<CreateTestScenarioParams>({
    defaultValues: {
      websiteUrl: "",
      testName: "",
      testSteps: [],
      description: "",
      precondition: "",
      expectedResult: "",
      captureScreenshots: false,
    },
  });
  const currentTestSteps = watch("testSteps");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleTestStepsChange = (steps: TestStep[]) => {
    setValue("testSteps", steps);
    clearErrors("testSteps");
  };

  const onSubmit = async (data: CreateTestScenarioParams) => {
    const errorTestSteps = data?.testSteps?.filter(
      (step) => !step.description || step.description.trim() === "",
    );
    if (errorTestSteps && errorTestSteps.length > 0) {
      setError("testSteps", {
        type: "manual",
        message: "Test steps must have a description",
      });
      return;
    }
    setIsLoading(true);
    await createTestScenario(data)
      .then((res) => {
        setIsLoading(false);
        const id = updateScenario(res.data);
        if (id) {
          navigate(`/verify/${id}`);
        } else {
          console.error("createTestScenario: Failed to update scenario");
        }
      })
      .catch((error) => {
        console.error(
          "createTestScenario: Error creating test scenario",
          error,
        );
        setIsLoading(false);
      });
  };

  return (
    <form noValidate onSubmit={formSubmit(onSubmit)}>
      <Grid container spacing={4} columns={12}>
        <Grid container rowSpacing={8} size={4}>
          <Controller
            name="websiteUrl"
            control={control}
            rules={{
              required: "Website URL is required",
              pattern: {
                value: /^(https?:\/\/)/,
                message: "URL should start with http(s)://",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Website URL"
                prefix=""
                required
                fullWidth
                error={!!errors.websiteUrl}
                helperText={errors.websiteUrl?.message}
              />
            )}
          />
          <Controller
            name="testName"
            control={control}
            rules={{ required: "Test Name is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Test Name"
                placeholder="What's important here?"
                required
                fullWidth
                error={!!errors.testName}
                helperText={errors.testName?.message}
              />
            )}
          />
          <Controller
            name="expectedResult"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Expected Result"
                multiline
                minRows={3}
                fullWidth
              />
            )}
          />
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Description"
                placeholder="Verify that..."
                multiline
                minRows={3}
                fullWidth
              />
            )}
          />
          <Controller
            name="precondition"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Precondition"
                placeholder="Before running..."
                multiline
                minRows={3}
                fullWidth
              />
            )}
          />
        </Grid>
        <Grid container size="grow">
          <Grid
            sx={{
              minHeight: "150px",
              width: "100%",
              maxHeight: "300px",
            }}
          >
            <SubInputLabel>Test Steps</SubInputLabel>
            <TestStepTable
              testSteps={currentTestSteps ?? []}
              onChange={handleTestStepsChange}
              setError={setError}
              clearErrors={clearErrors}
            />
            {errors.testSteps && (
              <FormHelperText error>{errors.testSteps.message}</FormHelperText>
            )}
          </Grid>
          <Grid>
            <SubInputLabel>Execution Configurations</SubInputLabel>
            <FormControl>
              <Controller
                name="captureScreenshots"
                control={control}
                render={({ field: { onChange, value, ...rest } }) => (
                  <FormControlLabel
                    control={
                      <Checkbox checked={value} onChange={onChange} {...rest} />
                    }
                    label="Capture Screenshots"
                  />
                )}
              />
            </FormControl>
          </Grid>
        </Grid>
      </Grid>
      <Grid flexDirection="row-reverse" container mt={2}>
        <Button loading={isLoading} type="submit" variant="contained">
          Submit
        </Button>
      </Grid>
    </form>
  );
};
