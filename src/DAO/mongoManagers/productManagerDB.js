import productModel from "../models/products.model.js";

export default class productManager {
 constructor(){
  
 }

  addProduct = async (product) => {
    const productCode= product.code
    try {
      const validate = await productModel.findOne({ productCode });
      if (validate) {
        return {
          success: false,
          message: `Product with code ${productCode} already exists.`,
        };
      } else {
        await productModel.create(product);
        return { success: true, message: "Product created successfully" };
      }
    } catch (error) {
      throw error;
    }
  };

  getProducts = async () => {
    try {
      const products = await productModel.find().lean().exec();
      return { success: true, products };
    } catch (error) {
      console.error(error);
      return { success: false, message: "Internal Server Error" };
    }
  }
  getProductsQuery= async(options)=> {
    try {
      const { limit = 10, page = 1, query, sort } = options;
      const parsedLimit = parseInt(limit);
      const parsedPage = parseInt(page);

      let queryOptions = {};
      if (query) {
        const field = query.split(",")[0];
        let value = query.split(",")[1];

        if (!isNaN(parseInt(value))) {
          value = parseInt(value);
        }

        queryOptions[field] = value;
      }

      const result = await productModel.paginate(queryOptions, {
        sort: sort === "desc" ? { price: -1 } : sort === "asc" ? { price: 1 } : {},
        limit: parsedLimit,
        page: parsedPage,
        lean: true,
      });

      return {
        status: "success",
        payload: result.docs,
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.hasPrevPage
          ? `/products?limit=${limit}&page=${result.prevPage}`
          : null,
        nextLink: result.hasNextPage
          ? `/products?limit=${limit}&page=${result.nextPage}`
          : null,
      };
    } catch (error) {
      throw error;
    }
  }

  getProductById = async (id) => {
    try {
      const product = await productModel.findById(id);
      return product;
    } catch (error) {
      throw error;
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
        throw new Error("Product does not exist");
      }
      return "Product removed successfully";
    } catch (error) {
      throw error;
    }
  };

}