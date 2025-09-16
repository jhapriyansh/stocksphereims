import React from "react";

const InvoiceModal = ({ isOpen, onClose, invoice }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Invoice #{invoice.id}</h2>
          <button onClick={onClose} className="close-button">
            &times;
          </button>
        </div>
        <div className="modal-body">
          <p>
            <strong>Date:</strong> {invoice.date}
          </p>
          <hr />
          <h4>Items:</h4>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item) => (
                <tr key={item.sku}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>${(item.quantity * item.price).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h3 style={{ textAlign: "right", marginTop: "20px" }}>
            Total: ${invoice.total.toFixed(2)}
          </h3>
        </div>
        <div
          className="modal-footer"
          style={{ textAlign: "right", marginTop: "20px" }}
        >
          <button onClick={handlePrint} style={{ marginRight: "10px" }}>
            Print
          </button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
