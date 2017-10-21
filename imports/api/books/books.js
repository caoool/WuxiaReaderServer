import { Meteor } from 'meteor/meteor'
import { FilesCollection } from 'meteor/ostrio:files'

const Books = new FilesCollection({
  debug: true,
  storagePath: '/epub-repo',
  collectionName: 'books',
  onBeforeUpload(file) {
    if (/epub/i.test(file.ext)) {
      return true
    } else {
      return 'Wrong file format'
    }
  },
  downloadCallback(fileObj) {
    if (this.params.query.download == 'true') {
      // Increment downloads counter
      Books.update(fileObj._id, {$inc: {'meta.downloads': 1}});
    }
    // Must return true to continue download
    return true;
  }
})

if (Meteor.isServer) {
  Books.denyClient()
}

export default Books