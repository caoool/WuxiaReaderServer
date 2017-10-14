import { Meteor } from 'meteor/meteor'
import Vocabulary from '../../api/vocabulary'

Meteor.startup(() => {
  if (Vocabulary.find().count() === 0) {
    const data = [
      {
        word: 'word1',
        count: 12,
        fav: 3
      }, {
        word: 'word2',
        count: 15,
        fav: 1
      }, {
        word: 'word3',
        count: 100,
        fav: 2
      }
    ]

    data.forEach((item) => {
      Vocabulary.insert(item)
    })
  }
})