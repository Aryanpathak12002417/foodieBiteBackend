const Sequilizer=require('sequelize')
const sequelize=require('../Utiles/database')
const Dishes = require('./Dishes')

const Menu=sequelize.define('Menu',{

    date:{

        type:Sequilizer.DATEONLY,
        allowNull:false

    },
    time:{

        type:Sequilizer.STRING,
        allowNull:false
        
    },
    dish_id: {
        
        type: Sequilizer.INTEGER,
        allowNull: false,
        references: {
            model: Dishes,
            key: 'dish_id',
            onDelete: 'CASCADE'
        }
    }
},{
    timestamps: false,
    primaryKey: false 
})


Menu.belongsTo(Dishes, { foreignKey: 'dish_id' });

module.exports=Menu