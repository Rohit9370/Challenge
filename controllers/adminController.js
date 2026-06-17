const { User, Store, Rating } = require("../models");
const { validationResult } = require("express-validator");
const { Op } = require("sequelize");

const getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.count({ where: { role: { [Op.ne]: "admin" } } });
    const totalStores = await Store.count();
    const totalRatings = await Rating.count();

    res.json({ totalUsers, totalStores, totalRatings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, address, role, storeId } = req.body;

  try {
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      address,
      role: role || "user",
      storeId: storeId || null,
    });

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      address: user.address,
      role: user.role,
      storeId: user.storeId,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createStore = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, address } = req.body;

  try {
    const storeExists = await Store.findOne({ where: { email } });
    if (storeExists) {
      return res.status(400).json({ message: "Store already exists" });
    }

    const store = await Store.create({ name, email, address });
    res.status(201).json(store);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStores = async (req, res) => {
  try {
    const { name, email, address, sortBy = "name", order = "ASC" } = req.query;

    const whereClause = {};
    if (name) whereClause.name = { [Op.iLike]: `%${name}%` };
    if (email) whereClause.email = { [Op.iLike]: `%${email}%` };
    if (address) whereClause.address = { [Op.iLike]: `%${address}%` };

    const stores = await Store.findAll({
      where: whereClause,
      attributes: {
        include: [
          [
            require("sequelize").literal(`(
              SELECT COALESCE(AVG(rating), 0)
              FROM "Ratings"
              WHERE "Ratings"."storeId" = "Store"."id"
            )`),
            "averageRating",
          ],
        ],
      },
      order: [[sortBy, order.toUpperCase()]],
    });

    res.json(stores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const { name, email, address, role, sortBy = "name", order = "ASC" } = req.query;

    const whereClause = {};
    if (name) whereClause.name = { [Op.iLike]: `%${name}%` };
    if (email) whereClause.email = { [Op.iLike]: `%${email}%` };
    if (address) whereClause.address = { [Op.iLike]: `%${address}%` };
    if (role) whereClause.role = role;

    const users = await User.findAll({
      where: whereClause,
      attributes: { exclude: ["password"] },
      order: [[sortBy, order.toUpperCase()]],
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserDetails = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password"] },
      include: [
        {
          model: Store,
          as: "ownedStore",
          attributes: {
            include: [
              [
                require("sequelize").literal(`(
                  SELECT COALESCE(AVG(rating), 0)
                  FROM "Ratings"
                  WHERE "Ratings"."storeId" = "ownedStore"."id"
                )`),
                "averageRating",
              ],
            ],
          },
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboard,
  createUser,
  createStore,
  getStores,
  getUsers,
  getUserDetails,
};
