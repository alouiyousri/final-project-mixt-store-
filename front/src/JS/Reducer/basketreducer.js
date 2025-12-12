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
          items: state.items.map((item) =>
            item.productId === action.payload.productId
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      }

      return {
        ...state,
        items: [...state.items, action.payload], // already has quantity, image, etc.
      };

    case REMOVE_FROM_BASKET:
      return {
        ...state,
        items: state.items.filter((item) => item.productId !== action.payload),
      };

    case UPDATE_BASKET_QUANTITY:
      return {
        ...state,
        items: state.items.map((item) =>
          item.productId === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
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
