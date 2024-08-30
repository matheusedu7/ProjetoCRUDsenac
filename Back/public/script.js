const productList = document.getElementById('product-list');
const addProductButton = document.getElementById('add-product');

async function fetchProducts() {
    const response = await fetch('http://localhost:3000/products');
    const products = await response.json();
    displayProducts(products);
}

function displayProducts(products) {
    productList.innerHTML = '';
    products.forEach(product => {
        const li = document.createElement('li');
        li.textContent = `${product.name} - R$ ${product.price} - ${product.description}`;
        productList.appendChild(li);

    
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remover';
        removeButton.className = 'remove-button';
        removeButton.addEventListener('click', () => removeProduct(product._id));
        li.appendChild(removeButton);
        productList.appendChild(li);
    });
}



async function addProduct() {
    const name = document.getElementById('product-name').value;
    const price = document.getElementById('product-price').value.replace(',', '.'); // Trocar a vírgula pelo ponto
    const description = document.getElementById('product-description').value;

  
    if (isNaN(price) || price <= 0) {
        alert('Por favor, insira um preço válido.');
        return;
    }

    const response = await fetch('http://localhost:3000/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: name,
            price: parseFloat(price), // Converter para float
            description: description,
        }),
    });

    if (response.ok) {
        fetchProducts(); 
        document.getElementById('product-name').value = '';
        document.getElementById('product-price').value = '';
        document.getElementById('product-description').value = '';
    } else {
        alert('Erro ao adicionar produto');
    }
}

async function removeProduct(productId) {
    const response = await fetch(`http://localhost:3000/products/${productId}`, {
        method: 'DELETE',
    });

    if (response.ok) {
        fetchProducts();
    } else {
        alert('Erro ao remover produto');
    }
}

addProductButton.addEventListener('click', addProduct);

fetchProducts();
