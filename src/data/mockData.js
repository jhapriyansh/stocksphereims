// Users for login
export const users = [
  { username: "admin", password: "password", role: "admin" },
  { username: "staff", password: "password", role: "staff" },
];

// Inventory Data
export let inventory = [
  {
    sku: "LP-101",
    name: 'Laptop Pro 15"',
    quantity: 25,
    location: "Aisle 1",
    reorderPoint: 10,
    price: 1200,
  },
  {
    sku: "MS-202",
    name: "Wireless Mouse",
    quantity: 80,
    location: "Aisle 2",
    reorderPoint: 30,
    price: 25,
  },
  {
    sku: "KB-303",
    name: "Mechanical Keyboard",
    quantity: 40,
    location: "Aisle 2",
    reorderPoint: 15,
    price: 75,
  },
  {
    sku: "MN-404",
    name: '27" 4K Monitor',
    quantity: 15,
    location: "Aisle 1",
    reorderPoint: 5,
    price: 350,
  },
  {
    sku: "WC-505",
    name: "1080p Webcam",
    quantity: 5,
    location: "Aisle 3",
    reorderPoint: 10,
    price: 45,
  },
  {
    sku: "HP-606",
    name: "Noise-Cancelling Headphones",
    quantity: 50,
    location: "Aisle 3",
    reorderPoint: 20,
    price: 150,
  },
];

// Stocking Requests Data
export let stockRequests = [
  {
    id: 1,
    itemName: "1080p Webcam",
    sku: "WC-505",
    quantity: 20,
    status: "Pending",
    requestedBy: "staff",
  },
  {
    id: 2,
    itemName: '27" 4K Monitor',
    sku: "MN-404",
    quantity: 10,
    status: "Approved",
    requestedBy: "staff",
  },
  {
    id: 3,
    itemName: 'Laptop Pro 15"',
    sku: "LP-101",
    quantity: 5,
    status: "Declined",
    requestedBy: "staff",
  },
];

// Bills/Invoices Data
export let bills = [
  {
    id: "INV-2025-001",
    date: "2025-09-15",
    total: 1225,
    items: [
      { sku: "LP-101", name: 'Laptop Pro 15"', quantity: 1, price: 1200 },
      { sku: "MS-202", name: "Wireless Mouse", quantity: 1, price: 25 },
    ],
  },
  {
    id: "INV-2025-002",
    date: "2025-09-16",
    total: 270,
    items: [
      { sku: "KB-303", name: "Mechanical Keyboard", quantity: 2, price: 75 },
      {
        sku: "HP-606",
        name: "Noise-Cancelling Headphones",
        quantity: 1,
        price: 150,
      },
    ],
  },
];
