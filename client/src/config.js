

const config = {
  authUri:"https://microservice-e-commerce.onrender.com/",
  productUri:"https://microservice-e-commerce-1.onrender.com/",
  reviewUri:"https://microservice-e-commerce-2.onrender.com",
  payPal: process.env.REACT_APP_API_PAYPAL,
  esewaImageUrl: process.env.REACT_APP_ESEWA_IMAGE_URL,
  esewaPaymentUrl: process.env.REACT_APP_ESEWA_PAYMENT_URL,
  apiEndPoint: {
    product: {
      fetchProducts: '/product',
      fetchProduct: '/product/:id',
      fetchProductReviews: '/product/:id/reviews',
      createReview: '/product/:id/reviews',
      deleteProduct: '/product/:id',
      createProduct: '/product',
      updateProduct: '/product/:id',
    },
    user: {
      login: '/auth/login',
      create: '/auth/register',
      fetchUsers: '/user',
      verifyEmail: 'verify-email',
      deleteUser: '/user/:id',
      updateUser: '/user/:id',
      fetchUser: '/user/:id',
      forgotPassword: '/auth/forgot-password',
      resetPassword: '/auth/reset-password',
    },
    order: {
      createOrder: '/order',
      order: '/order/:id',
      pay: '/order/:id/pay',
      deliverOrder: '/order/:id/deliver',
      userOrder: '/order/auth-orders',
      orders: '/order',
    },
  },
};

export default config;
