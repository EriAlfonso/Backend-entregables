const socket = io()

const deleteButtons = document.querySelectorAll(".delete-btn");
const cartItemCount = document.getElementById("cartItemCount");

deleteButtons.forEach(button => {
    button.addEventListener("click", async () => {
        const cartId = button.dataset.cartid;
        const productID = button.dataset.pid;
        try {
            const response = await fetch(`/api/carts/${cartId}/products/${productID}`, {
                method: "DELETE",
            });
            if (response.ok) {
                const productRow = document.getElementById(`product_${productID}`);
                if (productRow) {
                    productRow.remove();
                }
                const data = await response.json(); 
                const updatedItemCount = data.cartItemCount; 
                cartItemCount.textContent = updatedItemCount;
                console.log("Product removed from cart");
            } else {
                console.error("Failed to remove product from cart");
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
    });
});

// make cart id bring the actual id. the rest should function
document.getElementById('purchase-btn').addEventListener('click', function () {
    const cartId = this.dataset.cartid;
    fetch(`/carts/${cartId}/purchase`, {
        method: 'POST',
    })
    .then(response => {
        console.log("Response status:", response.status);
        console.log("Response headers:", response.headers);
        if (response.ok) {
            return response.json();
        } 
        else {
            console.error("Purchase Error: Can't complete purchase ");
        }
    })
        .then(data => {
            const confirmationMessage = `Purchase completed successfully!\nTicket Code: ${data.ticket.code}\nTotal Price: ${data.ticket.amount}`;
            alert(confirmationMessage);
        })
    .catch(error => {
        console.error("An error occurred:", error);
    });
});


socket.on('realtimeCart', (products) => {
    const newCart = document.getElementById('realTimeCart')

    let html = '';
    products.forEach((product) => {
        html += `<tr>
        <td><img src="${product.thumbnail}" style="width: 5rem;" alt="no image"></td>
            <td>${product.title}</td>
            <td>${quantity}</td>
            <td>${product.price}</td>
            <td>${totalPrice}</td>
            <td>
                <button class="btn btn-danger delete-btn" data-cartid="${cartId}" data-pid="${product._id}">Delete</button>
            </td>
            </tr> `
    })
    newCart.innerHTML = html
});