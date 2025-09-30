// models/profile.model.js
import { DataTypes, Model } from "sequelize";
import sequelize from "../utils/db.js"; // adjust path to your db config
import User from "./user.model.js"; // assuming you already have User model




class Profile extends Model {}

Profile.init(
  {
    bio: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    currentPost: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    pastWork: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
    education: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
  },
  {
    sequelize,
    modelName: "Profile",
    tableName: "profiles",
    timestamps: false,
  }
);

// associations
Profile.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasOne(Profile, { foreignKey: "userId", as: "profiles" });




export default Profile;
