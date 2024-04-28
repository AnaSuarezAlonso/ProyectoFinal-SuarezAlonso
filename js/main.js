"use strict"

let stock = []

fetch('./js/products.json')
  .then(response => response.json())
  .then(data => {
    stock = data
    printProducts(stock)
  })

let cart = JSON.parse(localStorage.getItem('cart')) || []


// We print the products in the Products Gallery
let productGrid = document.getElementById('productGrid')

function printProducts(stock) {
  stock.forEach((product)=>{
    let productItem = document.createElement('li')
    productItem.innerHTML = ` 
      <div class="figure">
        <img src="./images/${product.image}.png" alt="${product.productName}">
        <div class="overlay"><button id='addToCartButton' class="btnPrincipal">Añadir al carrito</button></div>
      </div>
      <h2>${product.productName}</h2>
      <span>${product.price}€</span>`
    productGrid.appendChild(productItem)
    
    productItem.getElementsByTagName('button')[0].addEventListener('click', (e)=> {
      let button = e.currentTarget
      button.innerText = 'Añadido'
      setTimeout(()=>{
        button.innerText = 'Añadir al carrito'
      },1000)
      addToCart(product)
    })
  })
}


//Add to cart
function addToCart(product){
  //Check if the product already exists in the cart
  let exists = cart.some((el)=> {
    return el.product.productName === product.productName
  })

  if (exists) {
    let index = cart.findIndex((el)=>{
      return el.product.productName === product.productName
    })
    cart[index].units ++
  } else {
    cart.push(new Item(product, 1))
  }
  printCart(cart)
}


//Rest from cart
function restFromCart(product){
  let index = cart.findIndex((el)=>{
    return el.product.productName === product.productName
  })
  if(cart[index].units > 1){
    cart[index].units --
  } else {
    cart.splice(index, 1)
    bubbleValue.innerText = 0
  }
  if(cart.length === 0) {
    localStorage.clear()
  }

  Toastify({
    text: "El producto fue eliminado",
    duration: 2000,
    close: true,
    gravity: "top",
    position: "right",
    stopOnFocus: true,
    style: {
      background: "#000000",
      borderRadius: "0.25rem",
      fontSize: "0.9rem",
      display: "flex",
      gap: "0.75rem",
      padding: "1rem 1.5rem"
    },
    onClick: function(){} // Callback after click
  }).showToast();

  printCart(cart)
}


//Delete from cart
function deleteFromCart(product){
  let index = cart.findIndex((el)=>{
    return el.product.productName === product.productName
  })
  cart.splice(index, 1)
  bubbleValue.innerText = 0
  printCart(cart)
  if(cart.length === 0) {
    localStorage.clear()
  }

  Toastify({
    text: "El producto fue eliminado",
    duration: 2000,
    close: true,
    gravity: "top",
    position: "right",
    stopOnFocus: true,
    style: {
      background: "#000000",
      borderRadius: "0.25rem",
      fontSize: "0.9rem",
      display: "flex",
      gap: "0.75rem",
      padding: "1rem 1.5rem"
    },
    onClick: function(){} // Callback after click
  }).showToast();
  
}


//Empty cart
let emptyCartButton = document.getElementById('emptyCartButton')
emptyCartButton.onclick = () => {emptyCart()}

function emptyCart(){
  cart = []
  bubbleValue.innerText = 0
  localStorage.clear()
  printCart(cart)
}

//Purchase
const purchaseButton = document.querySelector('#purchaseButton')

function purchaseOrder(){
  if(cart.length > 0) {
    showCartToggle()
    showPurchaseOrder(cart)
  }
}
purchaseButton.addEventListener('click', purchaseOrder)


//Cart printing
let cartList = document.getElementById('cartList')
let totalValue = document.getElementById('total')
let totalProductsValue = document.getElementById('totalProducts')
let bubbleValue = document.getElementById('bubble')
let cartToObject = JSON.parse(localStorage.getItem('cart'))
let cartFooter = document.getElementById('cartFooter')
bubbleValue.innerText = 0

