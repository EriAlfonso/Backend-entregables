import productModel from "../models/products.model.js";

export default class productManager{

    getNewId= async () => {
        const count = await productModel.count();
        const nextId = count > 0 ? this.products[count - 1].id + 1 : 1;
        return nextId;
    };

    addProduct = async (product) => {
        try {
          const validate = await productModel.findOne({ code: product.code });
          if (validate) {
            console.log(`The product with code: ${product.code} already exists`);
            throw new Error(
              `The product with code: ${product.code} already exists`
            );
          } else {
            product.status = true;
    
            await productModel.create(product);
            return "Product created successfully";
          }
        } catch (err) {
          throw err;
        }
      };
    
      getProducts = async () => {
        try {
          const products = productModel.find();
    
          return products;
        } catch (err) {
          console.log("Products not found");
          return [];
        }
      };
    
      getProductById = async (id) => {
        try {
          const product = await productModel.findById(id);
    
          return product;
        } catch (err) {
          throw err;
        }
      };
    
      updateProduct = async (id, props) => {
        try {
          const validate = await productModel.findByIdAndUpdate(id, props);
    
          if (props.hasOwnProperty("id") || props.hasOwnProperty("code")) {
            console.log("Cannot update 'id' or 'code' property");
            throw new Error("Cannot update 'id' or 'code' property");
          }
    
          if (validate === null) {
            console.log(`Product with id: ${id} does not exist`);
            throw new Error(`Product with id: ${id} does not exist`);
          }
    
          return "Updated product successfully";
        } catch (err) {
          throw err;
        }
      };
    
      deleteProduct = async (id) => {
        try {
          const productDeleted = await productModel.findByIdAndDelete(id);
    
          if (productDeleted === null) {
            console.log("Product does not exist");
            throw new Error("Product does not exist");
          }
    
          return "Product removed successfully";
        } catch (err) {
          throw err;
        }
      };
    


}