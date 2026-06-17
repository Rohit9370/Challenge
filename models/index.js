const sequelize = require("../config/db");
const User = require("./User");
const Store = require("./Store");
const Rating = require("./Rating");

// Associations
Store.hasMany(Rating, { foreignKey: "storeId", onDelete: "CASCADE" });
Rating.belongsTo(Store, { foreignKey: "storeId" });

User.hasMany(Rating, { foreignKey: "userId", onDelete: "CASCADE" });
Rating.belongsTo(User, { foreignKey: "userId" });

Store.hasOne(User, { foreignKey: "storeId", as: "owner" });
User.belongsTo(Store, { foreignKey: "storeId", as: "ownedStore" });

module.exports = { sequelize, User, Store, Rating };