function printCart(cart){
  cartList.innerHTML = ''
  if(cart.length === 0){
    let emptyState = document.createElement('div')
    emptyState.className = 'emptyState'
    emptyState.innerHTML = `
      <img src="./images/emptycart.png"></img>
      <span>El carrito está vacío</span>`
    cartList.appendChild(emptyState)
    totalValue.innerText = 0 + '€'
    totalProductsValue.innerText = '(' + 0 + ')'
    cartFooter.style.display = 'none'
  } else {
    cartFooter.style.display = 'flex'
    cart.forEach((item) => {
      let Item = document.createElement('li')
      Item.innerHTML = `
        <div class="figure">
          <img src="./images/${item.product.image}.png" alt="Product image">
        </div>
        <div id="information">
          <div id="content">
            <h2>${item.product.productName}</h2>
            <span>${item.units * item.product.price}€</span>
          </div>
          <div id="actions">
            <div id="counter">
              <button>-</button>
              <span>${item.units}</span>
              <button>+</button>        
            </div>
            <button id="delete">Delete</button>
          </div>
        </div>
      `
      cartList.appendChild(Item)
      Item.getElementsByTagName('button')[0].addEventListener('click', ()=> {restFromCart(item.product)})
      Item.getElementsByTagName('button')[1].addEventListener('click', ()=> {addToCart(item.product)})
      Item.getElementsByTagName('button')[2].addEventListener('click', ()=> {deleteFromCart(item.product)})
            
      //Calculate total price
        let total = cart.reduce((acum,el)=>{
          return acum + el.units * el.product.price
        }, 0)
        totalValue.innerText = total + '€'  
        
      //Calculate total products in cart
        let totalProducts = cart.reduce((acum,el)=>{
          return acum + el.units
        }, 0)
        totalProductsValue.innerText = '(' + totalProducts + ')'
        bubbleValue.innerText = totalProducts

        //Local Storage
        let cartJSON = JSON.stringify(cart)
        localStorage.setItem('cart', cartJSON)
    })
    
  }
}

printCart(cart)


//Show purchase order
let ordersList = document.querySelector('#ordersList')
let orderConfirmation = document.querySelector('#orderConfirmation')

function showPurchaseOrder(cart){
  orderConfirmation.classList.replace('hidden', 'shown')
  ordersList.innerHTML = ''
  cart.forEach((item) => {
    let orderItem = document.createElement('li')
    orderItem.className = 'orderItem'
    orderItem.innerHTML = `
      <div class="figure">
        <img src="./images/${item.product.image}.png" alt="Product image">
      </div>
      <div id="information">
        <div id="content">
          <h4>${item.product.productName}</h4>
          <span class="units">Unidades: ${item.units}</span>
        </div>
         <span>${item.units * item.product.price}€</span>
      </div>`
    ordersList.appendChild(orderItem)
    let totalProducts = cart.reduce((acum,el)=>{
      return acum + el.units * el.product.price
    }, 0)
    let ordersTotalValue = document.getElementById('totalOrders')
    ordersTotalValue.innerText = totalProducts + '€'
  })
}


//Close purchase order
let closeOrderButton = document.querySelector('#closeOrder')
closeOrderButton.addEventListener('click', closeOrder)

function closeOrder(){
  orderConfirmation.classList.replace('shown', 'hidden')
}


//Responsive menu
const mainNav = document.querySelector('#mainNav')
const open = document.querySelector('#open')
const close = document.querySelector('#close')

open.addEventListener('click', showMenu)
close.addEventListener('click', hideMenu)

function showMenu() {
  mainNav.style.display= 'flex'
  mainNav.style.right= '0'
}

function hideMenu() {
  mainNav.style.right='-100%'
}

let menuButtons = document.getElementsByClassName('menuButton')
for (let i = 0; i < menuButtons.length; i++) {
  menuButtons[i].addEventListener('click', hideMenu, false);
}


//Toggle cart div
let cartButton = document.querySelector('#cartButton')
let cartDiv = document.querySelector('#cart')
cartButton.addEventListener('click', showCartToggle)

let closeButton = document.querySelector('#closeCart')
closeButton.addEventListener('click', showCartToggle)

function showCartToggle(){
  cartDiv.classList.contains('hidden') ? cartDiv.classList.replace('hidden', 'shown') : cartDiv.classList.replace('shown', 'hidden')
}

function showCart(){
  if (cartDiv.classList.contains('hidden')) {
    cartDiv.classList.replace('hidden', 'shown')
  }
}

