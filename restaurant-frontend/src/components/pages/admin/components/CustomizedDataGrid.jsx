import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { CircularProgress, Alert, Box } from '@mui/material';
import { columns, useTransactionRows } from '../internals/data/gridData';

export default function CustomizedDataGrid() {
  const { rows, isLoading, error } = useTransactionRows();

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height={400}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Có lỗi xảy ra khi tải dữ liệu: {error.message}
      </Alert>
    );
  }

  if (!rows || rows.length === 0) {
    return (
      <Alert severity="info" sx={{ mb: 2 }}>
        Không có dữ liệu giao dịch nào
      </Alert>
    );
  }

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      getRowClassName={(params) =>
        params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
      }
      hideFooterPagination
      hideFooter
      initialState={{
        pagination: { paginationModel: { pageSize: 20 } },
      }}
      disableColumnResize
      density="compact"
      loading={isLoading}
      slotProps={{
        filterPanel: {
          filterFormProps: {
            logicOperatorInputProps: {
              variant: 'outlined',
              size: 'small',
            },
            columnInputProps: {
              variant: 'outlined',
              size: 'small',
              sx: { mt: 'auto' },
            },
            operatorInputProps: {
              variant: 'outlined',
              size: 'small',
              sx: { mt: 'auto' },
            },
            valueInputProps: {
              InputComponentProps: {
                variant: 'outlined',
                size: 'small',
              },
            },
          },
        },
      }}
      sx={{
        '& .even': {
          backgroundColor: '#f9f9f9',
        },
        '& .odd': {
          backgroundColor: '#ffffff',
        },
      }}
    />
  );
}
