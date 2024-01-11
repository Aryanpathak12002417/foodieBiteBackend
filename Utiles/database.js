const Sequilize=require('sequelize');

const sequelize=new Sequilize(process.env.DATABASE,process.env.USER,process.env.PASSWORD,{
    host:process.env.HOST,
    dialect:'mysql'
})

module.exports=sequelize;