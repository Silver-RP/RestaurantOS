import { useIngredientInput } from "@/hooks/useIngredientsAdminLogic";
import { IngredientInputTable } from "./IngredientInputTable";
import { DialogContent } from "@mui/material";


export function IngredientInputPanel({
  items,
  ingredientOptions,
  updateItem,
  deleteItem,
  addNewItem,
}: ReturnType<typeof useIngredientInput>) {
    return (
      <>
       <DialogContent className="overflow-x-auto" style={{ maxWidth: '100%', minWidth: '800px' }}>
            <IngredientInputTable
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

      </>
    );
  }
  