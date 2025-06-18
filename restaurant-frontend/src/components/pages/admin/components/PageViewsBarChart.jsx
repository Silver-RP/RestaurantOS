import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { BarChart } from '@mui/x-charts/BarChart';
import { useTheme } from '@mui/material/styles';
import { useRevenueChart } from '@/hooks/useDashboard';

export default function RevenueBarChart() {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = React.useState(currentYear);

  const { data: revenueResponse, isLoading: isLoadingRevenue, error: revenueError } = useRevenueChart({ year: selectedYear });

  // Extract data array from response
  const revenueData = revenueResponse?.data || [];

  // Extract data arrays
  const months = revenueData.length ? revenueData.map(item => item.month) : [];
  const orderRevenue = revenueData.length ? revenueData.map(item => item.orderRevenue || 0) : [];
  const reservationRevenue = revenueData.length ? revenueData.map(item => item.reservationRevenue || 0) : [];
  const orderCount = revenueData.length ? revenueData.map(item => item.orderCount || 0) : [];
  const reservationCount = revenueData.length ? revenueData.map(item => item.reservationCount || 0) : [];

  // Calculate total revenue
  const totalRevenue = revenueData.reduce((sum, item) => 
    sum + (item.orderRevenue || 0) + (item.reservationRevenue || 0), 0
  );

  const formatMillionVND = (value) => `${(value / 1_000_000).toFixed(0)}tr`;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const createTooltipFormatter = (dataArray, label) => (value, context) => {
    const dataIndex = context?.dataIndex;
    if (dataIndex !== undefined && dataArray[dataIndex] !== undefined) {
      return `${label}: ${formatCurrency(value)} | Số đơn: ${dataArray[dataIndex]}`;
    }
    return `${label}: ${formatCurrency(value)}`;
  };

  // Generate year options (e.g., last 5 years)
  const yearOptions = Array.from({ length: 3 }, (_, i) => currentYear - i);

  return (
    <Card variant="outlined" sx={{ width: '100%' }}>
      <CardContent>
        {/* Header with Select */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0 }}>
          <Box>
            <Typography component="h2" variant="subtitle2" gutterBottom>
              Tổng doanh thu
            </Typography>
          </Box>
          <Select
            size="small"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            sx={{ minWidth: 80 }}
          >
            {yearOptions.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </Box>

        {isLoadingRevenue ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : revenueError ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {revenueError.message || 'Có lỗi xảy ra khi tải dữ liệu'}
          </Alert>
        ) : (
          <>
            <Stack sx={{ mb: 1 }}>
              <Typography variant="h4" component="p">
                {formatCurrency(totalRevenue)}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Doanh thu đơn hàng và đặt bàn trong năm {selectedYear}
              </Typography>
            </Stack>

            <BarChart
              borderRadius={6}
              colors={[theme.palette.primary.dark, theme.palette.primary.light]}
              xAxis={[{
                scaleType: 'band',
                data: months,
                height: 24,
                categoryGapRatio: 0.3,
              }]}
              yAxis={[{
                width: 40,
                valueFormatter: (v) => formatMillionVND(v),
              }]}
              series={[
                {
                  id: 'orders',
                  label: 'Đơn hàng',
                  data: orderRevenue,
                  stack: 'A',
                  color: theme.palette.primary.dark,
                  valueFormatter: createTooltipFormatter(orderCount, 'Đơn hàng'),
                },
                {
                  id: 'reservations',
                  label: 'Đặt bàn',
                  data: reservationRevenue,
                  stack: 'A',
                  color: theme.palette.primary.light,
                  valueFormatter: createTooltipFormatter(reservationCount, 'Đặt bàn'),
                },
              ]}
              height={250}
              margin={{ left: 0, right: 0, top: 20, bottom: 0 }}
              grid={{ horizontal: true }}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}