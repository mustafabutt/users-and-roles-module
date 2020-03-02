/*
##################################################################
-- Name              :roles.js
-- Creation Date     :
-- Author            :Mustafa
##################################################################
*/

"use strict";
var mongoose = require('mongoose');
let rolesModal = require("../modals/roles")(mongoose);
let asyncLoop = require('node-async-loop');
let C = require("../constants/constants")
let _ = require("underscore");
module.exports =  () => {

    return {
        checkRoles: async (body) => {
            return new Promise((resolve,reject)=>{
                console.log(body);
                if(body.hasOwnProperty("roles")){
                    body.roles.forEach((role,i)=>{
                        if(!_.contains([C.MANAGER,C.GLOBAL_MANAGER,C.REGULAR],role.role.toLowerCase()))
                        {
                            reject({msg:C.BAD_REQUEST,status:400})
                        }
                        if(role.role.toLowerCase() == C.GLOBAL_MANAGER.toLowerCase() && role.groupId != C.NULL)
                        {
                            reject({msg:C.BAD_REQUEST,status:400})
                        }
                        if((role.role.toLowerCase() == C.MANAGER.toLowerCase() && role.groupId == null) || (role.role == C.MANAGER.toLowerCase() && role.groupId ==C.EMPTY))
                        {
                            reject({msg:C.BAD_REQUEST,status:400})
                        }
                        if((role.role.toLowerCase() == C.REGULAR.toLowerCase() && role.groupId == null) || (role.role == C.REGULAR.toLowerCase() && role.groupId == C.EMPTY))
                        {
                            reject({msg:C.BAD_REQUEST,status:400})
                        }
                        if((role.role == C.EMPTY && role.groupId != C.NULL) || (role.role == C.UNDEFINED && role.groupId != C.EMPTY))
                        {
                            reject({msg:C.BAD_REQUEST,status:400})
                        }
                        if(i == body.roles.length - 1)
                            resolve()
                    })
                }
            })

        },
        fetchRoles:  () => {
            return new Promise((resolve,reject)=>{
                rolesModal.find({deletedAt:null},(err,res)=>{
                    if(err)
                        reject(err)
                    else resolve(res)
                })
            })

        },
        fetchSpecificRoles:  (roles) => {

            return new Promise((resolve,reject)=>{
                rolesModal.find({
                    '_id': { $in: roles}
                }, (err, docs)=>{
                    if(err)
                        reject(err)
                    resolve(docs)
                });
            })

        },
        deleteRoles : (roles)=>{
            try{
                return new Promise((resolve,reject)=>{
                    asyncLoop(roles, async function (item, next)
                    {
                        rolesModal.findOneAndRemove({_id:item._id},(err,doc)=>{
                            if(!err)
                                next();
                        })

                    }, (err,res) => {
                        if(err){
                            reject({
                                status:501,
                                msg:"error while deleting roles"
                            })
                        }
                        resolve({status:204,msg:"roles deleted"})

                    })

                });

            }catch(err){
                process.logger.warn('error while creating roles');
            }

        },
        editRoles: (body)=>{
            try{
                let tempArray = [];
                return new Promise((resolve,reject)=>{
                asyncLoop(body.roles, async function (item, next)
                {

                    rolesModal.findOneAndUpdate({_id:item._id},{$set: item},{
                        new:true
                    },(err,doc)=>{
                        if(!err){
                            tempArray.push(doc);
                            next();
                        }
                    })

                }, (err,res) => {
                    if(err){
                        reject({
                        status:501,
                        msg:"error while updating roles"
                        })
                    }
                    resolve({status:204,roles:tempArray})

                    })

                });

            }catch(err){
                process.logger.warn('error while creating roles');
            }

        },

        createRoles: async (body)=>{
            try{
                return new Promise((resolve,reject)=>{
                    console.log(body)
                    rolesModal.insertMany(body.roles)
                        .then(function(mongooseDocuments) {
                            console.log("roles inserted")
                            resolve({"roles":_.pluck(mongooseDocuments,"_id")})
                        })
                        .catch(function(err) {
                            console.log(err)
                        });
                })

            }catch(err){
                process.logger.warn('error while creating roles');
            }

        }
    }

}

