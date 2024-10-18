
// header

const nav = document.querySelector('.nav');
const navActive = document.querySelector('.active-nav');
const removenav = document.querySelector('.delate-nav-bar')

navActive.onclick = () => (
    nav.classList.toggle('active')
);
removenav.onclick = () => (
    nav.classList.remove('active')
);


const headerCartbox = document.querySelector('.header-cart-active');
const headerCart = document.querySelector('.header-cart-box');
const headerCartboxRemove = document.querySelector('.remove-cart');

headerCartbox.onclick = () => {
    headerCart.classList.toggle('active');
}
headerCartboxRemove.onclick = () => {
    headerCart.classList.remove('active');
}

window.onscroll = () => {
    nav.classList.remove('active')
}

// product
const inputValues = document.querySelectorAll('.input-number');
const minusButtons = document.querySelectorAll('.minus');
const plusButtons = document.querySelectorAll('.plus');

plusButtons.forEach((plusButton, index) => {
    plusButton.addEventListener('click', () => {
        inputValues[index].value = parseInt(inputValues[index].value) + 1;
    });
});
minusButtons.forEach((minusButton, index) => {
    minusButton.addEventListener('click', () => {
        inputValues[index].value = parseInt(inputValues[index].value) - 1;
    });
});

const buttons = document.querySelectorAll('.cart-btn'); 
const inputValuess = document.querySelectorAll('.input-number'); 
buttons.forEach((button, index) => {
    button.addEventListener('click', function() {
        console.log(inputValuess[index].value); 
    });
});


// cart
// Load cart data from localStorage or initialize an empty cart
let cart = JSON.parse(localStorage.getItem('cart')) || [];
const cartBox = document.querySelector('.cart-box');
let totalPrice = localStorage.getItem('totalPrice') ? parseFloat(localStorage.getItem('totalPrice')) : 0;

if (isNaN(totalPrice)) {
    totalPrice = 0;
}

// Add event listeners to all add-to-cart buttons
document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        e.target.style.background = 'red';
        const product = e.target.closest('.p-box');
        const productimg = product.querySelector('img').src;
        const productName = product.querySelector('.product-name').innerText;
        const productQuantity = parseInt(product.querySelector('.input-number').value, 10);
        const productPrice = parseFloat(product.querySelector('.price').innerText);

        addProductToCart(productimg, productName, productQuantity, productPrice);
    });
});

// Function to handle adding products to the cart
function addProductToCart(productimg, productName, productQuantity, productPrice) {
    const existingItemIndex = cart.findIndex(item => item.productName === productName);

    if (existingItemIndex > -1) {
        const existingItem = cart[existingItemIndex];
        existingItem.quantity += productQuantity;
        existingItem.totalPrice = existingItem.quantity * existingItem.productPrice;
        totalPrice += productQuantity * existingItem.productPrice;
    } else {
        
        cart.push({
            productimg,
            productName,
            productPrice,
            quantity: productQuantity,
            totalPrice: productQuantity * productPrice
        });
        totalPrice += productQuantity * productPrice;
    }

    
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('totalPrice', totalPrice.toFixed(2));

    createCartItem();
    totalpriceprent()
}

// Function to create and display cart items
function createCartItem() {
    cartBox.innerHTML = ''; 

    if(cart.length === 0){
        cartBox.innerHTML = '<p>Your cart is empty</p>';
    }else{
        cart.forEach((item, index) => {
            const createDiv = document.createElement('div');
            createDiv.classList.add('box');
            createDiv.innerHTML = `
                <img src="${item.productimg}" alt="">
                <div class="title-box">
                    <p>${item.productName}</p>
                    <div class="price"> <span>${item.productPrice}</span> x <span>${item.quantity}</span></div>
                </div>
                <p class="total-price">$${item.totalPrice.toFixed(2)}</p>
                <i class="fa-solid fa-xmark remove-item" data-index="${index}"></i>
            `;
            cartBox.appendChild(createDiv);
            
        });

        // Add event listeners to the delete buttons to remove items from the cart
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                removeFromCart(index);
            });
        });
    }
        
    
}

// Function to remove an item from the cart
function removeFromCart(index) {
    const removedItem = cart.splice(index, 1);
    totalPrice = cart.reduce((acc, item) => acc + item.totalPrice, 0);
    saveCartToLocalStorage();
    createCartItem();
    totalpriceprent()


    const buttonToReset = document.querySelector(`.add-to-cart-btn[data-product-name="${removedItem.productName}"]`);
    if (buttonToReset) {
        buttonToReset.style.background = '';
        buttonToReset.removeAttribute('data-product-name'); 
    }
}
// Function to save the cart to localStorage
function saveCartToLocalStorage() {

    
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('totalPrice', totalPrice.toFixed(2));

    //totalpriceprent()
}

function totalpriceprent() {
    const printPrice = document.querySelector('.price-all');
    printPrice.innerHTML = `$${totalPrice.toFixed(2)}`


    const crtlangth = document.querySelector('.cartblu');
    crtlangth.innerHTML = `${cart.length}`
}
// Initialize the cart display on page load
createCartItem();
totalpriceprent()


