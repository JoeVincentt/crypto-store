const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const createToken = (user, secret, expiresIn) => {
  const { username, email } = user;

  return jwt.sign(
    {
      username,
      email
    },
    secret,
    { expiresIn }
  );
};

exports.resolvers = {
  Query: {
    getAllOrders: async (root, args, { Order }) => {
      const allOrders = await Order.find().sort({ timestamps: "desc" });
      return allOrders;
    },
    getOrder: async (root, { _id }, { Order }) => {
      const order = await Order.findOne({ _id });
      return order;
    },

    getAllProducts: async (root, args, { Product }) => {
      const allProducts = await Product.find().sort({ createdDate: "desc" });
      return allProducts;
    },
    getProduct: async (root, { _id }, { Product }) => {
      const product = await Product.findOne({ _id });
      return product;
    },
    searchProduct: async (root, { searchTerm }, { Product }) => {
      if (searchTerm) {
        const searchResults = await Product.find(
          {
            $text: { $search: searchTerm }
          },
          {
            score: { $meta: "textScore" }
          }
        ).sort({
          score: { $meta: "textScore" }
        });
        return searchResults;
      } else {
        const products = await Product.find().sort({
          likes: "desc",
          createdDate: "desc"
        });
        return products;
      }
    },

    getUserProducts: async (root, { username }, { Product }) => {
      const userProducts = await Product.find({ username }).sort({
        createdDate: "desc"
      });
      return userProducts;
    },

    getCurrentUser: async (root, args, { currentUser, User }) => {
      if (!currentUser) {
        return null;
      }
      const user = await User.findOne({
        username: currentUser.username
      })
        .populate({
          path: "favorites",
          model: "Product"
        })
        .populate({
          path: "cart",
          model: "Order"
        });
      // console.log(user);
      return user;
    },
    getUser: async (root, { _id }, { User }) => {
      const user = await User.findOne({
        _id
      })
        .populate({
          path: "favorites",
          model: "Product"
        })
        .populate({
          path: "cart",
          model: "Order"
        });
      // console.log(user);
      return user;
    }
  },
  Mutation: {
    createOrder: async (
      root,
      { prodId, userId, quantity },
      { Product, Order, User }
    ) => {
      const userOrdered = await User.findOne({ _id: userId });

      const productOrdered = await Product.findOne({ _id: prodId });
      const newOrder = await new Order({
        product: productOrdered,
        user: userOrdered,
        quantity
      }).save();
      const userCartUpdate = await User.findOneAndUpdate(
        { _id: userId },
        { $push: { cart: newOrder } }
      );

      return newOrder;
    },

    deleteOrder: async (root, { userId, orderId }, { User, Order }) => {
      const order = await Order.findOneAndRemove({ _id: orderId });

      const userCartUpdate = await User.findOneAndUpdate(
        { _id: userId },
        { $pull: { cart: orderId } }
      );
      return order;
    },
    updateOrderQuantity: async (root, { orderId, quantity }, { Order }) => {
      const order = await Order.findOneAndUpdate(
        { _id: orderId },
        { $set: { quantity } },
        { new: true }
      );
      return order;
    },

    addProduct: async (
      root,
      { name, imageUrl, description, category, username, price },
      { Product }
    ) => {
      const newProduct = await new Product({
        name,
        imageUrl,
        description,
        category,
        username,
        price
      }).save();
      return newProduct;
    },

    likeProduct: async (root, { _id, username }, { Product, User }) => {
      const product = await Product.findOneAndUpdate(
        { _id },
        { $inc: { likes: 1 } }
      );
      const user = await User.findOneAndUpdate(
        { username },
        { $addToSet: { favorites: _id } }
      );
      return product;
    },

    unlikeProduct: async (root, { _id, username }, { Product, User }) => {
      const product = await Product.findOneAndUpdate(
        { _id },
        { $inc: { likes: -1 } }
      );
      const user = await User.findOneAndUpdate(
        { username },
        { $pull: { favorites: _id } }
      );
      return product;
    },

    deleteUserProduct: async (root, { _id }, { Product, User, Order }) => {
      const order = await Order.findOneAndRemove({ product: _id });
      const user = await User.findOneAndUpdate(
        { cart: order._id },
        { $pull: { cart: order._id } }
      );

      const product = await Product.findOneAndRemove({ _id });
      return product;
    },

    updateUserProduct: async (
      root,
      { _id, name, imageUrl, description, category, price },
      { Product }
    ) => {
      const updatedProduct = await Product.findOneAndUpdate(
        { _id },
        { $set: { name, imageUrl, category, description, price } },
        { new: true }
      );
      return updatedProduct;
    },

    signinUser: async (root, { email, password }, { User }) => {
      // if (password !== passwordConfirmation) {
      //   throw new Error("Password Confirmation Failed");
      // }

      const user = await User.findOne({ email });
      // console.log(user);
      if (!user) {
        throw new Error("User not found");
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error("Invalid password");
      }
      return { token: createToken(user, process.env.SECRET, "1hr") };
    },

    signupUser: async (
      root,
      { username, email, password, passwordConfirmation },
      { User }
    ) => {
      if (password !== passwordConfirmation) {
        throw new Error("Password Confirmation Failed");
      }

      const userNameExists = await User.findOne({ username });
      if (userNameExists) {
        throw new Error("User Name already exists");
      }
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        throw new Error("User Email already exists");
      }

      const newUser = await new User({
        username,
        email,
        password
      }).save();
      return { token: createToken(newUser, process.env.SECRET, "1hr") };
    }
  }
};
