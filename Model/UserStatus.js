const Sequelize=require('sequelize')
const sequelize=require('../Utiles/database.js')
const User=require('../Model/User.js')


const userStatus=sequelize.define('tbluserstatus',{

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
    status:{
        type:Sequelize.BOOLEAN,
        allowNull:false,
        default:false
    },
    emailVerfied:{
        type:Sequelize.BOOLEAN,
        allowNull:false,
        default:false
    },
    phoneVerfied:{
        type:Sequelize.BOOLEAN,
        allowNull:false,
        default:false
    },
    mealPlain:{
        type:Sequelize.STRING,
        allowNull:true
    }

})

userStatus.belongsTo(User,{foreignKey:'user_id'})


module.exports=userStatus