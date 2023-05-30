// creamos la clase ProductManager
class productManager{
    constructor(){
        this.products = []
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
    getProducts =()=>{
        return this.products 
    }
    
    // buscador de producto por id
    getProductById =(IdCode)=>{
        let product = this.products.find(product => product.code === IdCode)
        if(product) {
            // uso de stringify para imprimir las variables del objeto
            return `Code: ${IdCode} Found` + JSON.stringify(product) ;
        }
        
        else {
            // en caso de no encontrar el codigo
            return `Code: ${IdCode} Not Found`;
        }
    }
}

// test de funciones
const test = new productManager()
test.addProduct("juego de mesa","un juego de mesa infantil",2300,"...",24)
test.addProduct("pelota","pelota de futbol",1000,"...",10)
test.addProduct("pelota")
let search1=test.getProductById(1)
let search2=test.getProductById(5)
// test log
console.log(test.getProducts())
console.log(search1)
console.log(search2)