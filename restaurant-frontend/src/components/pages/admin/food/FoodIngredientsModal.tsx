import React from 'react';
import { DialogTitle, DialogContent, Dialog } from '@mui/material';
import { useDishIngredient } from '@/hooks/useFoodsAdminLogic';
import { ingredientUnits } from '../ingredients/ingredientUnits';
import {
  Autocomplete,
  TextField,
  Select,
  MenuItem,
  IconButton,
} from '@mui/material';

interface FoodIngredientsModalProps {
  dishId: string;
  open: boolean;
  onClose: () => void;
}

const FoodIngredientsModal: React.FC<FoodIngredientsModalProps> = ({
  dishId,
  open,
  onClose,
}) => {
  const {
    dataDishIngredients,
    isLoading,
    currentTime,
    handleDelete,
    setNewIngredients,
    formatDate,
    dishData,
    handleDeleteNewIngredient,
    showInputRows,
    setShowInputRows,
    hasIngredients,
    newIngredients,
    ingredientOptions,
    handleNewIngredientChange,
  } = useDishIngredient(dishId);

  if (isLoading) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogContent>
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Đang tải...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const renderIngredientRows = (ingredients: any[]) => {
    return ingredients.map((item, index) => (
      <tr key={item._id} className="border-b">
        <td className="py-2">
          <p className="font-medium">{index + 1}</p>
        </td>
        <td className="text-center">{item.ingredientName}</td>
        <td className="text-center">{item.quantity}</td>
        <td className="text-center">{item.unit}</td>
        <td className="text-center">
          <button
            className=" gap-2 px-2 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
            onClick={() => handleDelete(item._id)}
          >
            Xoá
          </button>
        </td>
      </tr>
    ));
  };

  const renderNewIngredientRows = () => {
    if (!showInputRows) return null;

    return newIngredients.map((item, index) => (
      <tr key={`new-${index}`} className="border-b bg-gray-50">
        <td className="py-2">{dataDishIngredients.length + index + 1}</td>

        <td className="text-center min-w-[200px]">
          <Autocomplete
            options={ingredientOptions}
            getOptionLabel={(option) => option.name}
            value={
              ingredientOptions.find(
                (i) => i._id === (item as any).ingredientId,
              ) || null
            }
            onChange={(event, newValue) => {
              handleNewIngredientChange(
                index,
                'ingredientId',
                newValue?._id || '',
              );
              handleNewIngredientChange(index, 'name', newValue?.name || '');
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                placeholder="Tên nguyên liệu"
                fullWidth
              />
            )}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            renderOption={(props, option) => (
              <li {...props} key={option._id}>
                {option.name}
              </li>
            )}
          />
        </td>

        <td className="text-center">
          <TextField
            type="number"
            size="small"
            placeholder="Số lượng"
            value={item.quantity}
            inputProps={{ min: 0, style: { textAlign: 'right' } }}
            onKeyDown={(e) => {
              if (e.key === '-' || e.key === 'e' || e.key === '+') {
                e.preventDefault();
              }
            }}
            onChange={(e) => {
              const value = e.target.value;
              if (value === '' || Number(value) >= 0) {
                handleNewIngredientChange(index, 'quantity', value);
              }
            }}
            fullWidth
          />
        </td>

        <td className="text-center min-w-[120px]">
          <Select
            size="small"
            value={item.unit}
            onChange={(e) =>
              handleNewIngredientChange(index, 'unit', e.target.value)
            }
            displayEmpty
            fullWidth
            inputProps={{ 'aria-label': 'Chọn đơn vị' }}
          >
            <MenuItem disabled value="">
              -- Chọn đơn vị --
            </MenuItem>
            {ingredientUnits.map(({ value, label }) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </td>

        <td className="text-center">
          <IconButton
            size="small"
            onClick={() => handleDeleteNewIngredient(index)}
            aria-label="Xóa nguyên liệu"
          >
            x
          </IconButton>
        </td>
      </tr>
    ));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className="bg-gray-50 flex justify-between items-center">
        <span className="text-xl font-bold">Nguyên liệu của món ăn</span>
        <div className="text-sm font-normal">{formatDate(currentTime)}</div>
      </DialogTitle>
      <DialogContent>
        <div className="py-4 space-y-6">
          {/* Thông tin món ăn */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Thông tin món ăn
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Tên món ăn</p>
                <p className="font-medium">{dishData.name}</p>
                <p className="text-gray-600">Ảnh</p>
                <div className="flex items-center">
                  {dishData.image ? (
                    <img
                      src={dishData.image}
                      alt={dishData.name}
                      className="w-36 h-36 object-cover rounded"
                    />
                  ) : (
                    <span className="text-gray-500">Chưa có ảnh</span>
                  )}
                </div>
              </div>
              <div>
                <p className="text-gray-600">Mô tả nguyên liệu</p>
                {dishData.ingredients ? (
                  <ul className="list-disc list-inside font-medium">
                    {dishData.ingredients
                      ?.split(',')
                      .map(
                        (
                          ingredient: string,
                          index: React.Key | null | undefined,
                        ) => <li key={index}>{ingredient.trim()}</li>,
                      )}
                  </ul>
                ) : (
                  <p className="font-medium">Chưa có mô tả nguyên liệu</p>
                )}
              </div>
            </div>
          </div>

          {/* Danh sách nguyên liệu */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Danh sách nguyên liệu
            </h3>

            {dataDishIngredients.length === 0 && (
              <p className="text-gray-500 italic mb-5">
                Món ăn chưa có nguyên liệu.
              </p>
            )}

            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left pb-2">No.</th>
                  <th className="text-center pb-2">Tên nguyên liệu</th>
                  <th className="text-center pb-2">Số lượng</th>
                  <th className="text-center pb-2">Đơn vị</th>
                  <th className="text-center pb-2">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {renderIngredientRows(dataDishIngredients)}
                {renderNewIngredientRows()}
                {!showInputRows && (
                  <tr>
                    <td colSpan={5} className="text-center py-4">
                      <button
                        className="px-2 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                        onClick={() => {
                          setShowInputRows(true);
                          setNewIngredients([
                            { name: '', quantity: '', unit: '' },
                          ]);
                        }}
                      >
                        + Thêm
                      </button>
                    </td>
                  </tr>
                )}
                {showInputRows && (
                  <tr>
                    <td colSpan={5} className="text-center py-4">
                      <button
                        className="px-2 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                        onClick={() =>
                          setNewIngredients([
                            ...newIngredients,
                            { name: '', quantity: '', unit: '' },
                          ])
                        }
                      >
                        + Thêm
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="flex justify-end gap-2 mt-5">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                onClick={onClose}
              >
                Huỷ
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-adminprimary text-white rounded hover:bg-blue-700"
              >
                {hasIngredients ? 'Lưu cập nhật' : 'Thêm nguyên liệu'}
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FoodIngredientsModal;
