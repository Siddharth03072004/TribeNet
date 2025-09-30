
import { DataTypes } from "sequelize";
import sequelize from '../utils/db.js' // adjust path to your sequelize instance
import User from './user.model.js'; // assuming you already have a User model

const ConnectionRequest = sequelize.define("ConnectionRequest", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER, // or UUID if your User PK is UUID
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
  connectionId: {
    type: DataTypes.INTEGER, // or UUID if your User PK is UUID
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
  status_accepted: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: null,
  },
});

// Associations
ConnectionRequest.belongsTo(User, { as: "user", foreignKey: "userId" });
ConnectionRequest.belongsTo(User, { as: "connection", foreignKey: "connectionId" });

export default ConnectionRequest;
