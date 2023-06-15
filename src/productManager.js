import fs from "fs"

// creamos la clase ProductManager y la exportamos
export default class productManager {
    constructor(path) {
        this.path = path
        this.format = 'utf-8'
    }


    // muestra todos los productos en el array
    getProducts = async () => {
        try {
            const content = await fs.promises.readFile(this.path, this.format);
            return JSON.parse(content.toString());
        } catch (error) {
            console.log('Error: Product List Empty:', error);
            return [];
        }
    };

    // funcion para crear el id o code
    getNewId = async () => {
        const productList = await this.getProducts();
        let count = 0;
  productList.forEach(product => {
    if (product.id > count) {
      count = product.id;
    }
  });
  const newCount = ++count;
return newCount;
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
        await fs.promises.writeFile(this.path, JSON.stringify(productList));
    };

    // buscador de producto por id
    getProductById = async (id) => {
        const productList = await this.getProducts();
        let product = productList.find(product => product.id === id)
        if (product) {
            // modificamos esto para que devuelva un objeto y no un string como antes
            return product;
        }

        else {
            // en caso de no encontrar el codigo
            return `Code: ${id} Not Found`;
        }
    }


    // actualiza el producto usando su id para buscarlo
    updateProduct = async (id, title, description, price, thumbnail, stock, code) => {
        const update = {
            id,
            title,
            description,
            price: `$${price}`,
            thumbnail,
            code,
            stock,
        };
        const productList = await this.getProducts();
        const findID = await this.getProductById();
        if (findID === -1) {
            return console.log(`Error: Product with Id : ${id} not found.`);
        }

        // si existe sobreescribimos el producto usando el objeto nuevo
        const updatedProduct = { ...productList[findID], ...update };
        productList[findID] = updatedProduct;
        await fs.promises.writeFile(this.path, JSON.stringify(productList));
        console.log(`Product with Id: ${id} has been updated.`);
    }

    // funcion para borra producto por id
    deleteProduct = async (id) => {
        const productList = await this.getProducts();
        const findID = await this.getProductById();
        if (findID === -1) {
            return console.log(`Error: Product with Id : ${id} not found.`);
        }
        productList.splice(findID, 1);
        await fs.promises.writeFile(this.path, JSON.stringify(productList));
        console.log(`Product with Id: ${id} has been deleted.`);
    };
}


// test
async function run() {
    const test = new productManager('./product.json')
    // await test.addProduct("juego 1", "un juego de mesa infantil", 2300, "...", 24, "I")
    // await test.addProduct("juego 2", "un juego de mesa infantil", 2400, "...", 24, "II")
    // await test.addProduct("juego 3", "un juego de mesa infantil", 2250, "...", 24, "III")
    // await test.addProduct("juego 4", "un juego de mesa infantil", 2100, "...", 24, "IV")
    // await test.addProduct("juego 5", "un juego de mesa infantil", 2000, "...", 24, "V")
    // await test.addProduct("juego 6", "un juego de mesa infantil", 2150, "...", 24, "VI")
    // await test.addProduct("juego 7", "un juego de mesa infantil", 2410, "...", 24, "VII")
    // await test.addProduct("juego 8", "un juego de mesa infantil", 2320, "...", 24, "VIII")
    // await test.addProduct("juego 9", "un juego de mesa infantil", 2300, "...", 24, "IX")
    // await test.addProduct("juego 10", "un juego de mesa infantil", 2300, "...", 24, "X")
    // console.log(await test.getProducts())
}

run()
