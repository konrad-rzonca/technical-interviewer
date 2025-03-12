// src/components/Logo.js
import React from 'react';
import {Box, Typography} from '@mui/material';
import {isCorporateTheme} from '../themes/themeUtils';

/**
 * Logo component that displays either the Corporate logo or application name
 * based on the current theme
 */
const Logo = ({variant = 'default'}) => {
  const useCorporateLogo = isCorporateTheme();
  const logoHeight = variant === 'small' ? 24 : 32;

  if (useCorporateLogo) {
    return (
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          height: logoHeight,
          mr: 2,
        }}>
          <img
              src={process.env.PUBLIC_URL + '/assets/images/corporate-logo.png'}
              alt="Corporate"
              height={logoHeight}
              style={{display: 'block'}}
          />
        </Box>
    );
  }

  return (
      <Typography
          variant={variant === 'small' ? 'h6' : 'h5'}
          sx={{
            fontWeight: 500,
            mr: 2,
            display: 'block',
          }}
      >
        Interviewer
      </Typography>
  );
};

export default Logo;