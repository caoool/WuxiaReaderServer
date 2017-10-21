module.exports = {
  servers: {
    one: {
      // TODO: set host address, username, and authentication method
      host: 'ec2-13-124-165-77.ap-northeast-2.compute.amazonaws.com',
      username: 'root',
      pem: './admin.pem'
      // password: 'server-password'
      // or neither for authenticate from ssh-agent
    }
  },

  app: {
    // TODO: change app name and path
    name: 'magic-reader',
    path: '../',

    volumes: {
      '/epub-repo': '/epub-repo'
    },

    servers: {
      one: {}
    },

    buildOptions: {
      serverOnly: true,
    },

    env: {
      // TODO: Change to your app's url
      // If you are using ssl, it needs to start with https://
      ROOT_URL: 'http://mr.loopcowstudio.com',
      MONGO_URL: 'mongodb://localhost/meteor',
    },

    // ssl: { // (optional)
    //   // Enables let's encrypt (optional)
    //   autogenerate: {
    //     email: 'email.address@domain.com',
    //     // comma separated list of domains
    //     domains: 'website.com,www.website.com'
    //   }
    // },

    docker: {
      // change to 'kadirahq/meteord' if your app is using Meteor 1.3 or older
      image: 'abernix/meteord:base',
    },

    // Show progress bar while uploading bundle to server
    // You might need to disable it on CI servers
    enableUploadProgressBar: true
  },

  mongo: {
    version: '3.4.1',
    servers: {
      one: {},
    },
  }
};
