import { Box, Container } from '@mui/material';
import React from 'react';

interface LayoutProps {
  children?: React.ReactNode;
}

const MainLayout = ({ children }: LayoutProps) => {
  return (
    <Box>
      <Container
        component='main'
        maxWidth='lg'
        sx={{ px: { md: 3, mt: 3, sm: 2, xs: 0 } }}
      >
        {children}
      </Container>
    </Box>
  );
};

export default MainLayout;
