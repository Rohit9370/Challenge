const { Store, Rating, User } = require("../models");
const { validationResult } = require("express-validator");
const { Op } = require("sequelize");

const getStores = async (req, res) => {
  try {
    const { name, address, sortBy = "name", order = "ASC" } = req.query;

    const whereClause = {};
    if (name) whereClause.name = { [Op.iLike]: `%${name}%` };
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

    const storesWithUserRating = await Promise.all(
      stores.map(async (store) => {
        const userRating = await Rating.findOne({
          where: { storeId: store.id, userId: req.user.id },
        });
        return {
          ...store.toJSON(),
          userRating: userRating ? userRating.rating : null,
        };
      })
    );

    res.json(storesWithUserRating);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const submitRating = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { storeId, rating } = req.body;

  try {
    const store = await Store.findByPk(storeId);
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    const [ratingRecord, created] = await Rating.findOrCreate({
      where: { userId: req.user.id, storeId },
      defaults: { userId: req.user.id, storeId, rating },
    });

    if (!created) {
      ratingRecord.rating = rating;
      await ratingRecord.save();
    }

    res.json({
      message: created ? "Rating submitted successfully" : "Rating updated successfully",
      rating: ratingRecord,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getStores, submitRating };
