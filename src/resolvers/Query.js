async function feed (parent, args, context, info) {
  const where = args.filter
    ? {
      OR: [
        { url_contains: args.filter },
        { description_contains: args.filter },
        { id: args.filter }
      ]
    }
    : {}

  const queriedLinks = await context.db.query.links(
    { where, skip: args.skip, first: args.first, orderBy: args.orderBy }
  )
  const countSelectionSet = `
        {
            aggregate {
                count
            }
        }
    `
  const linksConnection = await context.db.query.linksConnection(
    {},
    countSelectionSet
  )
  return {
    count: linksConnection.aggregate.count,
    linkIds: queriedLinks.map(link => link.id)
  }
}

async function link (parent, args, context, info) {
  const where = args.filter
    ? {
      OR: [
        { id: args.filter }
      ]
    }
    : {}

  const queriedLinks = await context.db.query.links(
    { where, skip: args.skip, first: args.first, orderBy: args.orderBy },
    `{ id }`
  )
  return {
    id: queriedLinks.map(link => link.id)[0]
  }
}

async function users (parent, args, context, info) {
  const where = args.filter
    ? {
      OR: [
        { id: args.filter },
        { name_contains: args.filter }
      ]
    } : {}

  const queriedUsers = await context.db.query.users(
    { where, skip: args.skip, first: args.first, orderBy: args.orderBy },
    `{ name }`
  )
  console.log(queriedUsers)

  return queriedUsers
}

module.exports = {
  feed,
  link,
  users
}
