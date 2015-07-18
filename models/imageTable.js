// var TABLE_NAME = 'users';
module.exports = function(sequelize, DataTypes){
  var Picture = sequelize.define('Picture',{
    id: {type : DataTypes.INTEGER,
    primaryKey : true,
    autoIncrement : true
     },
    author: DataTypes.STRING,
    link: DataTypes.STRING,
    description: DataTypes.STRING
  },{
    underscored: true,
    tableName: 'image_table'
  });
  return Picture;
}