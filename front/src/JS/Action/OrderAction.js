import axios from "axios";
import {
  GET_ORDERS_REQUEST,
  GET_ORDERS_SUCCESS,
  GET_ORDERS_FAIL,
} from "../ActionType/ActionType";

export const getOrders = () => async (dispatch, getState) => {
  try {
    dispatch({ type: GET_ORDERS_REQUEST });
    const {
      admin: { adminInfo },
    } = getState();

    const { data } = await axios.get("/api/orders", {
      headers: { Authorization: `Bearer ${adminInfo.token}` },
    });
    dispatch({ type: GET_ORDERS_SUCCESS, payload: data });
  } catch (err) {
    dispatch({
      type: GET_ORDERS_FAIL,
      payload: err.response?.data?.error || err.message,
    });
  }
};
