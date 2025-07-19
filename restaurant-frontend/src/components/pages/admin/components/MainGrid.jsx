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
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { useDashboardMetrics } from '@/hooks/useDashboard';

export default function MainGrid() {
  const [timeRange, setTimeRange] = React.useState('daily');

  const { data, isLoading, error } = useDashboardMetrics({ timeRange });

  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };

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
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error?.message || 'Có lỗi xảy ra khi tải dữ liệu'}
        </Alert>
      ) : data ? (
        <>
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
            {data.data.map((card, index) => (
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
              <CustomizedDataGrid />
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
              <Stack
                gap={2}
                direction={{ xs: 'column', sm: 'row', lg: 'column' }}
              >
                <CustomizedTreeView />
                <ChartUserByCountry />
              </Stack>
            </Grid>
          </Grid>
        </>
      ) : null}
      <Copyright sx={{ my: 4 }} />
    </Box>
  );
}
