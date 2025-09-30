// models/posts.model.js
import { DataTypes, Model } from "sequelize";
import sequelize from "../utils/db.js";
import User from "./user.model.js"; // import User to define association

class Post extends Model {}

Post.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, // safer for distributed IDs
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
       references: {
        model: "Users", // table name (Sequelize pluralizes 'User')
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    
      
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    media: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    fileType: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
  },
  {
    sequelize,
    modelName: "Post",
    tableName: "Posts", // table name in DB
    timestamps: true,   // createdAt & updatedAt auto-created
  }
);

// Associations
Post.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasMany(Post, { foreignKey: "userId", as: "posts" });

export default Post;
