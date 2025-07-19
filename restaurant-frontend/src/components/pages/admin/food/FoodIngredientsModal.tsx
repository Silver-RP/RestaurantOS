import React from 'react';
import { DialogTitle, DialogContent, Dialog } from '@mui/material';
import { useDishIngredient } from '@/hooks/useFoodsAdminLogic';
import { ingredientUnits } from '../../../../types/ingredientUnitsType';
import {
  Autocomplete,
  TextField,
  Select,
  MenuItem,
  IconButton,
} from '@mui/material';
import clsx from 'clsx';
import TimeDisplay from '@/components/common/TimeDisplay';

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
    setNewIngredients,
    dishData,
    handleDeleteNewIngredient,
    showInputRows,
    handleSave,
    setShowInputRows,
    hasIngredients,
    newIngredients,
    ingredientOptions,
    handleNewIngredientChange,
    handleUpdateIngredient,
    handleSoftDelete,
    handleUndoDelete,
    handleStartEdit,
    handleCancelEdit,
  } = useDishIngredient(dishId, onClose);

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

  if (!dataDishIngredients) return null; 

  const renderIngredientRows = () => {
    return dataDishIngredients.map((item: any, index: number) => {
      const isDeleted = item._status === 'deleted';
      const isEdited = item._status === 'edited';

      return (
        <tr
            key={item._id}
            className={clsx(
                'border-b',
                isDeleted && 'opacity-40 ',
                isEdited && 'bg-yellow-50', 
            )}
        >
          {/* STT */}
          <td className="py-2 text-center ">
            <span className="font-medium">{index + 1}</span>
          </td>

          {/* Tên nguyên liệu */}
          <td className=" text-left pl-24 ">
            {isEdited ? (
              <Autocomplete
                size="small"
                options={ingredientOptions}
                getOptionLabel={(option) => option.name}
                value={
                  ingredientOptions.find(
                    (opt) => opt._id === item.ingredientId,
                  ) || null
                }
                onChange={(event, newValue) => {
                  handleUpdateIngredient(
                    item._id,
                    'ingredientId',
                    newValue?._id || '',
                  );
                  handleUpdateIngredient(
                    item._id,
                    'name',
                    newValue?.name || '',
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Chọn nguyên liệu"
                    fullWidth
                  />
                )}
                isOptionEqualToValue={(option, value) =>
                  option._id === value._id
                }
                renderOption={(props, option) => {
                    const isSelectedInOtherRow = dataDishIngredients.some(
                        (x) => x.ingredientId === option._id && x.ingredientId !== item.ingredientId
                      );
                
                    const isCurrentlySelected = item.ingredientId === option._id;
                
                    const isDisabled = isSelectedInOtherRow || isCurrentlySelected;
                
                    const label = `${option.name} ${
                        isSelectedInOtherRow
                            ? '(Đã thêm)'
                            : isCurrentlySelected
                            ? '(Đang chọn)'
                            : ''
                    }`;
                  
                    return (
                      <li
                        {...props}
                        key={option._id}
                        style={{
                          opacity: isDisabled ? 0.4 : 1,
                          pointerEvents: isDisabled ? 'none' : 'auto',
                        }}
                      >
                        {label}
                      </li>
                    );
                  }}
                  
                  
              />
            ) : (
              <span className="font-semibold text-gray-800">
                {item.ingredientName}
              </span>
            )}
          </td>

          {/* Số lượng */}
          <td className="text-center min-w-[100px] ">
            {isEdited ? (
              <TextField
                size="small"
                type="number"
                value={item.quantity || ''}
                inputProps={{ min: 0, style: { textAlign: 'center' } }}
                onChange={(e) =>
                  handleUpdateIngredient(item._id, 'quantity', e.target.value)
                }
                onKeyDown={(e) => {
                  if (['-', '+', 'e'].includes(e.key)) e.preventDefault();
                }}
              />
            ) : (
              <span>{String(item.quantity)}</span>
            )}
          </td>

          {/* Đơn vị */}
          <td className="text-center min-w-[120px]">
            {isEdited ? (
              <Select
                size="small"
                value={item.unit}
                onChange={(e) =>
                  handleUpdateIngredient(item._id, 'unit', e.target.value)
                }
                displayEmpty
                fullWidth
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
            ) : (
              <span>
                 {ingredientUnits.map(({ value, label }) => (
                    value === item.unit ? label : null
                    )) || item.unit}
                </span>
            )}
          </td>

          {/* Hành động */}
          <td className="text-center">
            {isDeleted ? (
              <button
                className="px-2 py-1 text-sm text-blue-600 hover:underline"
                onClick={() => handleUndoDelete(item._id)}
              >
                Hoàn tác
              </button>
            ) : isEdited ? (
              <button
                className="px-2 py-1 text-sm text-gray-600 hover:underline"
                onClick={() => handleCancelEdit(item._id)}
              >
                Huỷ
              </button>
            ) : (
              <div className="flex justify-center gap-2">
                <button
                  className="px-2 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600"
                  onClick={() => handleStartEdit(item._id)}
                >
                  Sửa
                </button>
                <button
                  className="px-2 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                  onClick={() => handleSoftDelete(item._id)}
                >
                  Xoá
                </button>
              </div>
            )}
          </td>
        </tr>
      );
    });
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
            renderOption={(props, option) => {
              const isUsed =
                dataDishIngredients.some(
                  (item: { ingredientId: string }) =>
                    item.ingredientId === option._id,
                ) ||
                newIngredients.some(
                  (item, i) => item.ingredientId === option._id && i !== index,
                );

              return (
                <li
                  {...props}
                  key={option._id}
                  style={{
                    opacity: isUsed ? 0.4 : 1,
                    pointerEvents: isUsed ? 'none' : 'auto',
                  }}
                >
                  {option.name} {isUsed && '(Đã thêm)'}
                </li>
              );
            }}
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
        <TimeDisplay />
      </DialogTitle>
      <DialogContent>
        <div className="py-4 space-y-6">
          {/* Thông tin món ăn */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3 border-gray-200">
              Thông tin món ăn
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tên món ăn + ảnh */}
              <div>
                <p className="text-sm text-gray-500 mb-1">Tên món ăn</p>
                <p className="text-lg font-semibold text-gray-900 mb-4">
                  {dishData.name}
                </p>

                <p className="text-sm text-gray-500 mb-1">Ảnh minh hoạ</p>
                <div className="flex items-center justify-start">
                  {dishData.image ? (
                    <img
                      src={dishData.image}
                      alt={dishData.name}
                      className="w-40 h-40 object-cover rounded-lg border border-gray-200 hover:scale-105 transition-transform"
                    />
                  ) : (
                    <span className="text-gray-500 italic">Chưa có ảnh</span>
                  )}
                </div>
              </div>

              {/* Mô tả nguyên liệu */}
              <div>
                <p className="text-sm text-gray-500 mb-1">Mô tả nguyên liệu</p>
                {dishData.ingredients ? (
                  <ul className="list-disc list-inside text-base text-gray-800 font-medium space-y-1">
                    {dishData.ingredients
                      .split(',')
                      .map(
                        (
                          ingredient: string,
                          index: React.Key | null | undefined,
                        ) => (
                          <li key={index}>{ingredient.trim()}</li>
                        ),
                      )}
                  </ul>
                ) : (
                  <p className="text-gray-600 italic">
                    Chưa có mô tả nguyên liệu
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Danh sách nguyên liệu */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Danh sách nguyên liệu
            </h3>

            {Array.isArray(dataDishIngredients) &&
              dataDishIngredients.length === 0 && (
                <p className="text-gray-500 italic mb-5">
                  Món ăn chưa có nguyên liệu.
                </p>
              )}

            <table className="w-full">
              <thead className='bg-gray-100 text-gray-700 align-center'>
                <tr className="border-b">
                  <th className="align-middle text-left py-1">No.</th>
                  <th className="align-middle text-left py-1 pl-24">Tên nguyên liệu</th>
                  <th className="align-middle text-center py-1">Số lượng</th>
                  <th className="align-middle text-center py-1">Đơn vị</th>
                  <th className="align-middle text-center py-1">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {renderIngredientRows()}
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
                onClick={handleSave}
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
