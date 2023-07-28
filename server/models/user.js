import { model, Schema } from "mongoose";


const UserSchema = new Schema({
  user_id: String,
  username: {
    type: String,
    unique: true,
    required: true
  },

  password: {
    type: String,
    required: true,
    min: [6, 'password should be at least 6 character'],
  }
},

  { timestamps: true }
);

export default model('User', UserSchema);

