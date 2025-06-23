import CartItem from './CartItem.js';

const showToast = (message) => {
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.position = 'fixed';
  toast.style.bottom = '20px';
  toast.style.right = '20px';
  toast.style.background = '#333';
  toast.style.color = '#fff';
  toast.style.padding = '10px 20px';
  toast.style.borderRadius = '5px';
  toast.style.opacity = '0.9';
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
};

document.addEventListener('DOMContentLoaded', async () => {
  const cartBody = document.getElementById('cart-body');
  const taxRateInput = document.getElementById('taxRate');
  const shippingThresholdInput = document.getElementById('shippingThreshold');
  const subtotalEl = document.getElementById('subtotal');
  const taxEl = document.getElementById('tax');
  const shippingEl = document.getElementById('shipping');
  const grandTotalEl = document.getElementById('grand-total');
  const clearCartBtn = document.getElementById('clearCart');
  const filterInput = document.getElementById('filterInput');

  let currentCart = [];
  let originalCart = [];

  try {
    const response = await fetch('cart-data.json');
    const data = await response.json();
    originalCart = data.map(item => new CartItem(item.product, item.quantity));
    currentCart = [...originalCart];
  } catch (error) {
    console.error('Failed to load cart data:', error);
    showToast('Failed to load cart data');
  }

  const updateTotals = () => {
    let subtotal = 0;
    currentCart.forEach(item => {
      subtotal += item.getTotal();
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

    const productCell = document.createElement('td');
    const img = document.createElement('img');
    img.src = `Images/${item.product.filename}`;
    img.alt = item.product.title;
    img.classList.add('product-img');
    const titleSpan = document.createElement('span');
    titleSpan.textContent = item.product.title;
    productCell.appendChild(img);
    productCell.appendChild(titleSpan);

    const quantityCell = document.createElement('td');
    quantityCell.textContent = item.quantity;

    const priceCell = document.createElement('td');
    priceCell.textContent = `$${item.product.price.toFixed(2)}`;

    const totalCell = document.createElement('td');
    totalCell.textContent = `$${item.getTotal().toFixed(2)}`;

    const actionCell = document.createElement('td');
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.addEventListener('click', () => {
      currentCart.splice(index, 1);
      renderCart();
      showToast('Item removed from cart');
    });
    actionCell.appendChild(removeBtn);

    row.appendChild(productCell);
    row.appendChild(quantityCell);
    row.appendChild(priceCell);
    row.appendChild(totalCell);
    row.appendChild(actionCell);
    cartBody.appendChild(row);
  };

  const renderCart = () => {
    cartBody.innerHTML = '';

    if (currentCart.length === 0) {
      const row = document.createElement('tr');
      const cell = document.createElement('td');
      cell.colSpan = 5;
      cell.textContent = 'Your cart is empty';
      cell.style.textAlign = 'center';
      row.appendChild(cell);
      cartBody.appendChild(row);

      subtotalEl.textContent = '$0.00';
      taxEl.textContent = '$0.00';
      shippingEl.textContent = '$0.00';
      grandTotalEl.textContent = '$0.00';
      return;
    }

    currentCart.forEach((item, index) => outputCartRow(item, index));
    updateTotals();
  };

  filterInput.addEventListener('input', () => {
    const keyword = filterInput.value.trim().toLowerCase();
    currentCart = originalCart.filter(item =>
      item.product.title.toLowerCase().includes(keyword)
    );
    renderCart();
  });

  taxRateInput.addEventListener('input', updateTotals);
  shippingThresholdInput.addEventListener('input', updateTotals);
  clearCartBtn.addEventListener('click', () => {
    currentCart = [];
    renderCart();
  });

  renderCart();
});
