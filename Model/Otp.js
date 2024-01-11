const Sequilizer=require('sequelize');
const sequelizer=require('../Utiles/database.js')

const Otp=sequelizer.define('Otp',{

    loginid:{
        type:Sequilizer.STRING,
        require:true,
        unique:true
    },
    otp:{
        type:Sequilizer.INTEGER,
        require:true
    }
},{
    timestamps: false,
    underscored: true, 
    primaryKey: false
})


module.exports=Otp;