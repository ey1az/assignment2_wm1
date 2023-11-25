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

})