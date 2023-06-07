const fs = require('fs')

// creamos la clase ProductManager
class productManager {
    constructor(filename) {
        this.filename = filename
        this.format = 'utf-8'
    }


    // muestra todos los productos en el array
    getProducts = async () => {
        try {
            const content = await fs.promises.readFile(this.filename, this.format);
            return JSON.parse(content.toString());
        } catch (error) {
            console.log('Error: Product List Empty:', error);
            return [];
        }
    };

    // funcion para crear el id o code
    getNewId = async () => {
        const productList = await this.getProducts();
        let count = productList.length;
        if (count > 0) {
            return ++count
        } else {
            return 1;
        }
    };

    // funcion para agregar producto
    addProduct = async (title, description, price, thumbnail, stock, code) => {
        if (!title || !description || !price || !thumbnail || !stock || !code) {
            return console.log("Error: Missing Variables");
        }
        const productList = await this.getProducts();
        // codigo para impedir la repeticion de la variable "code"
        const codeExists = productList.find(product => product.code === code);
        if (codeExists) {
            return console.log(`Error: Product with code ${code} already exists.`);
        }

        const id = await this.getNewId();

        const product = {
            id: parseInt(id),
            title,
            description,
            price: `$${price}`,
            thumbnail,
            code,
            stock,
        };
        productList.push(product);
        await fs.promises.writeFile(this.filename, JSON.stringify(productList));
    };

    // buscador de producto por id
    getProductById = async (id) => {
        const productList = await this.getProducts();
        let product = productList.find(product => product.id === id)
        if (product) {
            return `Code: ${id} Found` + JSON.stringify(product);
        }

        else {
            // en caso de no encontrar el codigo
            return `Code: ${id} Not Found`;
        }
    }


    // actualiza el producto usando su id para buscarlo
    updateProduct = async (id, title, description, price, thumbnail, stock, code) => {
        // creamos un objeto con las variables nuevas
        const update = {
            id,
            title,
            description,
            price: `$${price}`,
            thumbnail,
            code,
            stock,
        };
        // obtenemos la informacion
        const productList = await this.getProducts();
        // buscamos el id
        const findID = productList.findIndex(product => product.id === id);

        // si no existe
        if (findID === -1) {
            return console.log(`Error: Product with Id : ${id} not found.`);
        }

        // si existe sobreescribimos el producto usando el objeto nuevo
        const updatedProduct = { ...productList[findID], ...update };
        productList[findID] = updatedProduct;
        // lo implementamos al archivo
        await fs.promises.writeFile(this.filename, JSON.stringify(productList));
        // mensaje de exito
        console.log(`Product with Id: ${id} has been updated.`);
    }

    // funcion para borra producto por id
    deleteProduct = async (id) => {
        // obtenemos la informacion
        const productList = await this.getProducts();
        // buscamos el id
        const findID = productList.findIndex(product => product.id === id);

        // si no existe
        if (findID === -1) {
            return console.log(`Error: Product with Id : ${id} not found.`);
        }
        
        // si existe borramos ese id
        productList.splice(findID, 1);
        // sobreescribimos el archivo
        await fs.promises.writeFile(this.filename, JSON.stringify(productList));
        console.log(`Product with Id: ${id} has been deleted.`);
    };
}

// test
async function run() {
    const test = new productManager('product.json')
    await test.addProduct("juego de mesa1", "un juego de mesa infantil1", 2300, "...", 24, "i")
    await test.addProduct("juego de mesa2", "un juego de mesa infantil2", 2300, "...", 24, "ii")
    await test.addProduct("juego de mesa3", "un juego de mesa infantil3", 2300, "...", 24, "iii")
    await test.updateProduct(1, "juego de mesa nuevo", "un juego de mesa infantil nuevo", 1200, "...", 33, "aai")
    let search1 = await test.getProductById(55)
    let search2 = await test.getProductById(1)
    let delete1 = await test.deleteProduct(2)
    console.log(await test.getProducts())
    console.log(search1)
    console.log(search2)
}

run()