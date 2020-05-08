exports.__resolveType = user => {
  return user.email
    ? 'User'
    : 'SafeUser'
}