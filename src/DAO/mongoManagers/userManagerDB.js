import userModel from "../models/user.model";
export default class usersManager {
    async createUser(data) {
      try {
        if (data) return await userModel.create(data);
      } catch (error) {
        throw error;
      }
    }
    async getUserById(id) {
      try {
        if (id) return await userModel.findById(id);
      } catch (error) {
        throw error;
      }
    }
    async getUsers() {
      try {
        return await userModel.find().lean().exec();
      } catch (error) {
        throw error;
      }
    }
    getUserByEmail = async (email) => {
      try {
        if (email) {
          const user = await userModel.findOne({ email: email });
          if (user) return user;
        }
        return null;
      } catch (error) {
        throw error;
      }
    };
    getUserByEmailCode = async (email, verificationCode) => {
      try {
        if ((email, verificationCode)) {
          const user = await UserModel.findOne({ email, verificationCode });
          return user;
        }
      } catch (e) {
        throw e;
      }
    };
    async updateUser(id, data) {
      try {
        if ((id, data)) return await userModel.findByIdAndUpdate(id, data);
      } catch (e) {
        throw e;
      }
    }
    async deleteUser(id) {
      try {
        if (id) return await userModel.findByIdAndDelete(id);
      } catch (e) {
        throw e;
      }
    }
  }
  