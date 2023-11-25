document.addEventListener('DOMContentLoaded', initializePage);

let productsGiven = [];
let currentPage = 1;
const itemsPerPage = 10;

const productListElement = document.getElementById('list-of-products');
const paginationElement = document.getElementById('pagination');
const searchInput = document.getElementById('search-input');
const categorySelect = document.getElementById('category-select');

function initializePage() {
    fetchData()
        .then(data => {
            productsGiven = data;
            updateCategoryOptions();
            displayProductList(1, productsGiven);
        })
        .catch(error => {
            productListElement.innerHTML = 'Fetching data error!';
        });

    searchInput.addEventListener('input', searchHandler);
    categorySelect.addEventListener('change', categoryHandler);

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

function displayProductList(page, filteredProducts) {
    const totalProducts = filteredProducts.length;
    const totalPages = Math.ceil(totalProducts / itemsPerPage);
    currentPage = page;

    const begin = (page - 1) * itemsPerPage;
    const end = begin + itemsPerPage;

    const paginProducts = filteredProducts.slice(begin, end);

    productListElement.innerHTML = '';
    paginProducts.forEach(product => {
        const prodHTML = `
            <div class="card">
                <h1 class="title">${product.title}</h1>
                <p class="price">$${product.price}</p>
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
        button.textContent = i;
        button.classList.add('pagination-button');
        button.addEventListener('click', () => displayProductList(i, getFilteredProducts()));
        if (i === currentPage) {
            button.classList.add('active');
        }
        paginationElement.appendChild(button);
    }
}

function getFilteredProducts() {
    const searchForProduct = searchInput.value.trim().toLowerCase();
    const selectedCategory = categorySelect.value.toLowerCase();

    return productsGiven.filter(product => {
        const matchTitle = product.title.toLowerCase().includes(searchForProduct);
        const matchDescription = product.description.toLowerCase().includes(searchForProduct);
        const matchCategory = selectedCategory === 'all' || product.category.toLowerCase() === selectedCategory;

        return (matchTitle || matchDescription) && matchCategory;
    });
}

function searchHandler() {
    displayProductList(1, getFilteredProducts());
}

function categoryHandler() {
    displayProductList(1, getFilteredProducts());
}

function updateCategoryOptions() {
    const categories = Array.from(new Set(productsGiven.map(product => product.category)));

    categorySelect.innerHTML = '';
    const categoriesOptionAll = document.createElement('option');
    categoriesOptionAll.value = 'all';
    categoriesOptionAll.textContent = 'All Categories';
    categorySelect.appendChild(categoriesOptionAll);

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.toLowerCase();
        option.textContent = category;
        categorySelect.appendChild(option);
    });
}

function showProductDetails(productId) {
    window.location.href = `products_details.html?id=${productId}`;
}
