/*
##################################################################
-- Name              :
-- Description       :
-- Creation Date     :
-- Author            :
-- Reviewer          :
##################################################################
*/

"use strict";

module.exports = (app, lib) => {
    var router = app.Router();
    var group = lib.group;

    router.get('/get', async (req, res) => {
        let groups = await group.getGroups();
        res.json({
            status:200,
            results:groups
        })
    });

    router.post('/create', (req, res) => {
        group.createGroup(req.body)
            .then((resp)=>{
                process.logger.info("group create failed");
                res.json({
                    status:201,
                    results:resp
                })
            })
            .catch((err)=>{
                process.logger.info("group create failed");
                res.json({
                    err:err
                })
            })

    });

    router.put('/edit', (req, res) => {

        group.editGroup(req.body)
            .then((resp)=>{
                process.logger.info("group edit succeeded");
                res.json({
                    status:204,
                    results:resp
                })
            })
            .catch((err)=>{
                process.logger.info("group edit failed");
                res.json({
                    err:err
                })
            })

    });

    router.delete('/delete', (req, res) => {

        group.deleteGroup(req.body)
            .then((resp)=>{
                res.json(resp)
                process.logger.info("group delete succeeded");
            })
            .catch((err)=>{
                process.logger.info("group delete failed");
                res.json({
                    status:501,
                    err:err
                })
            })

    });



    return router;
};