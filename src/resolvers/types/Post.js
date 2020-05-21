exports.user = (parent, _args, context) => {
  return context.repository.post.findOne({ 
    where: { id: parent.id }
  }).user()
}

// exports.likes = (parent, _args, context) => {
//   return context.repository.post.findOne({
//     where: { id: parent.id }
//   }).likes()
// }
