const PROMO_CODE = "SAVE10";
const PROMO_MIN_SUBTOTAL = 20000;
const PROMO_RATE = 0.1;
const FREE_DELIVERY_FROM = 50000;
const DELIVERY_PRICE = 30000;

function validateQuantity(quantity, stock) {
  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new RangeError("Количество должно быть целым положительным числом.");
  }
  if (quantity > stock) {
    throw new RangeError("Нельзя указать больше товара, чем есть на складе.");
  }
}

function addToCart(cart, product, quantity = 1) {
  const existingItem = cart.find((item) => item.id === product.id);
  const newQuantity = existingItem
    ? existingItem.quantity + quantity
    : quantity;

  validateQuantity(quantity, product.stock);
  validateQuantity(newQuantity, product.stock);

  if (!existingItem) return [...cart, { ...product, quantity }];

  return cart.map((item) =>
    item.id === product.id ? { ...item, quantity: newQuantity } : item,
  );
}

function changeQuantity(cart, productId, quantity) {
  const existingItem = cart.find((item) => item.id === productId);
  if (!existingItem) return [...cart];

  validateQuantity(quantity, existingItem.stock);

  return cart.map((item) =>
    item.id === productId ? { ...item, quantity } : item,
  );
}

function removeFromCart(cart, productId) {
  return cart.filter((item) => item.id !== productId);
}

function calculateCartSubtotal(cart) {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function calculateOrderTotal(cart, promoCode = "") {
  const subtotal = calculateCartSubtotal(cart);
  const isPromoApplied =
    promoCode === PROMO_CODE && subtotal >= PROMO_MIN_SUBTOTAL;
  const discount = isPromoApplied ? Math.round(subtotal * PROMO_RATE) : 0;
  const delivery = subtotal < FREE_DELIVERY_FROM ? DELIVERY_PRICE : 0;
  const total = subtotal - discount + delivery;

  return { subtotal, discount, delivery, total };
}

const cartApi = {
  addToCart,
  changeQuantity,
  removeFromCart,
  calculateCartSubtotal,
  calculateOrderTotal,
};

if (typeof module !== "undefined") module.exports = cartApi;
if (typeof window !== "undefined") window.cartApi = cartApi;
