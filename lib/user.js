/*
##################################################################
-- Name              :
-- Creation Date     :
-- Author            :
##################################################################
*/

"use strict";
const request = require('request');
let asyncLoop = require('node-async-loop');
let async = require('async');
let rolesLayer = require("../middleware/roles")();
module.exports = (modals) => {

    const userModel = modals.user;
    const userAuth = require("../middleware/userAuth")();
    var async = require('async');

    return {

        getUsres : async () => {
            return new Promise((resolve,reject)=>{
                userModel.find((err,res)=>{
                    if(err)
                         reject(err)
                    else resolve(res)
                })
            })

        },
        createUser : async (body) => {

            return new Promise( (resolve,reject)=>{

                async.waterfall([
                    function (done) {
                        rolesLayer.checkRoles(body)
                            .then((res)=>{
                                done(null)
                            })
                            .catch((err)=>{
                                reject(err)
                            })
                    },
                    function(done)
                    {
                        rolesLayer.createRoles(body)
                            .then((res)=>{
                                console.log("roles created ");
                                done(null,res.roles)
                            })
                            .catch((err)=>{
                                console.log("error in creating roles ")
                            })

                        },
                    function (roles,done)
                    {
                        let tempUser = {"email":body.email,"roles":roles}
                        const user = new userModel(tempUser)
                        user.save((err,res)=>{
                            if(err)
                                console.log(err)
                            else done(null,res)
                        })

                    },
                    function (data,done)
                    {

                        rolesLayer.fetchSpecificRoles(data.roles)
                            .then((res)=>{
                                console.log("in final step");
                                console.log(res);
                                data.roles = res
                                resolve(data);
                            })
                    }
                    ],
                    function(errInn,resOuter)
                    {
                        if(errInn) console.log(errInn);
                        else {
                            resolve(resOuter)
                        }
                    }
                    );
            })

        },
        getSpecificUser :async (username,app)=>{
            let tempObj = {}
            let user = await userModel.find({"username":username});

            return new Promise((resolve,reject) => {
                try {

                    if(user[0].apps.length > 0){
                        asyncLoop(user[0].apps, async function (item, next)
                        {
                            if(item.name == app) {
                                tempObj = item
                            }
                            next();
                        }, (err) => {
                            if(err){ reject({
                                status:501,
                                msg:"error while updating flag"
                            })}

                            resolve(tempObj);

                        });
                    }

                }catch(err){
                    console.log(err)
                }
            })
        },

        editUser : (body) => {

            return new Promise( (resolve,reject)=>{

                async.waterfall([
                        function (done) {
                            rolesLayer.checkRoles(body)
                                .then((res)=>{
                                    done(null)
                                })
                                .catch((err)=>{
                                    reject(err)
                                })
                        },
                        function(done)
                        {

                            rolesLayer.editRoles(body)
                                .then((res)=>{
                                    console.log("roles updated ");
                                    console.log(res)
                                    done(null,res.roles)
                                })
                                .catch((err)=>{
                                    console.log(err)
                                })

                        },
                        function (roles,done)
                        {
                            let tempUser = {"email":body.email,"roles":roles}

                            userModel.findOneAndUpdate({"_id":body._id},{$set: tempUser},{new:true},(err,res)=>{
                                if(err){
                                    reject(err)
                                }
                                else {
                                    resolve(res)
                                }
                            })

                        }
                    ],
                    function(errInn,resOuter)
                    {
                        if(errInn) console.log(errInn);
                        else {
                            resolve(resOuter)
                        }
                    }
                );
            })


        },
        deleteUser : (body) => {
            console.log("err sidd "+body._id);

            return new Promise((resolve,reject)=>{
                async.waterfall([

                        function(done)
                        {
                            rolesLayer.deleteRoles(body.roles)
                                .then((res)=>{
                                    console.log("roles deleted ");
                                    console.log(res)
                                    done(null)
                                })
                                .catch((err)=>{
                                    console.log(err)
                                })

                        },
                        function (done)
                        {
                            userModel.findOneAndDelete({_id:body._id},(err,res)=>{
                                if(err){
                                    reject(err)
                                }
                                else {
                                    resolve({
                                        status:204,
                                        res:res
                                    })
                                }
                            })

                        }
                    ],
                    function(errInn,resOuter)
                    {
                        if(errInn) console.log(errInn);
                        else {
                            resolve(resOuter)
                        }
                    }
                );
            })

        },

    }
};
