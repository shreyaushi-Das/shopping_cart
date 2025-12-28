const cartIcon=document.querySelector("#cart-icon");
const cart=document.querySelector(".cart");
const cartClose=document.querySelector(".cart-close");

cartIcon.addEventListener("click",()=> cart.classList.add("active"));
cartClose.addEventListener("click",()=> cart.classList.remove("active"));

const addCartButtons=document.querySelectorAll(".add-cart");
addCartButtons.forEach(button => {
    button.addEventListener("click",event => {
        const productBox = event.target.closest(".product-box");
        if (!productBox) return;
        addToCart(productBox);
    })
})
const cartContent=document.querySelector(".cart-content");
if (!cartContent) console.error('Element .cart-content not found');
if (cartContent) {
    cartContent.addEventListener('click', function(e){
        if (e.target.classList.contains('cart-remove')){
            const box = e.target.closest('.cart-box');
            if (box) box.remove();
            updateTotal();
            updateCartContent(-1);
        }
    });
}

function updateTotal(){
    const cartBoxes = cartContent.querySelectorAll('.cart-box');
    let total = 0;
    cartBoxes.forEach(box => {
        const priceText = box.querySelector('.cart-price').textContent.replace(/[^0-9.]/g, '');
        const price = parseFloat(priceText) || 0;
        const qty = parseInt(box.querySelector('.number').textContent, 10) || 0;
        total += price * qty;
    });
    const totalEl = document.querySelector('.total-price');
    if (totalEl) totalEl.textContent = `₹${total}`;
}
const addToCart=productBox => {
    const productImgSrc =productBox.querySelector("img").src;
    const productTittle =productBox.querySelector(".product-tittle").textContent;
    const productPrice =productBox.querySelector(".price").textContent;
    

    const cartItems = cartContent.querySelectorAll(".cart-product-tittle");
    for (let item of cartItems) {
        if (item.textContent.trim().toLowerCase() === productTittle.trim().toLowerCase()) {
            alert("this item is already in the cart.");
            return;
        }
    }

    const cartBox=document.createElement("div");
    cartBox.classList.add("cart-box");
     cartBox.innerHTML = `
     <img src="${productImgSrc}" class="cart-img">
                <div class="cart-detail">
                    <h2 class="cart-product-tittle">${productTittle} <i class="ri-delete-bin-line cart-remove"></i></h2>
                    <span class="cart-price">${productPrice}</span>
                    <div class="cart-quantity">
                        <button id="decrement">-</button>
                        <span class="number">1</span>
                        <button id="increment">+</button>
                    </div>
                </div>
                `;

                cartContent.appendChild(cartBox);

            cartBox.querySelector(".cart-remove").addEventListener("click", () =>{
                cartBox.remove();
                updateTotal();
                updateCartContent(-1);
            })

            cartBox.querySelector(".cart-quantity").addEventListener("click", event => {
                const numberElement = cartBox.querySelector(".number");
                const decrementButton = cartBox.querySelector("#decrement");
                let quantity = parseInt(numberElement.textContent, 10) || 0;

                if (event.target.id === "decrement" && quantity > 1) {
                    quantity--;
                    if (quantity === 1) {
                        decrementButton.style.color = "#999";
                    }
                } else if (event.target.id === "increment") {
                    quantity++;
                    decrementButton.style.color = "#333";
                }
                numberElement.textContent = quantity;
                updateTotal();
            });

            updateCartContent(1);
            updateTotal();
};
let cartItemCount = 0;
const updateCartContent = change => {
    const cartItemsCountBadge = document.querySelector(".cart-item-count");
    cartItemCount = Math.max(0, (cartItemCount || 0) + change);
    if (cartItemsCountBadge) {
        if (cartItemCount > 0) {
            cartItemsCountBadge.style.visibility = "visible";
            cartItemsCountBadge.textContent = cartItemCount;
        } else {
            cartItemsCountBadge.style.visibility = "hidden";
            cartItemsCountBadge.textContent = "";
        }
    }
};

const buyNowButton = document.querySelector(".btn-buy");
if (buyNowButton) {
    buyNowButton.addEventListener("click", () => {
        const cartBoxes = cartContent ? cartContent.querySelectorAll(".cart-box") : [];
        if (cartBoxes.length === 0) {
            alert("Your cart is empty. Please add items to you cart before buying.");
            return;
        }
        cartBoxes.forEach(cartBox => cartBox.remove());

        cartItemCount = 0;
        updateCartContent(0);

        updateTotal();

        alert("Thank you for your purchase");
    });
}