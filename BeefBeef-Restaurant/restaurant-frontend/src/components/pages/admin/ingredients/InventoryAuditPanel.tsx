import { DialogContent } from '@mui/material';
import { InventoryAuditTable } from './InventoryAuditTable';
import { useInventoryAuditInput } from "@/hooks/useIngredientsAdminLogic";


export function InventoryAuditPanel({
  items,
  ingredientOptions,
  updateItem,
  deleteItem,
  addNewItem,
}: ReturnType<typeof useInventoryAuditInput>) {

    
  return (
    <DialogContent className="overflow-x-auto" style={{ minWidth: '1000px' }}>
      <InventoryAuditTable
        items={items}
        ingredientOptions={ingredientOptions}
        onChange={updateItem}
        onDelete={deleteItem}
      />

      <div className="text-center py-4">
        <button
          className="px-2 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          onClick={addNewItem}
        >
          + Thêm
        </button>
      </div>
    </DialogContent>
  );
}
