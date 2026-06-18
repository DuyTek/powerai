import {
  Divider,
  Paper,
  Stack,
  Typography,
  Alert,
  Button,
  Grid,
  Box,
  Chip,
  LinearProgress,
  CircularProgress,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import {
  generateCode,
  InteractedElements,
  TestScenarioEntity,
} from "../../api";
import {
  getPreviousScenario,
  getInteractedElements,
  saveSeleniumFilePath,
} from "../../util/scenarioStorage";
import {
  VerifyTable,
  VERIFICATION_COMPLETE_EVENT,
  VerificationStatus,
} from "./VerifyTable";

// Type definition for verification event detail
interface VerificationEventDetail {
  allVerified: boolean;
  stats: {
    total: number;
    pending: number;
    accepted: number;
    rejected: number;
  };
}

export const VerifyPage = () => {
  const { scenarioId } = useParams();
  const navigate = useNavigate();
  const scenario = getPreviousScenario(Number(scenarioId));
  const interactedElements = getInteractedElements(Number(scenarioId));
  const [elements] = useState<InteractedElements[]>(interactedElements || []);
  const [scenarioDetails] = useState<TestScenarioEntity | null>(
    scenario?.scenario || null,
  );

  // Verification state
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [verificationStats, setVerificationStats] = useState<
    VerificationEventDetail["stats"]
  >({
    total: elements.length,
    pending: elements.length,
    accepted: 0,
    rejected: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add event listener for verification status changes
  useEffect(() => {
    const handleVerificationStatusChange = (event: Event) => {
      const customEvent = event as CustomEvent<VerificationEventDetail>;
      const { allVerified, stats } = customEvent.detail;

      setVerificationStats(stats);

      if (allVerified) {
        console.info("All elements have been verified!");
      }
    };

    // Add event listener
    window.addEventListener(
      VERIFICATION_COMPLETE_EVENT,
      handleVerificationStatusChange,
    );

    // Clean up
    return () => {
      window.removeEventListener(
        VERIFICATION_COMPLETE_EVENT,
        handleVerificationStatusChange,
      );
    };
  }, []);

  const handleStatusChange = (
    elementId: string,
    status: VerificationStatus,
  ) => {
    console.info(`Element ${elementId} status changed to ${status}`);
    // In a real implementation, you would track verification status here
  };

  const handleFinishVerification = async () => {
    setIsSubmitting(true);
    if (!scenario) {
      console.error("Scenario not found");
      return;
    }
    await generateCode(scenario).then((res) => {
      if (res.status === 200) {
        saveSeleniumFilePath(res.data.seleniumFilePath, scenario.id);
        setVerificationComplete(true);
        setIsSubmitting(false);
        navigate(`/result/${scenario.id}`);
      }
    });
  };

  // Calculate verification progress
  const verificationProgress = Math.round(
    ((verificationStats.accepted + verificationStats.rejected) /
      verificationStats.total) *
      100,
  );

  const isAllVerified =
    verificationStats.pending === 0 && verificationStats.total > 0;

  if (!scenarioDetails) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Scenario not found. Please go back and create a new test scenario.
      </Alert>
    );
  }

  return (
    <Stack spacing={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h1">Element Verification</Typography>
      </Stack>
      <Typography variant="subtitle1">
        Please verify the properties that AI has retrieved from the website.
        Accept elements that are correctly identified and reject those that
        aren&apos;t.
      </Typography>

      {verificationComplete && (
        <Alert severity="success">
          Verification complete! The approved elements will be used for
          generating test scripts.
        </Alert>
      )}

      <Divider sx={{ my: 1 }} />

      {/* Scenario Summary Card */}
      <Paper elevation={3} sx={{ px: 4, py: 3 }}>
        <Typography variant="h5" gutterBottom color="primary">
          Test Scenario: {scenarioDetails.testName}
        </Typography>

        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box>
              <Typography variant="subtitle2" fontWeight="bold">
                Website URL
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {scenarioDetails.websiteUrl}
              </Typography>

              {scenarioDetails.description && (
                <>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Description
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {scenarioDetails.description}
                  </Typography>
                </>
              )}

              {scenarioDetails.precondition && (
                <>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Precondition
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {scenarioDetails.precondition}
                  </Typography>
                </>
              )}
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            {scenarioDetails.expectedResult && (
              <>
                <Typography variant="subtitle2" fontWeight="bold">
                  Expected Result
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {scenarioDetails.expectedResult}
                </Typography>
              </>
            )}

            <Typography variant="subtitle2" fontWeight="bold">
              Configuration
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
              <Chip
                label={`Screenshots: ${scenarioDetails.captureScreenshots ? "Enabled" : "Disabled"}`}
                color={
                  scenarioDetails.captureScreenshots ? "success" : "default"
                }
                variant="outlined"
              />
              <Chip
                label={`Steps: ${scenarioDetails.testSteps?.length || 0}`}
                color="primary"
                variant="outlined"
              />
            </Box>
          </Grid>

          {scenarioDetails.testSteps &&
            scenarioDetails.testSteps.length > 0 && (
              <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle2" fontWeight="bold">
                  Test Steps
                </Typography>
                <Box
                  sx={{
                    mt: 1,
                    border: "1px solid #e0e0e0",
                    borderRadius: 1,
                    p: 2,
                  }}
                >
                  {scenarioDetails.testSteps.map((step, index) => (
                    <Box
                      key={step.stepId}
                      sx={{
                        mb:
                          index === scenarioDetails.testSteps!.length - 1
                            ? 0
                            : 2,
                      }}
                    >
                      <Typography variant="body1" fontWeight="medium">
                        {index + 1}. {step.description}
                      </Typography>
                      {step.testData && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          ml={2}
                        >
                          Data: {step.testData}
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Box>
              </Grid>
            )}
        </Grid>
      </Paper>
      {/* Progress tracking */}
      <Paper elevation={3} sx={{ px: 2, pb: 4, pt: 2 }}>
        <Grid padding={2} container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="h6">Verification Progress</Typography>
            <LinearProgress
              variant="determinate"
              value={verificationProgress}
              color={isAllVerified ? "success" : "primary"}
              sx={{ height: 10, borderRadius: 5, my: 1 }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Chip
                label={`Total: ${verificationStats.total}`}
                variant="outlined"
                color="primary"
              />
              <Chip
                label={`Pending: ${verificationStats.pending}`}
                variant="outlined"
                color={verificationStats.pending > 0 ? "warning" : "default"}
              />
              <Chip
                label={`Accepted: ${verificationStats.accepted}`}
                variant="outlined"
                color="success"
              />
              <Chip
                label={`Rejected: ${verificationStats.rejected}`}
                variant="outlined"
                color="error"
              />
            </Stack>
          </Grid>
        </Grid>
        <VerifyTable elements={elements} onStatusChange={handleStatusChange} />

        <Stack direction="row" justifyContent="flex-end" mt={3}>
          <Button
            variant="contained"
            onClick={handleFinishVerification}
            disabled={!isAllVerified || verificationComplete || isSubmitting}
            startIcon={
              isSubmitting ? (
                <CircularProgress size={20} color="inherit" />
              ) : null
            }
          >
            {isSubmitting ? "Submitting..." : "Finish Verification"}
          </Button>
        </Stack>
      </Paper>
    </Stack>
  );
};
