// creamos la clase ProductManager
class productManager{
    constructor(){
        this.products = []
    }
    getNewId = () => {
        const count = this.products.length
        if (count > 0) {
            return this.products[count - 1].code + 1
        } else {
            return 1
        }
    }

    // funcion para agregar productos sin repeticion de id
    addProduct =(title,description,price,thumbnail,stock)=>{
    
        const product = {
            title,
            description,
            price,
            thumbnail,
            code: this.getNewId(),
            stock,
        }

        this.products.push(product)
    }
    
    // muestra todos los productos en el array
    getProducts =()=>{
        return this.products 
    }
    
    // buscador de producto por id
    getProductById =()=>{
        
    }
}

const test = new productManager()
test.addProduct("juego de mesa","un juego de mesa infantil",2300,"...",24)
test.addProduct("pelota","pelota de futbol",1000,"...",10)
console.log(test.getProducts())