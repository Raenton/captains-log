exports.user = async (parent, _args, context) => {
  return await context.postRepository.findOne({ 
    where: { id: parent.id }
  }).user()
}

// exports.likes = (parent, _args, context) => {
//   return context.repository.post.findOne({
//     where: { id: parent.id }
//   }).likes()
// }
