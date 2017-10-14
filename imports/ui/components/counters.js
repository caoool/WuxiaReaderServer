import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { Mongo } from 'meteor/mongo'
import { ReactiveDict } from 'meteor/reactive-dict'

import './counters.html'
import Vocabulary from '../../api/vocabulary'

Template.Counters.onCreated(function CounterOnCreated() {
  this.state = new ReactiveDict()
  Meteor.subscribe('vocabulary.all')
})

Template.Counters.helpers({
  vocabCounts() {
    return Vocabulary.find().count()
  },
  lookupCounts() {
    const data = Vocabulary.find().fetch()
    let count = 0
    data.forEach((item) => { count += item.count })
    return count
  },
  favCounts() {
    const data = Vocabulary.find().fetch()
    let count = 0
    data.forEach((item) => { count += item.fav })
    return count
  }
})