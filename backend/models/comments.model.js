import { DataTypes, Model } from "sequelize";
import sequelize from "../utils/db.js";
import User from "./user.model.js";
import Post from "./posts.model.js";

const CommentSchema = sequelize.define('Comment', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    postId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Post,
            key: 'id',
        },
        onDelete: 'CASCADE',
    }, 
    body: {
        type: DataTypes.TEXT,
        allowNull: false,
    }
}, {
    timestamps: true,
    tableName: 'comments',
});

// Define associations
CommentSchema.belongsTo(User, { foreignKey: 'userId', as: 'user' });
CommentSchema.belongsTo(Post, { foreignKey: 'postId', as: 'post' });
User.hasMany(CommentSchema, { foreignKey: 'userId', as: 'comments' });
Post.hasMany(CommentSchema, { foreignKey: 'postId', as: 'comments' });

export default CommentSchema;