import { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Tooltip,
  Chip,
  Stack,
  styled,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { Replay } from "@mui/icons-material";
import { InteractedElements } from "../../api";

export type VerificationStatus = "pending" | "accepted" | "rejected";

// Custom event name
export const VERIFICATION_COMPLETE_EVENT = "verification-status-change";

const PinnedTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  position: "sticky",
  zIndex: 1,
  right: 0,
}));

interface ElementWithStatus extends InteractedElements {
  status: VerificationStatus;
}

interface VerifyTableProps {
  elements: InteractedElements[];
  onStatusChange?: (elementId: string, status: VerificationStatus) => void;
}

export const VerifyTable = ({ elements, onStatusChange }: VerifyTableProps) => {
  const [verifiedElements, setVerifiedElements] = useState<ElementWithStatus[]>(
    elements.map((element, index) => ({
      ...element,
      status: "pending",
      id: element.id || `element-${index}`,
    })),
  );

  const handleStatusChange = (
    elementId: string,
    status: VerificationStatus,
  ) => {
    setVerifiedElements((prev) =>
      prev.map((el) => (el.id === elementId ? { ...el, status } : el)),
    );

    if (onStatusChange) {
      onStatusChange(elementId, status);
    }
  };

  // Check if all elements have been verified (not in pending status)
  useEffect(() => {
    const allVerified = verifiedElements.every((el) => el.status !== "pending");
    const pendingCount = verifiedElements.filter(
      (el) => el.status === "pending",
    ).length;

    // Dispatch custom event with verification status
    const event = new CustomEvent(VERIFICATION_COMPLETE_EVENT, {
      detail: {
        allVerified,
        stats: {
          total: verifiedElements.length,
          pending: pendingCount,
          accepted: verifiedElements.filter((el) => el.status === "accepted")
            .length,
          rejected: verifiedElements.filter((el) => el.status === "rejected")
            .length,
        },
      },
    });

    window.dispatchEvent(event);
  }, [verifiedElements]);

  const renderAttributeChips = (element: InteractedElements) => {
    const attributesToDisplay = [
      { key: "type", value: element.type },
      { key: "tag", value: element.tag },
      {
        key: "tabIndex",
        value:
          element.tabIndex !== undefined ? element.tabIndex.toString() : "N/A",
      },
    ];

    return (
      <Stack direction="row" spacing={1} flexWrap="wrap">
        {attributesToDisplay.map(({ key, value }) => (
          <Chip
            key={key}
            size="small"
            label={`${key}: ${value}`}
            variant="outlined"
            sx={{ margin: "2px" }}
          />
        ))}
      </Stack>
    );
  };

  return (
    <TableContainer component={Paper}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Element ID</TableCell>
            <TableCell>Relative XPath</TableCell>
            <TableCell>CSS Selector</TableCell>
            <TableCell>XPath</TableCell>
            <TableCell>Other Attributes</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody sx={{ position: "relative" }}>
          {verifiedElements.length > 0 ? (
            verifiedElements.map((element, index) => (
              <TableRow
                key={element.id || index}
                sx={{
                  backgroundColor:
                    element.status === "accepted"
                      ? "rgba(76, 175, 80, 0.08)"
                      : element.status === "rejected"
                        ? "rgba(211, 47, 47, 0.08)"
                        : "inherit",
                }}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>{element.id || "N/A"}</TableCell>
                <TableCell>
                  <Typography
                    sx={{
                      whiteSpace: "wrap",
                    }}
                  >
                    {element.relativeXpath}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    sx={{
                      whiteSpace: "wrap",
                    }}
                  >
                    {element.cssSelector}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    sx={{
                      whiteSpace: "nowrap",
                    }}
                  >
                    {element.xpath}
                  </Typography>
                </TableCell>
                <TableCell>{renderAttributeChips(element)}</TableCell>
                <PinnedTableCell align="center">
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <Tooltip title="Accept">
                      <IconButton
                        color={
                          element.status === "accepted" ? "success" : "default"
                        }
                        onClick={() =>
                          handleStatusChange(
                            element.id || `element-${index}`,
                            "accepted",
                          )
                        }
                      >
                        <CheckCircleIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Reject">
                      <IconButton
                        color={
                          element.status === "rejected" ? "error" : "default"
                        }
                        onClick={() =>
                          handleStatusChange(
                            element.id || `element-${index}`,
                            "rejected",
                          )
                        }
                      >
                        <CancelIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Reject">
                      <IconButton
                        color={
                          element.status === "rejected" ? "error" : "default"
                        }
                        onClick={() =>
                          handleStatusChange(
                            element.id || `element-${index}`,
                            "pending",
                          )
                        }
                      >
                        <Replay />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </PinnedTableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} align="center">
                No elements to verify
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
