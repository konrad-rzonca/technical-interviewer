// src/components/common/SkeletonComponents.js
import React from 'react';
import {Box, Skeleton} from '@mui/material';
import {COLORS, SPACING} from '../../themes/baseTheme';

/**
 * QuestionSkeleton - Displays a loading skeleton for question details
 * Used during progressive loading of question content
 */
export const QuestionSkeleton = () => (
    <Box sx={{width: '100%'}}>
      {/* Question header skeleton */}
      <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: SPACING.toUnits(SPACING.md),
            p: SPACING.toUnits(SPACING.lg),
            border: '1px solid rgba(0, 0, 0, 0.04)',
            borderRadius: SPACING.toUnits(SPACING.borderRadius),
            backgroundColor: 'rgba(0, 0, 0, 0.01)',
          }}
      >
        <Skeleton variant="circular" width={40} height={40}/>
        <Skeleton
            variant="text"
            width="70%"
            height={32}
            sx={{
              mx: SPACING.toUnits(SPACING.md),
            }}
        />
        <Skeleton variant="circular" width={40} height={40}/>
      </Box>

      {/* Answer insights skeleton */}
      <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: SPACING.toUnits(SPACING.sm),
            mb: SPACING.toUnits(SPACING.md),
          }}
      >
        {/* Basic level */}
        <Box
            sx={{
              flex: 1,
              p: SPACING.toUnits(SPACING.md),
              border: `1px solid ${COLORS.basic.main}50`,
              borderRadius: SPACING.toUnits(SPACING.borderRadius),
              backgroundColor: `${COLORS.basic.main}08`,
            }}
        >
          <Skeleton
              variant="text"
              width="60%"
              height={28}
              sx={{
                mb: SPACING.toUnits(SPACING.md),
                mx: 'auto',
              }}
          />
          {[1, 2, 3].map((i) => (
              <Skeleton
                  key={`basic-${i}`}
                  variant="rounded"
                  width="100%"
                  height={40}
                  sx={{
                    mb: SPACING.toUnits(SPACING.sm),
                    borderRadius: SPACING.toUnits(SPACING.borderRadius / 2),
                  }}
              />
          ))}
        </Box>

        {/* Intermediate level */}
        <Box
            sx={{
              flex: 1,
              p: SPACING.toUnits(SPACING.md),
              border: `1px solid ${COLORS.intermediate.main}50`,
              borderRadius: SPACING.toUnits(SPACING.borderRadius),
              backgroundColor: `${COLORS.intermediate.main}08`,
            }}
        >
          <Skeleton
              variant="text"
              width="60%"
              height={28}
              sx={{
                mb: SPACING.toUnits(SPACING.md),
                mx: 'auto',
              }}
          />
          {[1, 2, 3].map((i) => (
              <Skeleton
                  key={`intermediate-${i}`}
                  variant="rounded"
                  width="100%"
                  height={40}
                  sx={{
                    mb: SPACING.toUnits(SPACING.sm),
                    borderRadius: SPACING.toUnits(SPACING.borderRadius / 2),
                  }}
              />
          ))}
        </Box>

        {/* Advanced level */}
        <Box
            sx={{
              flex: 1,
              p: SPACING.toUnits(SPACING.md),
              border: `1px solid ${COLORS.advanced.main}50`,
              borderRadius: SPACING.toUnits(SPACING.borderRadius),
              backgroundColor: `${COLORS.advanced.main}08`,
            }}
        >
          <Skeleton
              variant="text"
              width="60%"
              height={28}
              sx={{
                mb: SPACING.toUnits(SPACING.md),
                mx: 'auto',
              }}
          />
          {[1, 2, 3].map((i) => (
              <Skeleton
                  key={`advanced-${i}`}
                  variant="rounded"
                  width="100%"
                  height={40}
                  sx={{
                    mb: SPACING.toUnits(SPACING.sm),
                    borderRadius: SPACING.toUnits(SPACING.borderRadius / 2),
                  }}
              />
          ))}
        </Box>
      </Box>

      {/* Evaluation section skeleton */}
      <Box sx={{mt: SPACING.toUnits(SPACING.md)}}>
        <Skeleton
            variant="text"
            width="30%"
            height={24}
            sx={{
              mb: SPACING.toUnits(SPACING.sm),
            }}
        />
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          mb: SPACING.toUnits(SPACING.md),
        }}>
          <Skeleton
              variant="text"
              width={60}
              height={24}
              sx={{
                mr: SPACING.toUnits(SPACING.md),
              }}
          />
          <Skeleton
              variant="rounded"
              width={160}
              height={24}
          />
        </Box>
        <Skeleton
            variant="rounded"
            width="100%"
            height={80}
        />
      </Box>
    </Box>
);

/**
 * RelatedQuestionsSkeleton - Displays a loading skeleton for related questions
 */
export const RelatedQuestionsSkeleton = ({count = 3}) => (
    <Box sx={{width: '100%'}}>
      <Skeleton
          variant="text"
          width="50%"
          height={24}
          sx={{
            mb: SPACING.toUnits(SPACING.md),
          }}
      />

      {Array.from({length: count}).map((_, index) => (
          <Box
              key={`related-${index}`}
              sx={{
                mb: SPACING.toUnits(SPACING.sm),
                display: 'flex',
                flexDirection: 'column',
                p: SPACING.toUnits(SPACING.sm),
                borderLeft: `3px solid ${COLORS.grey[300]}`,
                borderRadius: SPACING.toUnits(SPACING.borderRadius / 2),
              }}
          >
            <Skeleton variant="text" width="80%" height={20}/>
            <Skeleton variant="text" width="40%" height={16} sx={{mt: 0.5}}/>
          </Box>
      ))}
    </Box>
);

export default {
  QuestionSkeleton,
  RelatedQuestionsSkeleton,
};