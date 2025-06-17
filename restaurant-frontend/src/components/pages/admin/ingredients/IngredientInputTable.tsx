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
  Tooltip,
} from '@mui/material';
import { IngredientInputItem } from '@/hooks/useIngredientsAdminLogic';
import { getUnitLabel } from '../../../../types/ingredientUnitsType';
import { IngredientOption } from '../../../../types/IngredientType';

interface Props {
  items: IngredientInputItem[];
  ingredientOptions: IngredientOption[];
  onChange: (
    index: number,
    field: keyof IngredientInputItem,
    value: string,
  ) => void;
  onDelete: (index: number) => void;
  disabledIds?: string[];
}

export const IngredientInputTable = ({
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
          <TableCell sx={{ minWidth: 220 }}>Nguyên liệu</TableCell>
          <TableCell>Số lượng</TableCell>
          <TableCell>Đơn vị</TableCell>
          <TableCell>Ghi chú</TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {items?.map((item, index) => (
          <TableRow key={index}>
            <TableCell>{index + 1}</TableCell>
            <TableCell>
              <Autocomplete
                size="small"
                options={ingredientOptions}
                getOptionLabel={(option) => option.name}
                value={
                  ingredientOptions.find(
                    (opt) => opt.id === item.ingredientId,
                  ) || null
                }
                onChange={(_, newValue) => {
                  onChange(index, 'ingredientId', newValue?.id || '');
                  onChange(index, 'unit', newValue?.unit || '');
                }}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                disabled={disabledIds.includes(item.ingredientId)}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Chọn nguyên liệu" />
                )}
                renderOption={(props, option) => {
                  const isUsed = items.some(
                    (i, iIdx) => i.ingredientId === option.id && iIdx !== index,
                  );

                  return (
                    <li
                      {...props}
                      key={option.id}
                      style={{
                        opacity: isUsed ? 0.5 : 1,
                        pointerEvents: isUsed ? 'none' : 'auto',
                      }}
                    >
                      {option.name} {isUsed && '(Đã thêm)'}
                    </li>
                  );
                }}
              />
            </TableCell>
            <TableCell>
              <Tooltip
                title={!item.ingredientId ? 'Hãy chọn nguyên liệu trước' : ''}
              >
                <span>
                  <TextField
                    size="small"
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      onChange(
                        index,
                        'quantity',
                        String(Math.max(0, Number(e.target.value))),
                      )
                    }
                    inputProps={{ min: 0, step: 0.1 }}
                    disabled={!item.ingredientId}
                    fullWidth
                  />
                </span>
              </Tooltip>
            </TableCell>
            <TableCell>
              <Select
                size="small"
                value={item.unit}
                onChange={(e) => onChange(index, 'unit', e.target.value)}
                fullWidth
                displayEmpty
                disabled={!item.ingredientId}
              >
                <MenuItem disabled value="">
                  -- Chọn đơn vị --
                </MenuItem>
                <MenuItem value={item.unit}>{getUnitLabel(item.unit)}</MenuItem>
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
        ))}
      </TableBody>
    </Table>
  );
};
