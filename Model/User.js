const Sequelize=require('sequelize')
const sequelize=require('../Utiles/database.js')


//FEW PARAMETER ARE AUTOMATICALLY ADDD LIKE CREATED AT and Updated At ETC BY SEQUILIZER
const User=sequelize.define('User',{

    user_id:{
        
        type:Sequelize.INTEGER,
        required:true,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true

    },
    first_name:{

        type:Sequelize.STRING(50),
        required:true,

    },

    last_name:{

        type:Sequelize.STRING(50),
        required:true

    },
    email:{

        type:Sequelize.STRING(50),
        required:true,
        unique:true
    },

    // phone_number:{

    //     type:Sequelize.STRING,
    //     required:true,
    //     unique:true

    // },
    password:{

        type:Sequelize.STRING,
        required:true

    },
    gender:{
        type:Sequelize.ENUM("M","F")
    },
    dateOfBirth:{
        type:Sequelize.DATE
    }

})



module.exports=User;