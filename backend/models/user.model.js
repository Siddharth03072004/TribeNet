// models/user.model.js
import { DataTypes } from "sequelize";
import sequelize from "../utils/db.js";

const User = sequelize.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notEmpty: true },
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { notEmpty: true },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  profilePicture: {
    type: DataTypes.STRING,
    defaultValue: "default.jpg",
  },
  token: {
    type: DataTypes.STRING,
    defaultValue: "",
  },
}, {
  timestamps: true, // this adds createdAt & updatedAt automatically
});

export default User;
