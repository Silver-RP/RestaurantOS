import {
  Autocomplete,
  IconButton,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
} from '@mui/material';
import { IngredientOption } from '../../../../types/IngredientType';

interface AuditItem {
  ingredientId: string;
  estimatedQuantity: number;
  actualQuantity: number;
  reason?: string;
  note?: string;
  unit?: string;
}

interface Props {
  items: AuditItem[];
  ingredientOptions: IngredientOption[];
  onChange: (index: number, field: keyof AuditItem, value: any) => void;
  onDelete: (index: number) => void;
  disabledIds?: string[];
}

const auditReasons = [
  { value: 'expired', label: 'Hết hạn' },
  { value: 'damaged', label: 'Hư hỏng' },
  { value: 'lost', label: 'Thất lạc' },
  { value: 'wrong_preparation', label: 'Làm sai món' },
  { value: 'manual_adjustment', label: 'Điều chỉnh khác' },
];

export const InventoryAuditTable = ({
  items,
  ingredientOptions,
  onChange,
  onDelete,
  disabledIds = [],
}: Props) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>STT</TableCell>
          <TableCell>Nguyên liệu</TableCell>
          <TableCell>Tồn kho</TableCell>
          <TableCell>Thực tế</TableCell>
          <TableCell>Chênh lệch</TableCell>
          <TableCell>Lý do</TableCell>
          <TableCell>Ghi chú</TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {items.map((item, index) => {
          const currentIngredient = ingredientOptions.find(
            (opt) => opt.id === item.ingredientId,
          );
          const difference =
            typeof item.actualQuantity === 'number'
              ? item.actualQuantity - (item.estimatedQuantity ?? 0)
              : 0;

          return (
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell className="w-[200px]">
                <Autocomplete
                  size="small"
                  options={ingredientOptions}
                  getOptionLabel={(option) => option.name}
                  value={currentIngredient || null}
                  onChange={(_, newValue) => {
                    onChange(index, 'ingredientId', newValue?.id || '');
                    onChange(index, 'unit', newValue?.unit || '');
                    onChange(
                      index,
                      'estimatedQuantity',
                      newValue?.currentStock || 0,
                    );
                  }}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  disabled={disabledIds.includes(item.ingredientId)}
                  sx={{ width: '100%' }}
                  renderInput={(params) => (
                    <TextField {...params} placeholder="Chọn nguyên liệu" />
                  )}
                />
              </TableCell>
              <TableCell>
                <TextField
                  size="small"
                  type="number"
                  value={item.estimatedQuantity ?? 0}
                  InputProps={{
                    readOnly: true,
                    endAdornment: item.unit ? (
                      <InputAdornment position="end">
                        {item.unit}
                      </InputAdornment>
                    ) : undefined,
                  }}
                  sx={{ backgroundColor: '#f5f5f5' }}
                />
              </TableCell>
              <TableCell className="w-[150px]">
                <TextField
                  size="small"
                  type="number"
                  value={item.actualQuantity}
                  onChange={(e) =>
                    onChange(
                      index,
                      'actualQuantity',
                      Number(e.target.value) || 0,
                    )
                  }
                  InputProps={{
                    endAdornment: item.unit ? (
                      <InputAdornment position="end">
                        {item.unit}
                      </InputAdornment>
                    ) : undefined,
                  }}
                  inputProps={{ min: 0 }}
                />
              </TableCell>
              <TableCell>
                <TextField
                  size="small"
                  type="number"
                  value={difference}
                  InputProps={{
                    readOnly: true,
                    endAdornment: item.unit ? (
                      <InputAdornment position="end">
                        {item.unit}
                      </InputAdornment>
                    ) : undefined,
                  }}
                  sx={{ backgroundColor: '#f5f5f5' }}
                />
              </TableCell>
              <TableCell>
                <Select
                  size="small"
                  value={item.reason || ''}
                  onChange={(e) => onChange(index, 'reason', e.target.value)}
                  displayEmpty
                >
                  <MenuItem disabled value="">
                    -- Lý do --
                  </MenuItem>
                  {auditReasons.map((r) => (
                    <MenuItem key={r.value} value={r.value}>
                      {r.label}
                    </MenuItem>
                  ))}
                </Select>
              </TableCell>
              <TableCell>
                <TextField
                  size="small"
                  value={item.note || ''}
                  onChange={(e) => onChange(index, 'note', e.target.value)}
                />
              </TableCell>
              <TableCell>
                <IconButton onClick={() => onDelete(index)}>x</IconButton>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
