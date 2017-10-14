import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'

class VocabularyCollection extends Mongo.Collection {}

Meteor.methods({
  'vocabulary.addCount': ({ word }) => {
    item = Vocabulary.findOne({word: word})
    if (item) {
      Vocabulary.update(item._id, { $set: { count: item.count + 1} })
    } else {
      let newItem = {
        word: word,
        count: 1,
        fav: 0
      }
      Vocabulary.insert(newItem)
    }
  },

  'vocabulary.addFav': ({ word }) => {
    item = Vocabulary.findOne({word: word})
    if (item) {
      Vocabulary.update(item._id, { $set: { fav: item.fav + 1} })
    } else {
      let newItem = {
        word: word,
        count: 0,
        fav: 1
      }
      Vocabulary.insert(newItem)
    }
  },
})

if (Meteor.isServer) {
  Meteor.publish('vocabulary.all', () => {
    return Vocabulary.find()
  })
  
  Meteor.publish('vocabulary.word', (word) => {
    return Vocabulary.find({word: word})
  })
}
 
const Vocabulary = new VocabularyCollection('vocabulary')

export default Vocabulary