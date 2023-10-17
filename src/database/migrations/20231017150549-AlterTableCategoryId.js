"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.addColumn("products", "category_id", {
      type: Sequelize.INTEGER,
      references: {
        model: "categories",
        key: "id",
      },
    });
    await queryInterface.removeColumn("categories", "product_id");
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn("products", "category_id");
    await queryInterface.addColumn("categories", "product_id", {
      type: Sequelize.INTEGER,
      references: {
        model: {
          tableName: "products",
        },
        key: "id",
      },
    });
  },
};
