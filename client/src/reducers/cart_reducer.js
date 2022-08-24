import {
  ADD_TO_CART,
  CLEAR_CART,
  COUNT_CART_TOTALS,
  REMOVE_CART_ITEM,
  TOGGLE_CART_ITEM_AMOUNT,
} from '../actions';

const cart_reducer = (state, action) => {
  if (action.type === ADD_TO_CART) {
    const { id, count, color, product } = action.payload;
    const { name, price, stock, images } = product;
    const image = images[0].url;
    let tempItem = state.cart.find((i) => i.id === id && i.color === color);

    if (tempItem) {
      const tempCart = state.cart.map((item) => {
        if (item === tempItem) {
          let newCount = item.count + count;
          if (newCount > stock) {
            newCount = stock;
          }
          return { ...item, count: newCount };
        }
        return item;
      });
      return {
        ...state,
        cart: tempCart,
      };
    } else {
      return {
        ...state,
        cart: [...state.cart, { count, color, id, image, stock, name, price }],
      };
    }
  }
  if (action.type === REMOVE_CART_ITEM) {
    return {
      ...state,
      cart: [...state.cart].filter((item) => item.id !== action.payload),
    };
  }
  if (action.type === CLEAR_CART) {
    return {
      ...state,
      cart: [],
    };
  }
  if (action.type === TOGGLE_CART_ITEM_AMOUNT) {
    const { id, value } = action.payload;
    let tempItem = [...state.cart].find((item) => item.id === id);
    let tempCart = [...state.cart].flatMap((item) => {
      if (item === tempItem) {
        const { stock } = item;
        if (value === 'inc') {
          if (item.count >= stock) {
            return { ...item, count: stock };
          }
          return { ...item, count: (item.count += 1) };
        }
        if (value === 'dec') {
          if (item.count <= 1) {
            return [];
          }
          return { ...item, count: (item.count -= 1) };
        }
      }
      return item;
    });
    return {
      ...state,
      cart: tempCart,
    };
  }
  if (action.type === COUNT_CART_TOTALS) {
    const { total_amount, total_items } = state.cart.reduce(
      (total, item) => {
        const { count, price } = item;
        total.total_amount += count * price;
        total.total_items += count;
        return total;
      },
      { total_items: 0, total_amount: 0 }
    );
    return {
      ...state,
      total_amount,
      total_items,
    };
  }
  throw new Error(`No Matching "${action.type}" - action type`);
};

export default cart_reducer;
