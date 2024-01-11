const Sequilizer=require('sequelize')
const sequelize=require('../Utiles/database')

const Dishes=sequelize.define('Dishes',{

    dish_id:{
        type:Sequilizer.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },
    name:{
        type:Sequilizer.STRING,
        allowNull:false
    },
    imageID:{
        type:Sequilizer.STRING,
        allowNull:false
    },
    imageUrl:{
        type:Sequilizer.STRING,
        allowNull:false
    },
    description:{
        type:Sequilizer.STRING,
        allowNull:false
    }

})


module.exports=Dishes