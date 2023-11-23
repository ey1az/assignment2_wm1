document.addEventListener('DOMContentLoaded', initializePage);

let productsGiven = [];
let currentPage = 1;
const itemsPerPage = 10;

const productListElement = document.getElementById('list-of-products');
const paginationElement = document.getElementById('pagination');

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

async function fetchData() {
    try {
        const response = await fetch('https://dummyjson.com/products?limit=100');
        if (!response.ok) {
            throw new Error('Problems with the network response!');
        }
        const data = await response.json();
        return data.products;
    } catch (error) {
        console.error('Fetching data error:', error.message);
        throw error;
    }
}

function displayProductList(filteredProducts) {
    const totalProducts = filteredProducts.length;
    const totalPages = Math.ceil(totalProducts / itemsPerPage);

    const begin = (page - 1) * itemsPerPage;
    const end = begin + itemsPerPage;

    const paginProducts = filteredProducts.slice(begin, end);
    
    productListElement.innerHTML = '';
    paginProducts.forEach(product => {
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
    displayPagination(totalPages);
}

function displayPagination(totalPages) {
    paginationElement.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.classList.add('pagination-button');
        button.addEventListener('click', () => displayProductList(i));
    }
}
