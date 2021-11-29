const Sauce = require('../models/sauce');
const UserId = require('../middleware/auth');
const fs = require('fs');


exports.sauceId = (req,res,next) =>{
    Sauce.findOne({_id: req.params.id})
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(400).json({ error }))
  };

exports.getSauces = (req,res,next) =>{
    Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }))
  };

exports.postSauces = (req,res,next) =>{
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce ({
      ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    sauce.save()
    //console.log(req.body.sauce);
    res.status(201).json({message: "Sauce ajouté"})
  };

  exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
      {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id, userId: req.userId }, { ...sauceObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet modifié !'}))
      .catch(error => res.status(400).json({ error }));
  }
  ;

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

  exports.likeSauce = (req,res,next) => {
    let like = req.body.like;

    if (like == 1){
    Sauce.updateOne({_id: req.params.id},
      {$push: {usersLiked: req.body.userId}, $inc:{likes: 1}})
      .then(() => res.status(200).json({ message: 'Like ajouté' }))
      .catch((error) => res.status(400).json({ error }));

    }else if (like == -1){
      Sauce.updateOne({ _id: req.params.id },
        { $push: { usersDisliked: req.body.userId }, $inc: { dislikes: 1 }})
        .then(() => res.status(200).json({ message: 'Dislike ajouté' }))
        .catch((error) => res.status(400).json({ error }));

    }else{
      Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        if (sauce.usersLiked.includes(req.body.userId)) { 

          Sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } })
              .then((sauce) => { res.status(200).json({ message: 'Like supprimé' }) })
              .catch(error => res.status(400).json({ error }))

        } else if (sauce.usersDisliked.includes(req.body.userId)) {
            Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 } })
              .then((sauce) => { res.status(200).json({ message: 'Dislike supprimé' }) })
              .catch(error => res.status(400).json({ error }))
        }
      })
      .catch(error => res.status(400).json({ error }));
  }

  }
  
  

