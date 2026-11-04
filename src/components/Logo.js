// src/components/Logo.js
import React from 'react';
import {Typography} from '@mui/material';

const Logo = ({variant = 'default'}) => (
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

export default Logo;
