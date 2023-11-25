document.addEventListener('DOMContentLoaded', async () => {
    let productsGiven = [];
    const urlParameters = new URLSearchParams(window.location.search);
    const productId = urlParameters.get('id');
    const productDetailsElement = document.getElementById('details-of-products');

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

    const displayProductDetails = (product) => {
        const productDetailsHTML = `
            <div class="container">
                <div class="details-of-products">
                    <h1>${product.title}</h1>
                    <img src="${product.thumbnail}" alt="${product.title}">
                    <p>Description: ${product.description}</p>
                    <p id="price">Price: $${product.price}</p>
                    <p id="discount">Discount: ${product.discountPercentage}% off</p>
                    <p>Rating: ${product.rating}</p>
                    <p>Stock: ${product.stock}</p>
                    <p>Brand: ${product.brand}</p>
                    <p>Category: ${product.category}</p>
                    <hr>
                    <p id="gallery_word">Gallery</p>
                    <div id="images-of-products"></div>
                    <button class="button" onclick="goBack()">Back to Home Page</button>
                </div>
            </div>
        `;

        productDetailsElement.innerHTML = productDetailsHTML;

        const productImagesElement = document.getElementById('images-of-products');
        product.images.forEach(image => {
            const imageElement = document.createElement('img');
            imageElement.src = image;
            imageElement.alt = product.title;
            imageElement.style.width = '30%';
            productImagesElement.appendChild(imageElement);
        });
    };

    try {
        productsGiven = await fetchData();
        if (productsGiven.length > 0) {
            displayProductDetails(productsGiven[productId - 1]);
        } else {
            productDetailsElement.innerHTML = 'No product data available!';
        }
    } catch (error) {
        productDetailsElement.innerHTML = 'Fetching data error!';
    }
});

function goBack() {
    window.history.back();
}
