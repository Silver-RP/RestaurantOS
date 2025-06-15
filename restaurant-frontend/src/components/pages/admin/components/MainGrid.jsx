import * as React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Copyright from '../internals/components/Copyright';
import ChartUserByCountry from './ChartUserByCountry';
import CustomizedTreeView from './CustomizedTreeView';
import CustomizedDataGrid from './CustomizedDataGrid';
import HighlightedCard from './HighlightedCard';
import PageViewsBarChart from './PageViewsBarChart';
import SessionsChart from './SessionsChart';
import StatCard from './StatCard';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { autocompleteClasses } from '@mui/material/Autocomplete';

// Mẫu data API sẽ trả về
const mockData = {
  daily: [
    {
      title: 'Tổng doanh thu đơn hàng',
      value: '25500000', // Giá trị thực tế là 25.5tr VND
      displayValue: '25.5M', // Giá trị hiển thị đã được format
      interval: 'Hôm nay',
      trend: 'up',
      percent: '+25.5',
      chartData: {
        labels: [
          '00:00',
          '01:00',
          '02:00',
          '03:00',
          '04:00',
          '05:00',
          '06:00',
          '07:00',
          '08:00',
          '09:00',
          '10:00',
          '11:00',
          '12:00',
          '13:00',
          '14:00',
          '15:00',
          '16:00',
          '17:00',
          '18:00',
          '19:00',
          '20:00',
          '21:00',
          '22:00',
          '23:00',
        ],
        values: [
          150000, 220000, 180000, 240000, 280000, 350000, 450000, 550000,
          680000, 780000, 850000, 920000, 980000, 1100000, 1250000, 1400000,
          1550000, 1680000, 1750000, 1820000, 1950000, 2100000, 2250000,
          2340000,
        ],
      },
    },
    {
      title: 'Tổng doanh thu đặt bàn',
      value: '8200000', // 8.2tr VND
      displayValue: '8.2M',
      interval: 'Hôm nay',
      trend: 'down',
      percent: '-12.3',
      chartData: {
        labels: [
          '00:00',
          '01:00',
          '02:00',
          '03:00',
          '04:00',
          '05:00',
          '06:00',
          '07:00',
          '08:00',
          '09:00',
          '10:00',
          '11:00',
          '12:00',
          '13:00',
          '14:00',
          '15:00',
          '16:00',
          '17:00',
          '18:00',
          '19:00',
          '20:00',
          '21:00',
          '22:00',
          '23:00',
        ],
        values: [
          50000, 75000, 95000, 120000, 180000, 250000, 320000, 380000, 420000,
          460000, 520000, 580000, 620000, 680000, 720000, 780000, 820000,
          850000, 880000, 920000, 950000, 980000, 1020000, 1080000,
        ],
      },
    },
    {
      title: 'Tổng người dùng đăng ký',
      value: '152', // Số lượng người
      displayValue: '152',
      interval: 'Hôm nay',
      trend: 'neutral',
      percent: '+5.2',
      chartData: {
        labels: [
          '00:00',
          '01:00',
          '02:00',
          '03:00',
          '04:00',
          '05:00',
          '06:00',
          '07:00',
          '08:00',
          '09:00',
          '10:00',
          '11:00',
          '12:00',
          '13:00',
          '14:00',
          '15:00',
          '16:00',
          '17:00',
          '18:00',
          '19:00',
          '20:00',
          '21:00',
          '22:00',
          '23:00',
        ],
        values: [
          2, 3, 4, 5, 6, 8, 10, 12, 15, 18, 22, 25, 28, 32, 35, 38, 42, 45, 48,
          52, 55, 58, 62, 65,
        ],
      },
    },
  ],
  weekly: [
    {
      title: 'Tổng doanh thu đơn hàng',
      value: '168300000', // 168.3tr VND
      displayValue: '168.3M',
      interval: 'Tuần này',
      trend: 'up',
      percent: '+32.8',
      chartData: {
        labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
        values: [
          22500000, 24800000, 25600000, 23900000, 26700000, 28500000, 16300000,
        ],
      },
    },
    {
      title: 'Tổng doanh thu đặt bàn',
      value: '52800000', // 52.8tr VND
      displayValue: '52.8M',
      interval: 'Tuần này',
      trend: 'up',
      percent: '+18.7',
      chartData: {
        labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
        values: [6800000, 7200000, 7800000, 8100000, 8500000, 8900000, 5500000],
      },
    },
    {
      title: 'Tổng người dùng đăng ký',
      value: '847',
      displayValue: '847',
      interval: 'Tuần này',
      trend: 'up',
      percent: '+15.5',
      chartData: {
        labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
        values: [125, 132, 128, 142, 138, 145, 37],
      },
    },
  ],
  monthly: [
    {
      title: 'Tổng doanh thu đơn hàng',
      value: '721500000', // 721.5tr VND
      displayValue: '721.5M',
      interval: 'Tháng này',
      trend: 'up',
      percent: '+45.2',
      chartData: {
        labels: Array.from({ length: 30 }, (_, i) => `${i + 1}`), // 1-30
        values: Array.from({ length: 30 }, () =>
          Math.floor(Math.random() * 30000000),
        ), // Random values for demo
      },
    },
    {
      title: 'Tổng doanh thu đặt bàn',
      value: '235400000', // 235.4tr VND
      displayValue: '235.4M',
      interval: 'Tháng này',
      trend: 'up',
      percent: '+28.9',
      chartData: {
        labels: Array.from({ length: 30 }, (_, i) => `${i + 1}`),
        values: Array.from({ length: 30 }, () =>
          Math.floor(Math.random() * 10000000),
        ),
      },
    },
    {
      title: 'Tổng người dùng đăng ký',
      value: '3200',
      displayValue: '3.2K',
      interval: 'Tháng này',
      trend: 'up',
      percent: '+22.4',
      chartData: {
        labels: Array.from({ length: 30 }, (_, i) => `${i + 1}`),
        values: Array.from({ length: 30 }, () =>
          Math.floor(Math.random() * 150),
        ),
      },
    },
  ],
};

