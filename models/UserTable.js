module.exports = function(sequelize, DataTypes){
  var User = sequelize.define('User',{
    id:{type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: DataTypes.STRING,
    password: DataTypes.STRING
  },{
    underscored: true,
    tableName: 'user_table'

  });
  return User;
}