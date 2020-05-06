const express = require('express');
const router = express.Router();
const Account = require('../models/account');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const isEmpty = (string) => {
    if (string.trim() === "") return true;
        else return false;
    };
const isEmail = (email) => {
    const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.match(emailRegEx)) return true;
    else return false;
};
const isLogin = (req,res,next) => {
    if(req.account) {
        next();
    } 
    else {
        return res.status(400).json({message : "You're not authorized."})
    }
}
router.route('/').get((req, res) => {
    Account.find()
        .then(accounts => res.status(200).json(accounts))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/register').post((req,res)=>{
    if(!isEmpty(req.body.firstName) && !isEmpty(req.body.lastName) && !isEmpty(req.body.email) && !isEmpty(req.body.password)){
        if(isEmail(req.body.email)){
            Account.findOne({email : req.body.email})
            .then(response => {
                if(response){
                    return res.status(400).json({message : "Email already used, please try again."})
                }
                else {
                    newAccount = new Account({
                        firstName : req.body.firstName,
                        lastName : req.body.lastName,
                        email : req.body.email,
                        password : req.body.password,
                        joinedDate : Date.now()
                    })
                    newAccount.password = bcrypt.hashSync(req.body.password,10);
                    newAccount.save()
                    .then(response=> {
                        if(response) {
                            return res.status(200).json({message : "Account created successfully, please log in."});
                        }
                    })
                    .catch(err => {
                        return res.status(500).json({message : "Oops, we're sorry but it appears that something went wrong."});
                    })
                }
            })
            .catch(err=>{
                return res.status(500).json({message : "Oops, we're sorry but it appears that something went wrong."});
            })
        }
        else {
            return res.status(400).json({msg : "Please enter a valid email address."});
        }
    }
    else {
        return res.status(400).json({msg : "All fields are required, please try again."})
    }
})
router.route('/login').post((req,res)=>{
    Account.findOne({email : req.body.email})
    .then(response=>{
        if(!response){
            return res.status(400).json({message : "There is no account with the email you entered, please try again"});
        }
        else if(response){
            if(!response.comparePassword(req.body.password,response.password))
            {
                return res.status(400).json({message : "You have entered wrong credentials, please try again."})
            }
            else {
                return res.status(200).json({token : jwt.sign({email : response.email}, "Authentication")})
            }
        }
    })
    .catch(err=> {
        console.log(err);
        return res.status(500).json({message : "Oops, we're sorry but it appears that something went wrong."})
    })
})
module.exports = router;