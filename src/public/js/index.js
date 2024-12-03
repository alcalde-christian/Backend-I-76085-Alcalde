const socket = io()

const newProductForm = document.getElementById("newProductForm")
const productsContainer = document.getElementById("productsContainer")

newProductForm.addEventListener("submit", async (e) => {
    e.preventDefault()
    const data = new FormData(newProductForm)
    const newObjectProduct = {}
    data.forEach((value, key) => newObjectProduct[key] = value)

    try {
        const response = await fetch("/api/products", {
            method: 'POST',
            body: JSON.stringify(newObjectProduct),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (response.status === 201) {
            const product = await response.json()
            socket.emit("newProduct", product.data)
            alert("Producto agregado con éxito")
            newProductForm.reset() 
        } else {
            console.error("Error al agregar producto:", response.status)
            alert("Error al agregar el producto. Verifica los datos.")
        }
    } catch (error) {
        console.error("Error en el envío", error)
        alert("Se produjo un error al intentar agregar el producto")
    }
})

socket.on("allProducts", data => {
    data.forEach (el => {
        productsContainer.innerHTML += `
            <div class="productCard">
                <p>${el.title}</p>
                <p>${el.description}</p>
                <p>$ ${el.price}</p>
                <button class="deleteButton">
                    Eliminar
                </button>
            </div>
        `
    })
})