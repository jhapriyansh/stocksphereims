// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
};

// Format date
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Calculate total from bill items
export const calculateTotal = (items) => {
  return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
};

// Check if product is low in stock
export const isLowStock = (product) => {
  return product.quantity <= product.minStockLevel;
};
