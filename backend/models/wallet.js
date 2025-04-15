module.exports = (sequelize, DataTypes) => {
    const Wallet = sequelize.define('Wallet', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      address: {
        type: DataTypes.STRING(34),
        allowNull: false,
        unique: true,
        validate: {
          isTronAddress(value) {
            if (!/^T[a-zA-Z0-9]{33}$/.test(value)) {
              throw new Error('Invalid TRON address format');
            }
          }
        }
      },
      owners: {
        type: DataTypes.JSONB,
        allowNull: false,
        validate: {
          isValidOwners(value) {
            if (!Array.isArray(value) || value.length < 2) {
              throw new Error('At least 2 owners required');
            }
            value.forEach(addr => {
              if (!/^T[a-zA-Z0-9]{33}$/.test(addr)) {
                throw new Error(`Invalid owner address: ${addr}`);
              }
            });
          }
        }
      },
      threshold: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          isValidThreshold(value) {
            if (value > this.owners.length) {
              throw new Error('Threshold cannot exceed owner count');
            }
          }
        }
      },
      name: {
        type: DataTypes.STRING(100),
        defaultValue: 'My Multisig Wallet'
      },
      version: {
        type: DataTypes.STRING(10),
        defaultValue: '1.0'
      }
    }, {
      hooks: {
        beforeValidate: (wallet) => {
          if (wallet.owners) {
            wallet.owners = [...new Set(wallet.owners)]; // 去重
          }
        }
      }
    });
  
    Wallet.associate = (models) => {
      Wallet.hasMany(models.Transaction, {
        foreignKey: 'walletId',
        as: 'transactions'
      });
    };
  
    return Wallet;
  };
  