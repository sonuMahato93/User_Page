const mongoose = require("mongoose");



const validateEmail = function(email) {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email)
};
 


const memberSchema = new mongoose.Schema(
  {
    // googleId: {
    //   type: String,
    //   required: true,
    // },
    firstname: {
      type: String,
      lowercase: true,
      trim: true,
      index: true,
      maxlength: 32,
    },
    lastname: {
      type: String,
      lowercase: true,
      trim: true,
      index: true,
      maxlength: 32,
    },

    gender: {
      type: String,
      enum: ["Male", "Female"],
    },
    address: {
      pinCode: {
        type: Number,
        require: true,
        trim: true,
      },
      district: {
        type: String,
        require: true,
        trim: true,
      },
      state: {
        type: String,
        require: true,
        trim: true,
      },
    },
    whatsAppNumber: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    // mobileNumber: {
    //   type: String,
    //  // require: true,
    //   unique: true,
    //   trim: true,
    // },

    // email: {
    //   type: String,
    //   unique: true,
    //   sparse: true,
    //   trim: true,
    //   lowercase: true,
    // },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      //required: 'Email address is required',
      validate: [validateEmail,  'Please fill a valid email address'],
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },

    isActive: {
      type: Boolean,
      default: true,
    },
    guardianNumber: {
      type: Number,
      unique: true,
      sparse: true,
      trim: true,
    },
    subscription: {
      type: String,
    },
    profileImage: {
      data: Buffer,
      contentType: String,
    },
  
    occupation: {
      type: String,
      lowercase: true,
      index: true,
      maxlength: 32,
      trim: true,
    },
    password:{
        type:String,
       // required:true
     },
     confirmPassword:{
      type:String,
      //required:true
   },
  },
  { timestamps: true }
);

const memberDetails = mongoose.model("memberDetails", memberSchema);
module.exports = memberDetails;
