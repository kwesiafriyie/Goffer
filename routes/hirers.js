import express from 'express';
import HirerModel from '../models/hirersdb.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

//register as an hirer
router.post('/register', async(req,res)=>{
    bcrypt
    .hash(req.body.password, 10)
    .then((hashedPassword)=>{
        const hirer = new HirerModel({
            fname:req.body.fname,
            email:req.body.email,
            password:hashedPassword,
            phone : req.body.phone,
    
        });

        //save hirer
        hirer
            .save()
            //return succes if user was added to db
            .then((result)=>{
                res.send({
                    message:"User created",
                    result,
                })
                console.log(req.body.fname);
            })


            .catch((err)=>{
                res.send({
                    message:"Error creating user",
                    err,
                })
            })
    })


    .catch((e)=>{
        res.send({
            message:"Password wasn't hashed",
            e
        })
    })
   
  
});

//login as an hirer
// login endpoint
router.post("/login", (req, res) => {
    // check if email exists
    HirerModel.findOne({ email: req.body.email })
  
      // if email exists
      .then((hirer) => {
        // compare the password entered and the hashed password found
        bcrypt
          .compare(req.body.password, hirer.password)
  
          // if the passwords match
          .then((passwordCheck) => {
  
            // check if password matches
            if(!passwordCheck) {
              return res.send({
                message: "Passwords does not match",
                error,
              });
            }
  
            //   create JWT token
            const token = jwt.sign(
              {
                hirerId: hirer._id,
                hirerEmail: hirer.email,
              },
              "RANDOM-TOKEN",
              { expiresIn: "24h" }
            );
  
            //   return success response
            res.send({
              message: "Login Successful",
              email: hirer.email,
              token,
            });
          })
          // catch error if password does not match
          .catch((error) => {
            res.send({
              message: "Passwords does not match",
              error,
            });
          });
      })
      // catch error if email does not exist
      .catch((e) => {
        res.send({
          message: "Email not found",
          e,
        });
      });
  });
  





router.get('/list-of-hirers',async(req,res)=>{
    try{
        const findhirers =await HirerModel.find();
        res.json(findhirers)
    }catch(err){
        res.json({message:err})
    }
})


router.get('/:hirerId',async(req,res)=>{
    try{
        const findhirer = await HirerModel.findById(req.params.hirerId);
        res.json(findhirer)
    }catch(err){
        res.json({message:err})
    }
})


router.delete('/:hirerId',async(req,res)=>{
    try{
        const removehirers = await HirerModel.deleteOne({_id:req.params.hirerId});
        res.json(removehirers)
    }catch(err){
        res.json({message:err})
    }
})

router.patch('/:hirerId',async(req,res)=>{
    try{
        const updatehirer = await HirerModel.updateOne({_id:req.params.hirerId}, {$set:{fname:req.body.fname}});
        res.json(updatehirer)
    }catch(err){
        res.json({message:err})
    }
})

export default router;