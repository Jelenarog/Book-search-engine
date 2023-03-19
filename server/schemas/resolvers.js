 const { USer, Book } = require('../models');
const {getSingleUser} = require('../controllers/user-controller')
const resolvers = {
  Query: {
    me: getSingleUser,
    }

  
};

module.exports = resolvers;
