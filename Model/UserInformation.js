const Sequelize=require('sequelize')
const sequelize=require('../Utiles/database.js')
const User=require('../Model/User.js')

const userInformation=sequelize.define('tbluserinformation',{

    user_id:{
        
        type:Sequelize.INTEGER,
        allowNull:false,
        primaryKey:true,
        references:{
            model:User,
            key:'user_id',
            OnDelete:'CASCADE'
        }
    },
    address:{
        type:Sequelize.STRING,
        allowNull:false
    },
    city:{
        type:Sequelize.STRING,
        allowNull:false
    },
    state:{
        type:Sequelize.STRING,
        allowNull:false
    },
    pincode:{
        type:Sequelize.INTEGER(6),
        allowNull:false
    },
    preffBrkfastHrs:{
        type:Sequelize.TIME,
        allowNull:false,
        default:'08:00:00'
    },
    preffLunchHrs:{
        type:Sequelize.TIME,
        allowNull:false,
        default:'13:00:00'
    },
    preffDinnerHrs:{
        type:Sequelize.TIME,
        allowNull:false,
        default:'20:00:00'
    }

})

userInformation.belongsTo(User,{foreignKey:'user_id'})

module.exports=userInformation