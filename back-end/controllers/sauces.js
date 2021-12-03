const Sauce = require('../models/sauce');
const UserId = require('../middleware/auth');
const fs = require('fs');

//Renvoie la sauce séléctionnée.
exports.sauceId = (req,res,next) =>{
    Sauce.findOne({_id: req.params.id})
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(400).json({ error }))
  };

//Renvoie toutes les sauces.
exports.getSauces = (req,res,next) =>{
    Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }))
  };
  const regex = /^[a-zA-Z0-9 _.,!()&]+$/;
//Ajoute une sauce.
exports.postSauces = (req,res,next) =>{
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    if (
      !regex.test(sauceObject.name) ||
      !regex.test(sauceObject.manufacturer) ||
      !regex.test(sauceObject.description) ||
      !regex.test(sauceObject.mainPepper) ||
      !regex.test(sauceObject.heat)
    ) {
      return res
        .status(500)
        .json({ error: "Un où plusieurs champs sont invalides" });
    }else{
    const sauce = new Sauce ({
      ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    sauce.save()
    res.status(201).json({message: "Sauce ajouté"})
  };
}
  //Modifie une sauce séléctionné.
  exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
      {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      } : { ...req.body };
      if (
        !regex.test(sauceObject.name) ||
        !regex.test(sauceObject.manufacturer) ||
        !regex.test(sauceObject.description) ||
        !regex.test(sauceObject.mainPepper) ||
        !regex.test(sauceObject.heat)
      ) {
        return res
          .status(500)
          .json({ error: "Un où plusieurs champs sont invalides" });
      }else{
          Sauce.updateOne({ _id: req.params.id, userId: req.userId }, { ...sauceObject, _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Objet modifié !'}))
            .catch(error => res.status(400).json({ error }));
  };
}

  //Supprime une sauce.
  exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(thing => {
        const filename = thing.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
            .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error }));
  };

  //Logique permettant de liker ou disliker une sauce.
  exports.likeSauce = (req,res,next) => {
    let like = req.body.like;
    //Récupère la sauce
      Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        if (sauce.usersLiked.includes(req.body.userId)) { 
          Sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } })
              .then((sauce) => { res.status(200).json({ message: 'Like supprimé' }) })
              .catch(error => res.status(400).json({ error }));

        } else if (sauce.usersDisliked.includes(req.body.userId)) {
            Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 } })
              .then((sauce) => { res.status(200).json({ message: 'Dislike supprimé' }) })
              .catch(error => res.status(400).json({ error }));
        }
      }) 
      //Incrémente 1 dans like et ajoute l'userId dans usersLiked
      .then(() => {if (like == 1){
    Sauce.updateOne({_id: req.params.id},
      {$push: {usersLiked: req.body.userId}, $inc:{likes: 1}})
      .then(() => res.status(200).json({ message: 'Like ajouté' }))
      .catch((error) => res.status(400).json({ error }));
    //Incrémente 1 dans dislike et ajoute l'userId dans usersDisliked.
    }else if (like == -1){
      Sauce.updateOne({ _id: req.params.id },
        { $push: { usersDisliked: req.body.userId }, $inc: { dislikes: 1 }})
        .then(() => res.status(200).json({ message: 'Dislike ajouté' }))
        .catch((error) => res.status(400).json({ error }));}    
  })
  .catch(error => res.status(400).json({ error }));
  
}

