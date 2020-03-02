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
    var user = lib.user;

    router.get('/getUsers', async (req, res) => {

        process.logger.info("user info");
        let users = await user.getUsres();
       res.json(users);

    });

    router.post('/create', (req, res) => {
        user.createUser(req.body)
            .then((resp)=>{
                process.logger.info("user create succeeded");
                res.json({
                    status:201,
                    results:resp
                })
            })
            .catch((err)=>{
                process.logger.info("user create failed");
                res.json({
                    err:err
                })
            })

    });

    router.put('/edit', (req, res) => {

        user.editUser(req.body)
            .then((resp)=>{
                process.logger.info("user edit succeeded");
                res.json({
                    status:204,
                    results:resp
                })
            })
            .catch((err)=>{
                process.logger.info("user edit failed");
                res.json({
                    err:err
                })
            })

    });

    router.delete('/delete', (req, res) => {
        console.log("user delete")
        console.log(req.body)
        user.deleteUser(req.body)
            .then((resp)=>{
                res.json(resp)
                process.logger.info("user delete succeeded");
            })
            .catch((err)=>{
                process.logger.info("user delete failed");
                res.json({
                    status:501,
                    err:err
                })
            })

    });

    router.get('/get',async (req, res) => {

        let users = await user.getUsres();
        process.logger.info("user get call succeeded");
        res.json({
            status:200,
            results:users
        })

    });

    router.post('/logout', async (req, res) => {

        try{
            console.log("logout called");
            console.log(req.body)
            let logout = await user.logOutUser(req.body);
            process.logger.info("user logout succeeded");
            res.json(logout)
        }catch(err){
            process.logger.warn(err);
            throw err
        }

    });

    router.post('/flag', async (req, res) => {
            console.log("duniyaa")
        console.log(req.body)
        if(req.body.app == "all"){
            let resp = await user.editAllFlag(req.body);
            console.log("res isccc ")
            console.log(resp)
            res.json(resp)
        }else {
            let resp = await user.editUserFlag(req.body);
            console.log("res isccc ")
            console.log(resp)
            res.json(resp)
        }

    });


    router.get('/token', async (req, res) => {
        res.send("check token")
    });
    return router;
};