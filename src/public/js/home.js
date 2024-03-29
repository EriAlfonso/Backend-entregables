const socket = io();

document.getElementById("realTimeForm").onsubmit = (e) => {
    e.preventDefault();

    const title = document.querySelector("input[name=title]").value;
    const description = document.querySelector("input[name=description]").value;
    const price = document.querySelector("input[name=price]").value;
    const thumbnail = document.querySelector("input[name=thumbnail]").value;
    const code = document.querySelector("input[name=code]").value;
    const stock = document.querySelector("input[name=stock]").value;
    const category = document.querySelector("input[name=category]").value;
    const owner = document.querySelector("input[name=owner]").value;
    
    const newProduct = {
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        category,
        owner
    };
    socket.emit("newProduct", newProduct);
};

const deleteButtons = document.querySelectorAll(".delete-btn");

deleteButtons.forEach(button => {
    button.addEventListener("click", async () => {
        const productID = button.dataset.pid;
        try {
            const response = await fetch(`/api/products/${productID}`, {
                method: "DELETE",
            });
            if (response.ok) {
                const productRow = document.getElementById(`product_${productID}`);
                if (productRow) {
                    productRow.remove();
                }
                console.log("Product removed");
            } else {
                console.error("Failed to remove product ");
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
    });
});

socket.on("realtimetable", (products) => {
    const newTable = document.getElementById("realTimeTable");

    let html = "";
    products.forEach((product) => {
        html += `<tr>
        <td><img src="${product.thumbnail}" style="width: 5rem;" alt="no image"></td>
    <td>${product.title}</td>
<td>${product.description}</td>
<td>${product.price}</td>
<td>${product.code}</td>
<td>${product.stock}</td>
<td>${product.category}</td>
<td>
    <button class="btn btn-danger delete-btn" id="deleteBtn_${this._id}">Delete</button>
</td>
</tr>
            `;
    });
    newTable.innerHTML = html;
});

