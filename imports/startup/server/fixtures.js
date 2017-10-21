import fs from 'fs'
import { Meteor } from 'meteor/meteor'
import Vocabulary from '../../api/vocabulary'
import Books from '../../api/books/books'
import crawl from '../../utils/crawler'

function vocabGen() {
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
}

function booksGen() {
  if (Books.find().count() === 0) {
    crawl()
  }
}

function loadLocalBooks() {
  const dir = '/epub-repo/'
  fs.readdirSync(dir).forEach(file => {
    if (!Books.findOne({name: file})) {
      const path = dir + file
      Books.addFile(path)
    }
  })
}

Meteor.startup(() => {
  // vocabGen()
  // booksGen()
  loadLocalBooks()
})