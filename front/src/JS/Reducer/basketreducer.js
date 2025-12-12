// /redux/reducers/basketReducer.js
import {
  ADD_TO_BASKET,
  REMOVE_FROM_BASKET,
  CLEAR_BASKET,
  UPDATE_BASKET_QUANTITY,
} from "../Action/basketAction";

const initialState = {
  items: [],
};

const basketReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_BASKET:
      const exists = state.items.find(
        (item) => item.productId === action.payload.productId
      );

      if (exists) {
        return {
          ...state,
          items: state.items.map((item) => {
            if (item.productId === action.payload.productId) {
              const newQuantity = item.quantity + action.payload.quantity;
              const maxStock = item.stock || action.payload.stock || 0;

              // Don't exceed stock
              if (newQuantity > maxStock) {
                return item; // Keep current quantity if it would exceed stock
              }

              return { ...item, quantity: newQuantity };
            }
            return item;
          }),
        };
      }

      // For new items, ensure quantity doesn't exceed stock
      const requestedQuantity = action.payload.quantity;
      const availableStock = action.payload.stock || 0;
      const finalQuantity = Math.min(requestedQuantity, availableStock);

      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: finalQuantity }],
      };

    case REMOVE_FROM_BASKET:
      return {
        ...state,
        items: state.items.filter((item) => item.productId !== action.payload),
      };

    case UPDATE_BASKET_QUANTITY:
      return {
        ...state,
        items: state.items.map((item) => {
          if (item.productId === action.payload.productId) {
            const maxStock = item.stock || 0;
            const newQuantity = Math.max(1, Math.min(action.payload.quantity, maxStock));

            return { ...item, quantity: newQuantity };
          }
          return item;
        }),
      };

    case CLEAR_BASKET:
      return {
        ...state,
        items: [],
      };

    default:
      return state;
  }
};

export default basketReducer;
