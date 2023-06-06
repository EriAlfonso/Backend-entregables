const fs = require('fs')

// creamos la clase ProductManager
class productManager{
    constructor(filename){
        this.filename = filename
        this.format = 'utf-8'
    }
    // funcion para crear el id o code
    getNewId = () => {
        const count = this.products.length
        if (count > 0) {
            return this.products[count - 1].code + 1
        } else {
            return 1
        }
    }

    // funcion para agregar productos sin repeticion de id o code
    addProduct =(title,description,price,thumbnail,stock)=>{
        // condicional para atrapar si algun campo queda vacio
        if (!title || !description || !price || !thumbnail || !stock) {
            return console.log("Error:Missing Fields"); 
        }
        const product = {
            id:this.getNewId(),
            title, 
            description,
            price:`\$${price}`,
            thumbnail,
            code: this.getNewId(),
            stock,
        }


        this.products.push(product)
    }
    
    // muestra todos los productos en el array
    getProducts = async () => {
        return fs.promises.readFile(this.filename, this.format)
            .then(content => JSON.parse(content))
            .catch(e => {
                console.log('ERROR', e);
                return []
            })
    }
    
    // buscador de producto por id
    getProductById =(IdCode)=>{
        let product = this.products.find(product => product.id === IdCode)
        if(product) {
            // uso de stringify para imprimir las variables del objeto
            return `Code: ${IdCode} Found` + JSON.stringify(product) ;
        }
        
        else {
            // en caso de no encontrar el codigo
            return `Code: ${IdCode} Not Found`;
        }
    }
    // actualiza el producto usando su id para buscarlo
    updateProduct=()=>{

    }
    // recibe un id y elimina ese producto
    deleteProduct=()=>{

    }
}

const test = new productManager()
test.addProduct("juego de mesa","un juego de mesa infantil",2300,"...",24)
test.addProduct("pelota","pelota de futbol",1000,"...",10)
let search1=test.getProductById(1)
let search2=test.getProductById(5)
test.addProduct("pelota")
console.log(test.getProducts())
