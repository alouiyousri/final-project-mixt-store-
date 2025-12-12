// /redux/Action/basketAction.js
export const ADD_TO_BASKET = "ADD_TO_BASKET";
export const REMOVE_FROM_BASKET = "REMOVE_FROM_BASKET";
export const CLEAR_BASKET = "CLEAR_BASKET";
export const UPDATE_BASKET_QUANTITY = "UPDATE_BASKET_QUANTITY";

export const addToBasket = (product) => {
  return {
    type: ADD_TO_BASKET,
    payload: {
      productId: product.productId || product._id,
      name: product.name,
      price: product.price,
      quantity: product.quantity || 1,
      image: product.image || (product.images?.[0]?.url ?? null),
    },
  };
};

export const removeFromBasket = (productId) => {
  return {
    type: REMOVE_FROM_BASKET,
    payload: productId,
  };
};

export const updateBasketQuantity = (productId, quantity) => {
  return {
    type: UPDATE_BASKET_QUANTITY,
    payload: { productId, quantity },
  };
};

export const clearBasket = () => {
  return {
    type: CLEAR_BASKET,
  };
};
