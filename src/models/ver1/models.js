const { DataTypes, Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql'
    }
);

const ADM_Vehicle = sequelize.define(
    'ADM_Vehicle',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        engineHours: {
            type: DataTypes.TEXT
        },
        engineId: {
            type: DataTypes.TEXT
        },
        engineType: {
            type: DataTypes.TEXT
        },
        model: {
            type: DataTypes.TEXT
        },
        height: {
            type: DataTypes.DOUBLE
        },
        length: {
            type: DataTypes.DOUBLE
        },
        width: {
            type: DataTypes.DOUBLE
        },
        odometer: {
            type: DataTypes.DOUBLE
        },
        plate: {
            type: DataTypes.TEXT
        },
        tonnage: {
            type: DataTypes.DOUBLE
        },
        image: {
            type: DataTypes.TEXT
        },
        description: {
            type: DataTypes.TEXT
        },
        status: {
            type: DataTypes.TEXT
        }
    },
    {
        tableName: 'ADM_Vehicle',
        timestamps: true
    }
);

const ADM_User = sequelize.define(
    'ADM_User',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        phone: {
            type: DataTypes.TEXT
        },
        password: {
            type: DataTypes.TEXT
        },
        email: {
            type: DataTypes.TEXT
        },
        firstName: {
            type: DataTypes.TEXT
        },
        lastName: {
            type: DataTypes.TEXT
        },
        gender: {
            type: DataTypes.TEXT
        },
        dob: {
            type: DataTypes.TEXT
        },
        image: {
            type: DataTypes.TEXT
        },
        role: {
            type: DataTypes.TEXT
        },
        description: {
            type: DataTypes.TEXT
        },
        status: {
            type: DataTypes.TEXT
        }
    },
    {
        tableName: 'ADM_User',
        timestamps: true
    }
);

const ADM_Area = sequelize.define(
    'ADM_Area',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        acreage: {
            type: DataTypes.DOUBLE
        },
        description: {
            type: DataTypes.TEXT
        },
        status: {
            type: DataTypes.TEXT
        }
    },
    {
        tableName: 'ADM_Area',
        timestamps: true
    }
);

const ADM_Bin = sequelize.define(
    'ADM_Bin',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        latitude: {
            type: DataTypes.DOUBLE
        },
        longitude: {
            type: DataTypes.DOUBLE
        },
        address: {
            type: DataTypes.TEXT
        },
        heigth: {
            type: DataTypes.DOUBLE
        },
        length: {
            type: DataTypes.DOUBLE
        },
        width: {
            type: DataTypes.DOUBLE
        },
        maxWeight: {
            type: DataTypes.DOUBLE
        },
        color: {
            type: DataTypes.TEXT
        },
        material: {
            type: DataTypes.TEXT
        },
        brand: {
            type: DataTypes.TEXT
        },
        image: {
            type: DataTypes.TEXT
        },
        description: {
            type: DataTypes.TEXT
        },
        status: {
            type: DataTypes.TEXT
        },
        areaId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'ADM_Area',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        }
    },
    {
        tableName: 'ADM_Bin',
        timestamps: true
    }
);

const ADM_Task = sequelize.define(
    'ADM_Task',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        driverId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'ADM_User',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        vehicleId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'ADM_Vehicle',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        areaId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'ADM_Area',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        description: {
            type: DataTypes.TEXT
        },
        status: {
            type: DataTypes.TEXT
        }
    },
    {
        tableName: 'ADM_Task',
        timestamps: true
    }
);

const LOG_Bin_State = sequelize.define(
    'LOG_Bin_State',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        latitude: {
            type: DataTypes.DOUBLE
        },
        longitude: {
            type: DataTypes.DOUBLE
        },
        weight: {
            type: DataTypes.DOUBLE
        },
        description: {
            type: DataTypes.TEXT
        },
        status: {
            type: DataTypes.TEXT
        },
        binId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'ADM_Bin',
                key: 'id'
            }
        }
    },
    {
        tableName: 'LOG_Bin_State',
        timestamps: true
    }
);

const LOG_Vehicle_Work = sequelize.define(
    'LOG_Vehicle_Work',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        latitude: {
            type: DataTypes.DOUBLE
        },
        longitude: {
            type: DataTypes.DOUBLE
        },
        altitude: {
            type: DataTypes.DOUBLE
        },
        speed: {
            type: DataTypes.DOUBLE
        },
        angle: {
            type: DataTypes.DOUBLE
        },
        odometer: {
            type: DataTypes.DOUBLE
        },
        engineHours: {
            type: DataTypes.DOUBLE
        },
        fuel: {
            type: DataTypes.DOUBLE
        },
        description: {
            type: DataTypes.TEXT
        },
        status: {
            type: DataTypes.TEXT
        },
        vehicleId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'ADM_Vehicle',
                key: 'id'
            }
        },
        driverId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'ADM_User',
                key: 'id'
            }
        },
        binStateId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'LOG_Bin_State',
                key: 'id'
            }
        }
    },
    {
        tableName: 'LOG_Vehicle_Work',
        timestamps: true
    }
);

const SUP_Vehicle_State = sequelize.define(
    'SUP_Vehicle_State',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        latitude: {
            type: DataTypes.DOUBLE
        },
        longitude: {
            type: DataTypes.DOUBLE
        },
        altitude: {
            type: DataTypes.DOUBLE
        },
        speed: {
            type: DataTypes.DOUBLE
        },
        angle: {
            type: DataTypes.DOUBLE
        },
        state: {
            type: DataTypes.TEXT
        },
        description: {
            type: DataTypes.TEXT
        },
        status: {
            type: DataTypes.TEXT
        },
        vehicleId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'ADM_Vehicle',
                key: 'id'
            }
        },
        driverId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'ADM_User',
                key: 'id'
            }
        }
    },
    {
        tableName: 'SUP_Vehicle_State',
        timestamps: true
    }
);

const SUP_Vehicle_Position = sequelize.define(
    'SUP_Vehicle_Position',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        latitude: {
            type: DataTypes.DOUBLE
        },
        longitude: {
            type: DataTypes.DOUBLE
        },
        vehicleId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'ADM_Vehicle',
                key: 'id'
            }
        }
    },
    {
        tableName: 'SUP_Vehicle_Position',
        timestamps: true
    }
);

const SUP_Vehicle_Trouble = sequelize.define(
    'SUP_Vehicle_Trouble',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        latitude: {
            type: DataTypes.DOUBLE
        },
        longitude: {
            type: DataTypes.DOUBLE
        },
        altitude: {
            type: DataTypes.DOUBLE
        },
        speed: {
            type: DataTypes.DOUBLE
        },
        angle: {
            type: DataTypes.DOUBLE
        },
        fuel: {
            type: DataTypes.DOUBLE
        },
        trouble: {
            type: DataTypes.TEXT
        },
        description: {
            type: DataTypes.TEXT
        },
        status: {
            type: DataTypes.TEXT
        },
        vehicleId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'ADM_Vehicle',
                key: 'id'
            }
        },
        driverId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'ADM_User',
                key: 'id'
            }
        }
    },
    {
        tableName: 'SUP_Vehicle_Trouble',
        timestamps: true
    }
);

async function createDB() {
    await sequelize.sync({ force: true });
    console.log('All models were synchronized successfully.');
}

module.exports = {
    createDB,
    ADM_Vehicle,
    ADM_User,
    ADM_Area,
    ADM_Bin,
    ADM_Task,
    LOG_Bin_State,
    LOG_Vehicle_Work,
    SUP_Vehicle_State,
    SUP_Vehicle_Position,
    SUP_Vehicle_Trouble
};
