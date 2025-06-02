document.addEventListener('DOMContentLoaded', () => {
    const cartBody = document.getElementById('cart-body');
    const taxRateInput = document.getElementById('taxRate');
    const shippingThresholdInput = document.getElementById('shippingThreshold');
    const subtotalEl = document.getElementById('subtotal');
    const taxEl = document.getElementById('tax');
    const shippingEl = document.getElementById('shipping');
    const grandTotalEl = document.getElementById('grand-total');
    const clearCartBtn = document.getElementById('clearCart');
  
    let currentCart = [...cart]; // Clone the cart from data.js
  
    const calculateTotal = (quantity, price) => quantity * price;
  
    const updateTotals = () => {
      let subtotal = 0;
      currentCart.forEach(item => {
        subtotal += item.quantity * item.product.price;
      });
  
      const taxRate = parseFloat(taxRateInput.value) / 100 || 0;
      const threshold = parseFloat(shippingThresholdInput.value) || 0;
      const tax = subtotal * taxRate;
      const shipping = subtotal < threshold ? 40 : 0;
      const grandTotal = subtotal + tax + shipping;
  
      subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
      taxEl.textContent = `$${tax.toFixed(2)}`;
      shippingEl.textContent = `$${shipping.toFixed(2)}`;
      grandTotalEl.textContent = `$${grandTotal.toFixed(2)}`;
    };
  
    const outputCartRow = (item, index) => {
      const row = document.createElement('tr');
  
      // Product cell
      const productCell = document.createElement('td');
      productCell.classList.add('product-cell'); // ADD THIS for styling

      const img = document.createElement('img');
      img.src = `Images/${item.product.filename}`;
      img.alt = item.product.title;
      img.classList.add('product-img');

      const titleSpan = document.createElement('span');
      titleSpan.textContent = item.product.title;
      titleSpan.classList.add('product-title');

      productCell.appendChild(img);
      productCell.appendChild(titleSpan);
  
      // Quantity cell
      const quantityCell = document.createElement('td');
      quantityCell.textContent = item.quantity;
  
      // Price cell
      const priceCell = document.createElement('td');
      priceCell.textContent = `$${item.product.price.toFixed(2)}`;
  
      // Total cell
      const totalCell = document.createElement('td');
      const total = calculateTotal(item.quantity, item.product.price);
      totalCell.textContent = `$${total.toFixed(2)}`;
  
      // Actions cell
      const actionCell = document.createElement('td');
      const removeBtn = document.createElement('button');
      removeBtn.textContent = 'Remove';
      removeBtn.addEventListener('click', () => {
        currentCart.splice(index, 1);
        renderCart();
      });
      actionCell.appendChild(removeBtn);
  
      // Append all cells
      row.appendChild(productCell);
      row.appendChild(quantityCell);
      row.appendChild(priceCell);
      row.appendChild(totalCell);
      row.appendChild(actionCell);
  
      cartBody.appendChild(row);
    };
  
    const renderCart = () => {
      cartBody.innerHTML = '';
      currentCart.forEach((item, index) => outputCartRow(item, index));
      updateTotals();
    };
  
    // Event listeners
    taxRateInput.addEventListener('input', updateTotals);
    shippingThresholdInput.addEventListener('input', updateTotals);
  
    clearCartBtn.addEventListener('click', () => {
      currentCart = [];
      renderCart();
    });
  
    renderCart();
  });