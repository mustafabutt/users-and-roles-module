/*
##################################################################
-- Name              :userAuth.js
-- Creation Date     :
-- Author            :Mustafa
##################################################################
*/

"use strict";
const jwt = require('jsonwebtoken');
const C = require("../constants/constants");
module.exports =  () => {
    const bcrypt = require('bcryptjs');
    const _ = require("underscore");

    return {
        authenticateMe :  async (emailAdress,userName,fullName,modals,apps) => {
            const userModel = modals.user;
            let query = {deleted: {$eq: null}};
            query.email = emailAdress;

            let userData = await userModel.findOne(query);
            if(!_.isEmpty(userData)){
                let token = await generateToken(userData._id)
                token.userInfo = userData
                console.log(token)
                return token
            }else {
                const user ={
                    name:fullName,
                    username:userName,
                    email:emailAdress,
                    apps:apps,
                    password:bcrypt.hashSync("1234567",C.HASH_SALT),
                }
                const newUser = new userModel(user);
                  try{
                      let resp = await newUser.save();
                      let token = await generateToken(resp._id);
                      token.userInfo= resp;
                      return token
                  }catch (error) {
                      throw error;
                  }
            }

        },

    }


}

const generateToken = (id) => {
    let token = {
        "auth":true
    };
    token.token = jwt.sign({ id: id }, C.SECRET_KEY, {
        expiresIn: 86400 // expires in 24 hours
    });
    return token;
}