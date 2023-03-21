 const { User, bookSchema } = require('../models');
 const {AuthenticationError} = require('apollo-server-express');
 const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context)=>{
      if(context.user){
        const foundUser = await User.findOne({
        _id:context.user._id
        }).populate('savedBooks');
      }
      throw new AuthenticationError('You must be logged in.');
    }
    },
  // Define the functions that will fulfill the mutations
  Mutation: {
    addUser: async (parent, args) => {
      // Create User
     const newUser = await User.create(args)
     const token = signToken(newUser);
      return {token, newUser}
    },
    login: async (parent, {password, email}) => {
     const findUser =  await User.findOne({email});
     if(!findUser){
      throw new AuthenticationError('No user with this email.');
     }
     const validatePassword = findUser.isCorrectPassword(password)
     if(!validatePassword){
      throw new AuthenticationError('Incorrect password.');
     }
     const token = signToken(findUser);
      return {token, findUser};
      },
      
  },
  
};

module.exports = resolvers;
