const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
var stripe = require("stripe")(process.env.STRIPE_KEY);

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
    // Order resolvers
    getAllOrders: async (root, args, { Order }) => {
      const allOrders = await Order.find().sort({ timestamps: "desc" });
      return allOrders;
    },
    getOrder: async (root, { _id }, { Order }) => {
      const order = await Order.findOne({ _id });
      return order;
    },
    getUserOrders: async (root, { userId }, { Order }) => {
      const order = await Order.find({ user: userId });
      return order;
    },

    getSellerProductsOrders: async (root, { prodId }, { Order }) => {
      const order = await Order.find({ product: { _id: prodId } }).sort({
        timestamps: "desc"
      });

      return order;
    },

    // Product resolvers
    getAllProducts: async (root, args, { Product }) => {
      const allProducts = await Product.find().sort({ createdDate: "desc" });
      return allProducts;
    },
    getProductsByCategory: async (root, { category }, { Product }) => {
      const products = await Product.find({ category }).sort({
        likes: "desc"
      });
      return products;
    },
    getProductsByPrice: async (root, { minPrice, maxPrice }, { Product }) => {
      const products = await Product.find({
        price: { $gte: minPrice, $lte: maxPrice }
      }).sort({
        likes: "desc"
      });
      return products;
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

    // User resolvers
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
    // Checkout Mutations
    wholeCartCheckout: async (root, { userId }, { User, Order }) => {
      const user = await User.findOne({ _id: userId });
      const userWallet = user.wallet;
      const userCartTotal = user.cartTotal;
      if (user.cart.length > 0) {
        if (userWallet >= userCartTotal) {
          //Updating Order status
          user.cart.map(async ord => {
            const order = await Order.updateOne(
              { _id: ord._id },
              { $set: { status: "paid" } }
            );
          });

          //Update User info
          const userCheckout = await User.updateOne(
            { _id: userId },
            {
              $set: {
                cart: [],
                cartTotal: 0,
                wallet: userWallet - userCartTotal
              }
            }
          );

          console.log("CART EMPTY AFTER CHECKOUT");
          return await User.findOne({ _id: userId });
        } else {
          throw new Error("Not Enough Funds");
        }
      } else {
        throw new Error("Cart is Empty");
      }
    },

    // User Wallet Mutations
    getCoins: async (root, { userId, amount }, { User }) => {
      const stripePayment = async () => {
        const charge = await stripe.charges.create({
          amount: amount,
          currency: "usd",
          source: "tok_visa",
          receipt_email: "jenny.rosen@example.com"
        });
        return charge;
      };

      return stripePayment().then(async charge => {
        const user = await User.findOneAndUpdate(
          { _id: userId },
          { $inc: { wallet: charge.amount } }
        );
        const updatedUser = await User.findOne({ _id: userId });
        return updatedUser;
      });
    },

    // Order Mutations
    createOrder: async (
      root,
      { prodId, userId, quantity },
      { Product, Order, User }
    ) => {
      const existingOrder = await Order.findOne({
        product: { _id: prodId },
        user: { _id: userId },
        status: "unpaid"
      });

      if (!existingOrder) {
        const userOrdered = await User.findOne({ _id: userId });
        const productOrdered = await Product.findOne({ _id: prodId });
        const newOrder = await new Order({
          product: productOrdered,
          user: userOrdered,
          quantity
        }).save();
        //Getting new Cart Total
        const oldTotal = userOrdered.cartTotal;
        const totalPrice = await (oldTotal + productOrdered.price * quantity);
        const userCartUpdate = await User.findOneAndUpdate(
          { _id: userId },
          { $push: { cart: newOrder }, $set: { cartTotal: totalPrice } }
        );
        return newOrder;
      }

      //Updating existing order
      const existingOrderId = existingOrder._id;
      const existingOrderQuantity = existingOrder.quantity;
      const updatedOrder = await Order.updateOne(
        { _id: existingOrderId },
        { $set: { quantity: existingOrderQuantity + quantity } }
      );
      //updating User cartTotal
      const userOrdered = await User.findOne({ _id: userId });
      const productOrdered = await Product.findOne({ _id: prodId });
      const oldTotal = userOrdered.cartTotal;
      const totalPrice = await (oldTotal + productOrdered.price * quantity);
      const userCartUpdate = await User.updateOne(
        { _id: userId },
        { $set: { cartTotal: totalPrice } }
      );
    },

    deleteOrder: async (
      root,
      { userId, orderId },
      { User, Order, Product }
    ) => {
      const order = await Order.findOneAndRemove({ _id: orderId });

      const quantity = order.quantity;
      const prodId = order.product[0];
      const productDeleted = await Product.findOne({ _id: prodId });
      const user = await User.findOne({ _id: userId });
      //Getting new Cart Total
      const oldTotal = user.cartTotal;
      const totalPrice = await (oldTotal - productDeleted.price * quantity);

      const userCartUpdate = await User.findOneAndUpdate(
        { _id: userId },
        { $pull: { cart: orderId }, $set: { cartTotal: totalPrice } }
      );
      return order;
    },
    updateOrderQuantity: async (
      root,
      { orderId, quantity },
      { Order, Product, User }
    ) => {
      //Updating users cart total when changing quantity of product
      const updateUserCart = async (_id, quantity) => {
        try {
          const order = await Order.findOne({ _id: orderId });
          const oldQuantity = order.quantity;
          const prodId = order.product[0]._id;
          const userId = order.user[0];
          const product = await Product.findOne({ _id: prodId });
          const user = await User.findOne({ _id: userId });
          //Getting new Cart Total
          const oldTotal = user.cartTotal;

          let totalPrice;
          if (quantity <= oldQuantity) {
            totalPrice = product.price * quantity;
          } else {
            totalPrice = oldTotal + product.price * (quantity - oldQuantity);
          }

          const userCartUpdate = await User.findOneAndUpdate(
            { _id: userId },
            { $set: { cartTotal: totalPrice } }
          );
        } catch (error) {
          console.log(error);
        }
      };
      updateUserCart(orderId, quantity);

      //Update Order quantity information
      const orderUpdate = await Order.findOneAndUpdate(
        { _id: orderId },
        { $set: { quantity } },
        { new: true }
      );

      return orderUpdate;
    },

    // Product Mutations
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
      const prod = await Product.findOne({ _id });
      if (prod.likes < 0) {
        await Product.findOneAndUpdate({ _id }, { $set: { likes: 0 } });
      }

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
      //Clearing Ref in the cart and Updating totalCart[]
      const clearRef = async _id => {
        const orders = await Order.find({ product: _id });
        if (orders) {
          orders.map(async order => {
            try {
              const price = order.product[0].price;
              const quantity = order.quantity;

              //Getting new Cart Total
              const oldTotal = order.user[0].cartTotal;
              const totalPrice = oldTotal - price * quantity;

              await User.updateMany(
                { cart: order._id },
                { $pull: { cart: order._id }, $set: { cartTotal: totalPrice } }
              );
            } catch (error) {
              console.log(error);
            }
          });
        }
        return;
      };
      await clearRef(_id);

      //deleting all orders what has user product

      const ordersToDelete = await Order.deleteMany({
        product: _id,
        status: "unpaid"
      });

      //deleting product
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

    //User Mutations
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
