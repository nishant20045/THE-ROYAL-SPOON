document.addEventListener("DOMContentLoaded", function () {
    const reserveButton = document.getElementById("reserveButton");
    const reservationPopup = document.getElementById("reservationPopup");
    const closeBtns = document.querySelectorAll(".close-btn");
    const confirmReservation = document.getElementById("confirmReservation");
    const reservationDate = document.getElementById("reservationDate");
    const reservationMessage = document.getElementById("reservationMessage");
    const cartPopup = document.getElementById("cartPopup");
    const cartCloseBtn = document.getElementById("cartCloseBtn");
    const cartBadge = document.querySelector(".cart-badge");
    const cartItemsContainer = document.getElementById("cartItems");
    const totalAmount = document.getElementById("totalAmount");

    if (cartCloseBtn && cartPopup) {
        cartCloseBtn.addEventListener("click", function () {
            cartPopup.style.display = "none"; 
        });
    }

    if (reserveButton && reservationPopup) {
        reserveButton.addEventListener("click", function () {
            reservationPopup.style.display = "block";
        });
    }

    closeBtns.forEach(btn => {
        btn.addEventListener("click", function () {
            this.closest(".popup").style.display = "none";
        });
    });

    if (confirmReservation && reservationDate) {
        confirmReservation.addEventListener("click", function () {
            if (reservationDate.value) {
                reservationPopup.style.display = "none";
                reserveButton.style.display = "none";
                reservationMessage.innerHTML = `🎉 Thank You for Your Reservation! Your table at The Royal Spoon is reserved for <b>${reservationDate.value}</b>. We can't wait to serve you! 🍽️✨`;
                reservationMessage.style.display = "block";
            } else {
                alert("Please select a date before confirming.");
            }
        });
    }

    let cart = [];
    
    document.querySelectorAll(".add-to-cart-btn").forEach(button => {
        button.addEventListener("click", function () {
            const menuItem = this.closest(".menu") || this.closest(".pizza-detail");
            if (!menuItem) return;

            const nameElement = menuItem.querySelector("h3") || menuItem.querySelector("h1");
            const priceElement = menuItem.querySelector("span.price") || menuItem.querySelector(".md span:last-child");
            const imageElement = menuItem.querySelector("img");
            const imageSrc = imageElement ? imageElement.src : "images/default.png";

            if (!nameElement || !priceElement) return;

            const name = nameElement.innerText;
            const price = parseInt(priceElement.innerText.replace("₹", "").trim());

            const existingItem = cart.find(item => item.name === name);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ name, price, quantity: 1, image: imageSrc });
            }
            updateCart();
        });
    });

    function updateCart() {
        cartItemsContainer.innerHTML = "";
        let total = 0;
        cart.forEach((item, index) => {
            total += item.price * item.quantity;
            cartItemsContainer.innerHTML += `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                    <div class="cart-info">
                        <p><b>${item.name}</b> - ₹${item.price} x ${item.quantity} = ₹${item.price * item.quantity}</p>
                    </div>
                    <div class="cart-buttons">
                        <button class="increase" data-index="${index}">+</button>
                        <button class="decrease" data-index="${index}">-</button>
                        <button class="remove" data-index="${index}">Remove</button>
                    </div>
                </div>
            `;
        });

        totalAmount.innerText = `Total: ₹${total}`;
        cartBadge.innerText = cart.length;
    }

    document.querySelector(".cart").addEventListener("click", function () {
        if (cartPopup) cartPopup.style.display = "block";
    });

    cartItemsContainer.addEventListener("click", function (event) {
        const index = event.target.getAttribute("data-index");
        if (event.target.classList.contains("increase")) {
            cart[index].quantity++;
        } else if (event.target.classList.contains("decrease")) {
            cart[index].quantity = Math.max(1, cart[index].quantity - 1);
        } else if (event.target.classList.contains("remove")) {
            cart.splice(index, 1);
        }
        updateCart();
    });

    document.getElementById("checkoutBtn").addEventListener("click", function () {
        cartPopup.style.display = "none";
        cart = [];
        updateCart();

        const orderConfirmPopup = document.createElement("div");
        orderConfirmPopup.classList.add("popup-cart");
        orderConfirmPopup.innerHTML = `
            <div class="popup-content">
                <h2>🎉 Order Confirmed!</h2>
                <p>Your royal feast is being prepared! 👑🍽️<br>Sit back & relax—your delicious order is on its way! 🚀</p>
                <button id="closeOrderPopup">OKAY</button>
            </div>
        `;
        document.body.appendChild(orderConfirmPopup);

        orderConfirmPopup.style.display = "block";
        document.getElementById("closeOrderPopup").addEventListener("click", function () {
            orderConfirmPopup.style.display = "none";
        });
    });
});
