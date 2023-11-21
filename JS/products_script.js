document.addEventListener('DOMContentLoaded', initializePage);

let productsGiven = [];

const productListElement = document.getElementById('list-of-products');

function initializePage() {
    fetchData()
        .then(data => {
            productsGiven = data;
            displayProductList(productsGiven);
        })
        .catch(error => {
            productListElement.innerHTML = 'Fetching data error!';
        });

    document.addEventListener('click', (event) => {
        const target = event.target;
        if (target.classList.contains('card-button')) {
            const productId = target.getAttribute('data-product-id');
            showProductDetails(productId);
        }
    });
}

function fetchData() {
    return fetch('https://dummyjson.com/products?limit=100')
        .then(response => {
            if (!response.ok) {
                throw new Error('Problems with the network response!');
            }
            return response.json();
        })
        .then(data => data.products)
        .catch(error => {
            console.error('Fetching data error:', error.message);
            throw error;
        });
}

function displayProductList(filteredProducts) {
    productListElement.innerHTML = '';
    filteredProducts.forEach(product => {
        const prodHTML = `
            <div class="card">
                <h1 class="title">${product.title}</h1>
                <p class="price">$${product.price.toFixed(2)}</p>
                <p class="discount">${product.discountPercentage}% off</p>
                <p class="category">${product.category}</p>
                <p class="stock">Stock: ${product.stock}</p>
                <img src="${product.thumbnail}" alt="${product.title}" style="width: 100%;">
                <button class="card-button" data-product-id="${product.id}">More Details</button>
            </div>
        `;

        productListElement.innerHTML += prodHTML;
    });
}

