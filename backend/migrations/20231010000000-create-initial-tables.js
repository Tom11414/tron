const { DataTypes } = require('sequelize');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('MultisigWallets', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      address: {
        type: DataTypes.STRING(34),
        allowNull: false,
        unique: true
      },
      owners: {
        type: DataTypes.JSON,
        allowNull: false
      },
      threshold: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
      }
    });

    await queryInterface.createTable('Transactions', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      walletId: {
        type: DataTypes.UUID,
        references: {
          model: 'MultisigWallets',
          key: 'id'
        }
      },
      txHash: {
        type: DataTypes.STRING(66),
        allowNull: true
      },
      to: {
        type: DataTypes.STRING(34),
        allowNull: false
      },
      value: {
        type: DataTypes.STRING,
        allowNull: false
      },
      data: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      status: {
        type: DataTypes.ENUM('pending', 'executed', 'rejected'),
        defaultValue: 'pending'
      },
      signatures: {
        type: DataTypes.JSON,
        defaultValue: []
      },
      requiredSignatures: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
      }
    });

    await queryInterface.addIndex('Transactions', ['walletId']);
    await queryInterface.addIndex('Transactions', ['status']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Transactions');
    await queryInterface.dropTable('MultisigWallets');
  }
};
