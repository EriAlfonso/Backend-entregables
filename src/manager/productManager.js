import fs from "fs";

// creamos la clase ProductManager y la exportamos
export default class productManager {
    constructor(path) {
        this.path = path;
        this.format = "utf-8";
    }

    // muestra todos los productos en el array
    getProducts = async () => {
        try {
            const content = await fs.promises.readFile(this.path, this.format);
            return JSON.parse(content.toString());
        } catch (error) {
            console.log("Error: Product List Empty:", error);
            return [];
        }
    };

    // funcion para crear el id o code
    getNewId = async () => {
        const productList = await this.getProducts();
        let count = 0;
        productList.forEach((product) => {
            if (product.id > count) {
                count = product.id;
            }
        });
        const newCount = ++count;
        return newCount;
    };

    // funcion para agregar producto
    addProduct = async (title, description, price, thumbnail,category, stock, code) => {
        if (!title || !description || !price || !thumbnail || !stock || !code || !category) {
            return console.log("Error: Missing Variables");
        }
        const productList = await this.getProducts();
        // codigo para impedir la repeticion de la variable "code"
        const codeExists = productList.find((product) => product.code === code);
        if (codeExists) {
            return console.log(`Error: Product with code ${code} already exists.`);
        }

        const id = await this.getNewId();

        const product = {
            id: parseInt(id),
            title,
            description,
            price: `$${price}`,
            status:true,
            thumbnail,
            category,
            code,
            stock,
        };
        productList.push(product);
        await fs.promises.writeFile(this.path, JSON.stringify(productList));
    };

    // buscador de producto por id
    getProductById = async (id) => {
        const productList = await this.getProducts();
        const product = productList.find((product) => product.id === id);
        return product;
      };

    // actualiza el producto usando su id para buscarlo
    updateProduct = async (id,title, description, price, thumbnail,category, stock, code) => {
        const update = {
            id,
            title,
            description,
            price: `$${price}`,
            thumbnail,
            category,
            stock,
            code,
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
    };

    // funcion para borra producto por id
    deleteProduct = async (id) => {
        let productlist = await this.getProducts();
        try {
          const product = Object.values(productlist).find((product) => product.id === id);
      
          if (product) {
            productlist = productlist.filter((item) => item.id !== id);
            await fs.promises.writeFile(this.path, JSON.stringify(productlist));
      
            return console.log("Product removed");
          } else {
            return console.error("Product does not exist");
          }
        } catch (err) {
          return console.error(err);
        }
      };
}
