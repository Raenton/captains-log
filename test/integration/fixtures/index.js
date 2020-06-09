module.exports = {
  registerInput: {
    username: 'test_user',
    email: 'test@mail.com',
    password: 'test123'
  },
  loginInput: {
    email: 'test@mail.com',
    password: 'test123'
  },
  createPostInput: {
    title: 'Test Post',
    body: 'Post Body',
    description: 'Post Description'
  },
  updatePostInput: {
    title: 'Updated Post',
    body: 'Updated Post Body',
    description: 'Updated Post Description',
    published: true
  },
  posts: [
    {
      title: 'Gardening Greatness',
      description: 'How to trim a hedge without chopping your finger off',
      body:
        'In everyday life, hedge-trimming is an important activity. everyone ' +
        'has to trim their hedge, whether they do it personally or by a paid ' +
        'professional. Want to save money and trim your hedge yourself? Here ' +
        'are our 10 top tips for how to trim your hedge without innuendo - uh, ' +
        'I mean, without chopping your finger off.'
    }, {
      title: 'Now what does THAT remind me of?',
      description: 'One of the greatest books in Skyrim',
      body:
        'A wonderful game and equally incredible RPG universe, Skyrim also had ' +
        'an abundance of easter eggs. "The Lusty Argonian Maid" was one of ' +
        'those. Cue a few verses about a lizard woman "polishing a spear".'
    }, {
      title: 'I am going to make these shorter, because I want to...',
      description: 'Get the actual coding done',
      body:
        'I am presently writing these for use in a pagination unit test, ' +
        'although I took the opportunity to for a little humour. I hope ' +
        'anyone who sees this is not offended or disgusted.'
    }, {
      title: 'Actually, this reminds me of',
      description: 'A time when I used Copyright-safe Star-Wars names',
      body:
        'In the documentation for a professional product. I was later asked to ' +
        'remove them. I think that and data generators that I was using to ' +
        'save the hassle of writing custom data like this. Safe to say, our ' +
        'customers (although they were programmers) were pretty stupid, ' +
        'so we did not want them trying to interpret anything above a for-loop.'
    }, {
      title: 'Okay lets cut to the chase',
      description: 'Five green bottles',
      body: 'Sitting on wall (or was it standing?)'
    }, {
      title: 'Knock one down, spin around...',
      description: 'No wait that is the hokey kokey isnt it',
      body: 'I give up...'
    }, {
      title: 'If you have ventured into my test fixtures, good luck to you',
      description: 'I also hope you are not a potential employer',
      body: 'I have been judged enough on minor things to lose out because of this'
    }
  ],
  users: [
    {
      username: 'amigo_sanchez',
      email: 'amigo@mail.com',
      password: 'amigo123'
    }, {
      username: 'robert_wellington',
      email: 'robbie@mail.com',
      password: 'robert123'
    }, {
      username: 'starboard_captain',
      email: 'captain@mail.com',
      password: 'starboard123'
    }, {
      username: 'bread_cake',
      email: 'bread@mail.com',
      password: 'bread123'
    }, {
      username: 'panda_bear',
      email: 'panda@mail.com',
      password: 'panda123'
    }
  ]
}
