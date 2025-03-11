// src/components/ExportDialog.js
import React, {useState} from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {COLORS, SPACING, TYPOGRAPHY} from '../themes/baseTheme';
import {exportInterviewData} from '../utils/exportUtils';
import {isUbsTheme} from '../themes/themeUtils';
import HtmlIcon from '@mui/icons-material/Html';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';

/**
 * Dialog for exporting interview data with additional metadata
 * Supports HTML and PDF formats
 */
const ExportDialog = ({
  open,
  onClose,
  interviewState,
  allQuestions,
}) => {
  // Form state
  const [candidateName, setCandidateName] = useState('');
  const [comments, setComments] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [format, setFormat] = useState('html');
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState(null);

  // Get theme information
  const useUbsTheme = isUbsTheme();
  const primaryColor = useUbsTheme ? '#EC0016' : COLORS.primary.main;

  // Handle export button click
  const handleExport = async () => {
    setIsExporting(true);
    setError(null);

    try {
      // Create metadata object
      const metadata = {
        candidateName: candidateName.trim(),
        comments: comments.trim(),
        recommendation: recommendation,
        timestamp: new Date().toISOString(),
      };

      // Export data based on selected format
      await exportInterviewData(interviewState, allQuestions, metadata, format);

      // Close dialog on success
      setIsExporting(false);
      resetForm();
      onClose();
    } catch (err) {
      console.error('Export failed:', err);
      if (format === 'pdf') {
        setError(
            'PDF export requires additional dependencies that may not be loaded. Please try HTML format.');
      } else {
        setError('An error occurred during export. Please try again.');
      }
      setIsExporting(false);
    }
  };

  // Reset form state
  const resetForm = () => {
    setCandidateName('');
    setComments('');
    setRecommendation('');
    setFormat('html');
  };

  // Handle dialog close
  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Toggle recommendation
  const handleRecommendationToggle = (value) => {
    if (recommendation === value) {
      setRecommendation(''); // Unselect if already selected
    } else {
      setRecommendation(value);
    }
  };

  return (
      <Dialog
          open={open}
          onClose={handleClose}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: SPACING.toUnits(SPACING.borderRadius),
              overflow: 'hidden',
            },
          }}
      >
        <DialogContent sx={{pt: 3, pb: 2}}>
          <Typography
              variant="h5"
              sx={{
                fontSize: '1.25rem',
                fontWeight: TYPOGRAPHY.fontWeight.medium,
                mb: 3,
                color: COLORS.text.primary,
              }}>
            Export Interview Notes
          </Typography>

          <Stack spacing={3}>
            <TextField
                label="Candidate Name"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                fullWidth
                variant="outlined"
                placeholder="Enter candidate's name"
                InputProps={{
                  style: {
                    fontSize: TYPOGRAPHY.fontSize.regularText,
                  },
                }}
            />

            <TextField
                label="Interviewer Notes"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                placeholder="Add your personal observations and notes about the candidate"
                InputProps={{
                  style: {
                    fontSize: TYPOGRAPHY.fontSize.regularText,
                  },
                }}
            />

            <Box>
              <Typography
                  sx={{
                    fontSize: TYPOGRAPHY.fontSize.body1,
                    color: COLORS.text.primary,
                    mb: 1.5,
                    fontWeight: TYPOGRAPHY.fontWeight.medium,
                  }}>
                Recommendation
              </Typography>

              <Box sx={{display: 'flex', gap: 2}}>
                <Paper
                    elevation={0}
                    onClick={() => handleRecommendationToggle('recommended')}
                    sx={{
                      px: 2,
                      py: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      borderRadius: '8px',
                      border: `1px solid ${recommendation === 'recommended'
                          ? '#36B37E'
                          : COLORS.grey[200]}`,
                      backgroundColor: recommendation === 'recommended'
                          ? 'rgba(54, 179, 126, 0.1)'
                          : 'transparent',
                      cursor: 'pointer',
                      width: '50%',
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: '#36B37E',
                        backgroundColor: 'rgba(54, 179, 126, 0.05)',
                      },
                    }}
                >
                  <ThumbUpAltIcon
                      sx={{
                        mr: 1.5,
                        fontSize: '1.25rem',
                        color: recommendation === 'recommended'
                            ? '#36B37E'
                            : COLORS.grey[500],
                      }}
                  />
                  <Typography>Recommend</Typography>
                </Paper>

                <Paper
                    elevation={0}
                    onClick={() => handleRecommendationToggle(
                        'not_recommended')}
                    sx={{
                      px: 2,
                      py: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      borderRadius: '8px',
                      border: `1px solid ${recommendation === 'not_recommended'
                          ? (useUbsTheme ? '#EC0016' : COLORS.error.main)
                          : COLORS.grey[200]}`,
                      backgroundColor: recommendation === 'not_recommended'
                          ? (useUbsTheme
                              ? 'rgba(236, 0, 22, 0.1)'
                              : `${COLORS.error.light}50`)
                          : 'transparent',
                      cursor: 'pointer',
                      width: '50%',
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: useUbsTheme
                            ? '#EC0016'
                            : COLORS.error.main,
                        backgroundColor: useUbsTheme
                            ? 'rgba(236, 0, 22, 0.05)'
                            : `${COLORS.error.light}30`,
                      },
                    }}
                >
                  <ThumbDownAltIcon
                      sx={{
                        mr: 1.5,
                        fontSize: '1.25rem',
                        color: recommendation === 'not_recommended'
                            ? (useUbsTheme ? '#EC0016' : COLORS.error.main)
                            : COLORS.grey[500],
                      }}
                  />
                  <Typography>Do Not Recommend</Typography>
                </Paper>
              </Box>
            </Box>

            <Box>
              <Typography
                  sx={{
                    fontSize: TYPOGRAPHY.fontSize.body1,
                    color: COLORS.text.primary,
                    mb: 1.5,
                    fontWeight: TYPOGRAPHY.fontWeight.medium,
                  }}>
                Format
              </Typography>

              <Box sx={{display: 'flex', gap: 2}}>
                <Paper
                    elevation={0}
                    onClick={() => setFormat('html')}
                    sx={{
                      px: 2,
                      py: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      borderRadius: '8px',
                      border: `1px solid ${format === 'html'
                          ? '#4C9AFF'
                          : COLORS.grey[200]}`,
                      backgroundColor: format === 'html'
                          ? 'rgba(76, 154, 255, 0.1)'
                          : 'transparent',
                      cursor: 'pointer',
                      width: '50%',
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: '#4C9AFF',
                        backgroundColor: 'rgba(76, 154, 255, 0.05)',
                      },
                    }}
                >
                  <HtmlIcon sx={{
                    mr: 1.5,
                    color: format === 'html' ? '#4C9AFF' : COLORS.grey[500],
                  }}/>
                  <Typography>HTML</Typography>
                </Paper>

                <Paper
                    elevation={0}
                    onClick={() => setFormat('pdf')}
                    sx={{
                      px: 2,
                      py: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      borderRadius: '8px',
                      border: `1px solid ${format === 'pdf'
                          ? '#6554C0'
                          : COLORS.grey[200]}`,
                      backgroundColor: format === 'pdf'
                          ? 'rgba(101, 84, 192, 0.1)'
                          : 'transparent',
                      cursor: 'pointer',
                      width: '50%',
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: '#6554C0',
                        backgroundColor: 'rgba(101, 84, 192, 0.05)',
                      },
                    }}
                >
                  <PictureAsPdfIcon sx={{
                    mr: 1.5,
                    color: format === 'pdf' ? '#6554C0' : COLORS.grey[500],
                  }}/>
                  <Typography>PDF</Typography>
                </Paper>
              </Box>
            </Box>

            {error && (
                <Box sx={{
                  p: 2,
                  borderRadius: 1,
                  bgcolor: COLORS.error.light,
                  color: COLORS.error.main,
                  fontSize: TYPOGRAPHY.fontSize.regularText,
                }}>
                  {error}
                </Box>
            )}
          </Stack>
        </DialogContent>

        <DialogActions sx={{
          px: 3,
          py: 2,
          borderTop: `1px solid ${COLORS.grey[200]}`,
        }}>
          <Button
              onClick={handleClose}
              sx={{
                color: COLORS.text.secondary,
                fontSize: TYPOGRAPHY.fontSize.body1,
              }}
          >
            Cancel
          </Button>
          <Button
              onClick={handleExport}
              variant="contained"
              color="primary"
              disabled={isExporting}
              sx={{
                minWidth: '120px',
                fontWeight: TYPOGRAPHY.fontWeight.medium,
                fontSize: TYPOGRAPHY.fontSize.body1,
              }}
          >
            {isExporting ? (
                <CircularProgress size={24} color="inherit"/>
            ) : (
                'Export Notes'
            )}
          </Button>
        </DialogActions>
      </Dialog>
  );
};

export default ExportDialog;