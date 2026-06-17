const { Rating, User, Store } = require("../models");
const sequelize = require("../config/db");

const getDashboard = async (req, res) => {
  try {
    if (!req.user.storeId) {
      return res.status(400).json({ message: "User is not a store owner" });
    }

    const ratings = await Rating.findAll({
      where: { storeId: req.user.storeId },
      include: [
        {
          model: User,
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const averageRating = await Rating.findOne({
      where: { storeId: req.user.storeId },
      attributes: [[sequelize.fn("AVG", sequelize.col("rating")), "average"]],
      raw: true,
    });

    res.json({
      averageRating: averageRating?.average || 0,
      ratings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboard };
