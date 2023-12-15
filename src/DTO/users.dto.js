export default class userDTO {
    constructor(user) {
      this.first_name = user.first_name;
      this.last_name = user.last_name;
      this.email = user.email;
      this.age = user.age;
      this.role = user.role;
      this._id = user._id;
      this.last_connection= user.last_connection
    }
  }