import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MainGrid from './components/MainGrid'; // đổi lại đúng path nếu cần

const theme = createTheme(); // hoặc theme đã tùy chỉnh của bạn

const DashboardPage = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MainGrid />
    </ThemeProvider>
  );
};

export default DashboardPage;
