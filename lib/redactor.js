module.exports = function (req, res, next) {
  if(req.method === 'PUT' || req.method === 'POST'){
    var description = req.body.description;

    var slang = {
      selfie: {reg: /selfie/i, replace: 'self-portrait'},
      yummers: {reg: /yummers/i, replace: 'delicious'},
      outchea: {reg: /outchea/i, replace: 'are out here'},
      bruh: {reg: /bruh/i, replace: 'wow'},
      doge: {reg:/doge/i, replace: 'pug'},
      cilantro: {reg: /cilantro/i, replace: 'soap'},
      bae: {reg: /bae/i, replace: 'loved one'},
      swag: {reg: /swag/i, replace: 'style'},
      yolo: {reg: /yolo/i, replace: 'carpe diem'}
    }
    if(description){
      for(var key in slang){
        description = description.replace(slang[key].reg, slang[key].replace);
      }
      req.body.description = description;
    }
  }

  next();
};