// src/components/Logo.js
import React from 'react';
import {Box, Typography} from '@mui/material';
import {isUbsTheme} from '../themes';

/**
 * Logo component that displays either the UBS logo or application name
 * based on the current theme
 */
const Logo = ({variant = 'default'}) => {
  const useUbsLogo = isUbsTheme();
  const logoHeight = variant === 'small' ? 24 : 32;

  if (useUbsLogo) {
    return (
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          height: logoHeight,
          mr: 2,
        }}>
          <img
              src="https://upload.wikimedia.org/wikipedia/commons/3/34/UBS_Logo.png"
              alt="UBS"
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