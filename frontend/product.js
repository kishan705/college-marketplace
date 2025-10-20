// This file manages loading products and creating new ones

document.addEventListener('DOMContentLoaded', () => {
    // Attach sell form handler if it exists on the page
    const sellForm = document.getElementById('sellForm');
    if (sellForm) {
        sellForm.onsubmit = handleSellForm;
    }

    // Load products on pages that have a productGrid
    const productGrid = document.getElementById('productGrid');
    if (productGrid) {
        loadAllProducts();
    }
});

/**
 * Loads products from the backend, with optional search query and category.
 * @param {string} query - The search text from the search bar.
 * @param {string} category - The category to filter by.
 */
async function loadAllProducts(query = '', category = '') {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = '<p>Loading products...</p>'; // Show loading message

    try {
        // Build the URL with query parameters
        let url = '/api/products?status=Available';
        if (query) {
            url += `&q=${encodeURIComponent(query)}`;
        }
        if (category) {
            url += `&category=${encodeURIComponent(category)}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        if (response.ok && data.products) {
            if (data.products.length === 0) {
                grid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center;">No products found. Try a different search!</p>';
                return;
            }

            // Link each card to the product.html page
            grid.innerHTML = data.products.map(product => `
                <a href="product.html?id=${product._id}" style="text-decoration: none; color: inherit;">
                    <div class="product-card">
                        <div class="product-image">
                            ${getCategoryIcon(product.category)}
                        </div>
                        <div class="product-info">
                            <div class="product-title">${product.title}</div>
                            <div class="product-price">₹${product.price.toLocaleString()}</div>
                            ${product.isNegotiable ? '<span class="negotiable">Negotiable</span>' : ''}
                            <div class="product-location">📍 ${product.college}</div>
                        </div>
                    </div>
                </a>
            `).join('');
        } else {
            throw new Error(data.error || 'Failed to load products');
        }
    } catch (error) {
        console.error('Error loading products:', error);
        grid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: red;">Could not load products.</p>';
    }
}


/**
 * Handles submission of the "Sell Item" modal form
 */
async function handleSellForm(e) {
    e.preventDefault();
    const token = getAuthToken();

    if (!token) {
        alert('You must be logged in to sell an item.');
        openModal('loginModal');
        return;
    }

    const form = e.target;
    const formData = new FormData(form);
    
    // The backend now handles geocoding the college name.
    // We just need to send the form data as a plain object.
    const productData = {
        title: formData.get('title'),
        category: formData.get('category'),
        description: formData.get('description'),
        price: parseFloat(formData.get('price')),
        isNegotiable: formData.get('isNegotiable') === 'on',
        college: formData.get('college'),
        condition: formData.get('condition')
        // The 'location' object is no longer sent from the client.
    };

    try {
        const response = await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(productData)
        });

        const data = await response.json();

        if (response.ok) {
            alert('Product listed successfully!');
            closeModal('sellModal');
            form.reset();
            if (document.getElementById('productGrid')) {
                loadAllProducts(); // Refresh the product list on the current page
            }
        } else {
            alert(`Error: ${data.error || data.message}`);
        }
    } catch (error) {
        console.error('Error listing product:', error);
        alert('An error occurred while listing your product.');
    }
}


/**
 * Returns an emoji icon based on the product category.
 * @param {string} category - The product category.
 * @returns {string} - An emoji.
 */
function getCategoryIcon(category) {
    switch (category) {
        case 'Laptop': return '💻';
        case 'Books': return '📚';
        case 'Bike': return '🚲';
        case 'Electronics': return '📱';
        case 'Stationery': return '✏️';
        case 'Furniture': return '🪑';
        case 'Clothing': return '👕';
        case 'Sports': return '⚽';
        default: return '📦';
    }
}

