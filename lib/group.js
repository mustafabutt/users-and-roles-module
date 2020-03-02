/*
##################################################################
-- Name              : group.js
-- Creation Date     :
-- Author            :Mustafa
##################################################################
*/

"use strict";
const request = require('request');
let asyncLoop = require('node-async-loop');
let async = require('async');
let rolesLayer = require("../middleware/roles")();
module.exports = (modals) => {

    const groupModel = modals.group;
    var async = require('async');

    return {

        getGroups : async () => {
            return new Promise((resolve,reject)=>{
                groupModel.find((err,res)=>{
                    if(err)
                        reject(err)
                    else resolve(res)
                })
            })

        },
        createGroup : async (body) => {

            let tempGroup = {"name":body.name,"collectionIds":body.collectionIds}
            const user = new groupModel(tempGroup)
            return await user.save();

        },

        editGroup : (body) => {

            return new Promise( (resolve,reject)=>{
                let tempGroup = {"name":body.name,"collectionIds":body.collectionIds}

                groupModel.findOneAndUpdate({"_id":body._id},{$set: tempGroup},{new:true},(err,res)=>{
                    if(err){
                        reject(err)
                    }
                    else {
                        resolve(res)
                    }
                })
            })


        },
        deleteGroup : (body) => {
            return new Promise((resolve,reject)=>{
                groupModel.findOneAndDelete({_id:body._id},(err,res)=>{
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
            })

        },

    }
};
