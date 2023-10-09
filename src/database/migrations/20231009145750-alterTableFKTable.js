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

    await queryInterface.addConstraint("users", {
      type: "foreign key",
      name: "fk_users_merchant",
      fields: ["merchant_id"],
      references: {
        table: "merchants",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });

    await queryInterface.addConstraint("products", {
      type: "foreign key",
      name: "fk_products_document",
      fields: ["document_id"],
      references: {
        table: "documents",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });

    await queryInterface.addConstraint("carts", {
      type: "foreign key",
      name: "fk_carts_user",
      fields: ["user_id"],
      references: {
        table: "users",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });

    await queryInterface.addConstraint("cart_details", {
      type: "foreign key",
      name: "fk_cart_details_cart",
      fields: ["cart_id"],
      references: {
        table: "carts",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });

    await queryInterface.addConstraint("cart_details", {
      type: "foreign key",
      name: "fk_cart_details_product",
      fields: ["product_id"],
      references: {
        table: "products",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });

    await queryInterface.addConstraint("transactions", {
      type: "foreign key",
      name: "fk_transactions_user",
      fields: ["user_id"],
      references: {
        table: "users",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });

    await queryInterface.addConstraint("transactions", {
      type: "foreign key",
      name: "fk_transactions_merchant",
      fields: ["merchant_id"],
      references: {
        table: "merchants",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });

    await queryInterface.addConstraint("transaction_details", {
      type: "foreign key",
      name: "fk_transaction_details_product",
      fields: ["product_id"],
      references: {
        table: "products",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });

    await queryInterface.addColumn("transaction_details", "transaction_id", {
      type: Sequelize.INTEGER,
    });

    await queryInterface.addConstraint("transaction_details", {
      type: "foreign key",
      name: "fk_transaction_details_transaction",
      fields: ["transaction_id"],
      references: {
        table: "transactions",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });

    await queryInterface.addColumn("users", "picture_id", {
      type: Sequelize.INTEGER,
    });

    await queryInterface.addConstraint("users", {
      type: "foreign key",
      name: "fk_users_picture",
      fields: ["picture_id"],
      references: {
        table: "documents",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.removeConstraint("users", "fk_users_merchant");
    await queryInterface.removeConstraint("products", "fk_products_document");
    await queryInterface.removeConstraint("carts", "fk_carts_user");
    await queryInterface.removeConstraint(
      "cart_details",
      "fk_cart_details_cart"
    );
    await queryInterface.removeConstraint(
      "cart_details",
      "fk_cart_details_product"
    );
    await queryInterface.removeConstraint(
      "transactions",
      "fk_transactions_user"
    );
    await queryInterface.removeConstraint(
      "transactions",
      "fk_transactions_merchant"
    );
    await queryInterface.removeConstraint(
      "transaction_details",
      "fk_transaction_details_product"
    );
    await queryInterface.removeColumn("transaction_details", "transaction_id");
    await queryInterface.removeConstraint(
      "transaction_details",
      "fk_transaction_details_transaction"
    );
    await queryInterface.removeColumn("users", "picture_id");
  },
};
