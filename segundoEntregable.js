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
            console.log('Error retrieving products:', error);
            return [];
        }
    };
    // funcion para crear el id o code
    getNewId = async () => {
        const productList = await this.getProducts();
        const count = productList.length;
        if (count > 0) {
            return productList[count - 1].id + 1;
        } else {
            return 1;
        }
    };

    // funcion para agregar productos sin repeticion de id o code
    addProduct = async (title, description, price, thumbnail, stock, code) => {
        if (!title || !description || !price || !thumbnail || !stock || !code) {
            return console.log("Error: Missing Fields");
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

        const productList = await this.getProducts();
        productList.push(product);
        await fs.promises.writeFile(this.filename, JSON.stringify(productList));
    };


    // buscador de producto por id
    getProductById = async (IdCode) => {
        const productList = await this.getProducts();
        let product = productList.find(product => product.id === IdCode)
        if (product) {
            // uso de stringify para imprimir las variables del objeto
            return `Code: ${IdCode} Found` + JSON.stringify(product);
        }

        else {
            // en caso de no encontrar el codigo
            return `Code: ${IdCode} Not Found`;
        }
    }

    
    // actualiza el producto usando su id para buscarlo
    updateProduct = () => {

    }
    // recibe un id y elimina ese producto
    deleteProduct = () => {

    }
}


async function run() {
    const test = new productManager('product.json')
    await test.addProduct("juego de mesa", "un juego de mesa infantil", 2300, "...", 24, "iii")
    let search1 = await test.getProductById(55)
    let search2 = await test.getProductById(8)
    console.log(await test.getProducts())
    console.log(search1)
    console.log(search2)
}

run()