export default function MainGrid() {
  const [timeRange, setTimeRange] = React.useState('daily');
  const [previousData, setPreviousData] = React.useState(null);

  const handleTimeRangeChange = (event) => {
    setPreviousData(mockData[timeRange]);
    setTimeRange(event.target.value);
  };

  const data = mockData[timeRange];

  return (
    <Box sx={{ width: '100%' }}>
      {/* header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        sx={{ mb: 2, mt: 0.5 }}
      >
        <Typography component="h2" variant="h6">
          Tổng quan
        </Typography>
        <FormControl sx={{ minWidth: 120 }} size="small">
          <Select
            value={timeRange}
            onChange={handleTimeRangeChange}
            displayEmpty
          >
            <MenuItem value="daily">Hàng ngày</MenuItem>
            <MenuItem value="weekly">Hàng tuần</MenuItem>
            <MenuItem value="monthly">Hàng tháng</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {/* Stats Cards */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          mb: 2,
          width: '100%',
          '& > *': {
            flex: '1 1 0',
          },
        }}
      >
        {data.map((card, index) => (
          <Box key={index}>
            <StatCard
              title={card.title}
              value={card.displayValue}
              interval={card.interval}
              trend={card.trend}
              percent={`${card.percent}%`}
              data={card.chartData.values}
              xAxis={{
                scaleType: 'band',
                data: card.chartData.labels,
              }}
            />
          </Box>
        ))}
      </Box>

      {/* Charts */}
      <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12, md: 6 }}>
          <SessionsChart />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <PageViewsBarChart />
        </Grid>
      </Grid>

      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Details
      </Typography>
      <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12, lg: 9 }}>
          <CustomizedDataGrid />
        </Grid>
        <Grid size={{ xs: 12, lg: 3 }}>
          <Stack gap={2} direction={{ xs: 'column', sm: 'row', lg: 'column' }}>
            <CustomizedTreeView />
            <ChartUserByCountry />
          </Stack>
        </Grid>
      </Grid>
      <Copyright sx={{ my: 4 }} />
    </Box>
  );
}
