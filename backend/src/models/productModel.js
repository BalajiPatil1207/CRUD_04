const { DataTypes } = require('sequelize');
const sequelize = require('../config/sqliteDB');

const Product = sequelize.define('Product', {
    p_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: "Product name is required" }
        }
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            isDecimal: { msg: "Price must be a valid number" },
            min: { args: [0], msg: "Price cannot be negative" }
        }
    },
    smallDescription: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'products',
    timestamps: true
});

module.exports = Product;
