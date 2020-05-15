class DbRepository {
  constructor(client) {
    this._client = client
  }

  findOne = (model, args) => {
    return this._client[model].findOne(args)
  }

  findMany = (model, args) => {
    return this._client[model].findMany(args)
  }

  create = (model, args) => {
    return this._client[model].create(args)
  }

  update = (model, args) => {
    return this._client[model].update(args)
  }

  updateMany = (model, args) => {
    return this._client[model].updateMany(args)
  }

  deleteOne = (model, args) => {
    return this._client[model].delete(args)
  }

  deleteMany = (model, args) => {
    return this._client[model].deleteMany(args)
  }

  upsert = (model, args) => {
    return this._client[model].upsert(args)
  }
}

module.exports = { DbRepository }