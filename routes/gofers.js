import express from 'express';
import GoferModel from '../models/gofersdb.js';
import ErrandModel from '../models/errandb.js';
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
        
        res.send({
          message:"User updated",
         
      })
    }catch(err){
        res.json({message:err})
    }
})






// Gofer accepts an errand
router.patch('/accept-errand/:errandId', async (req, res) => {
  try {
    const token = req.header('Authorization');
    const decodedToken = jwt.verify(token, 'RANDOM-TOKEN'); // Replace with your actual JWT secret

    if (!decodedToken.goferId) {
      return res.status(401).json({
        message: 'Unauthorized: Gofer ID not found in token',
      });
    }

    const goferId = decodedToken.goferId;
    const errandId = req.params.errandId;

    // Check if the errand exists and is pending
    const errand = await ErrandModel.findById(errandId);
    if (!errand || errand.status !== 'pending') {
      return res.status(404).json({
        message: 'Errand not found or not in pending state',
      });
    }

    // Update the errand's gofer and status
    errand.gofer = goferId;
    errand.status = 'accepted';
    const acceptedErrand = await errand.save();

    res.json({
      message: 'Errand accepted by gofer',
      errand: acceptedErrand,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error accepting errand',
      error: error.message,
    });
  }
});





// List all errands accepted by a gofer
router.get('/accepted-errands', async (req, res) => {
  try {
    const token = req.header('Authorization');
    const decodedToken = jwt.verify(token, 'RANDOM-TOKEN'); // Replace with your actual JWT secret

    if (!decodedToken.goferId) {
      return res.status(401).json({
        message: 'Unauthorized: Gofer ID not found in token',
      });
    }

    const goferId = decodedToken.goferId;

    // Find all errands accepted by the gofer
    const acceptedErrands = await ErrandModel.find({ gofer: goferId });
    
    res.json({
      message: 'List of errands accepted by the gofer',
      errands: acceptedErrands,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error listing accepted errands',
      error: error.message,
    });
  }
});






export default router;