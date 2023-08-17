import express from 'express';
import GoferModel from '../models/gofersdb.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

//register as an gofer
router.post('/register', async(req,res)=>{
    bcrypt
    .hash(req.body.password, 10)
    .then((hashedPassword)=>{
        const gofer = new GoferModel({
            fname:req.body.fname,
            email:req.body.email,
            password:hashedPassword,
            phone : req.body.phone,
    
        });

        //save gofer
        gofer
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

//login as an gofer
// login endpoint
router.post("/login", (req, res) => {
    // check if email exists
    GoferModel.findOne({ email: req.body.email })
  
      // if email exists
      .then((gofer) => {
        // compare the password entered and the hashed password found
        bcrypt
          .compare(req.body.password, gofer.password)
  
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
                goferId: gofer._id,
                goferEmail: gofer.email,
              },
              "RANDOM-TOKEN",
              { expiresIn: "24h" }
            );
  
            //   return success response
            res.send({
              message: "Login Successful",
              email: gofer.email,
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
  





router.get('/list-of-gofers',async(req,res)=>{
    try{
        const findgofers =await GoferModel.find();
        res.json(findgofers)
    }catch(err){
        res.json({message:err})
    }
})


router.get('/:goferId',async(req,res)=>{
    try{
        const findgofer = await GoferModel.findById(req.params.goferId);
        res.json(findgofer)
    }catch(err){
        res.json({message:err})
    }
})


router.delete('/:goferId',async(req,res)=>{
    try{
        const removegofers = await GoferModel.deleteOne({_id:req.params.goferId});
        res.json(removegofers)
    }catch(err){
        res.json({message:err})
    }
})

router.patch('/:goferId',async(req,res)=>{
    try{
        const updategofer = await GoferModel.updateOne({_id:req.params.goferId}, {$set:{fname:req.body.fname}});
        res.json(updategofer)
    }catch(err){
        res.json({message:err})
    }
})






export default router;