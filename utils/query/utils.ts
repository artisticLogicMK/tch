// userSelect -> Exclude sensitive data
export const userSelect = {
  id: true,
  username: true,
  email: true,
  gender: true,
  dob: true,
  country: true,
  picture: true,
  googleAuth: true,
  oldUser: true,
  admin: true,
  about: true,
  whatsapp: true,
  suspended: true,
  banned: true,
  warnings: true,
  preferences: true,
  welcomed: true,
  lastActivity: true,
  lastLoggedIn: true,
  createdAt: true,
  updatedAt: true,
  _count: true,
}


export const threadNoPicInclude = userId => ({
  user: { select: { username: true, id: true } },
  forum: {
    select: {
      name: true,
      slug: true,
      category: { select: { name: true, slug: true } },
      moderators: true
    }
  },
  reactions: {
    take: 3, orderBy: { createdAt: 'desc' },
    ...(userId ? { where: { userId: {not: userId} } } : {})
  },
  _count: {
    select: {
      posts: true,
      views: true,
      reactions: true,
      bookmarks: true
    }
  }
})


export const threadPicInclude = userId => ({
  user: {
    include: {
      moderating: true,
      _count: {
        select: {
          threads: true,
          posts: true,
          views: true
        }
      }
    }
  },
  forum: {
    select: {
      name: true,
      slug: true,
      locked: true,
      category: { select: { name: true, slug: true } },
      moderators: true,
      forumAnnouncement: true
    }
  },
  reactions: {
    take: 3, orderBy: { createdAt: 'desc' },
    ...(userId ? { where: { userId: {not: userId} } } : {})
  },
  images: true,
  docs: true,
  _count: {
    select: {
      posts: true,
      views: true,
      reactions: true,
      bookmarks: true
    }
  }
})


export const postPicInclude = userId => ({
  user: {
    include: {
      moderating: true,
      _count: {
        select: {
          threads: true,
          posts: true,
          views: true
        }
      }
    }
  },
  images: true,
  docs: true,
  reactions: {
    take: 3, orderBy: { createdAt: 'desc' },
    ...(userId ? { where: { userId: {not: userId} } } : {})
  },
  thread: {
    select: {
      title: true, slug: true, locked: true,
      forum: {
        select: {
          name: true, slug: true, locked: true,
          category: { select: { name: true, slug: true } },
          moderators: true,
        }
      }
    }
  },
  _count: {
    select: {
      views: true,
      reactions: true,
      bookmarks: true
    }
  }
})


export const constructFiltersThreads = (filters) => {
  const { search, orderBy, sort, timeRange, showOnly } = filters

  // Build 'where' filter
  const where = {}

  if (search !== '') {
    where.OR = [
      {
        title: {
          contains: search,
          //mode: 'insensitive',
        },
      },
      {
        content_text: {
          contains: search,
          //mode: 'insensitive',
        },
      },
    ]
  }
  
  if (showOnly !== '') {
    if (showOnly === 'hidden') {
      where.hidden = true
    }
    else if (showOnly === 'locked') {
      where.locked = true
    }
  }
  
  if (timeRange !== '') {
    const date = new Date(timeRange).toISOString()
    where.createdAt = { gt: date }
  }

  // Build orderBy dynamically
  let orderByClause = {}

  switch (orderBy) {
    case 'recent':
      orderByClause = { updatedAt: sort }
      break
    case 'created':
      orderByClause = { createdAt: sort }
      break
    case 'trending':
      orderByClause = [
        { posts: { _count: sort } },
        { views: { _count: sort } },
        { reactions: { _count: sort } }
      ]
      break
    case 'posts':
      orderByClause = { posts: { _count: sort } }
      break
    case 'views':
      orderByClause = { views: { _count: sort } }
      break
    case 'reactions':
      orderByClause = { reactions: { _count: sort } }
      break
    default:
      orderByClause = [
        {
          posts: {
            _max: {
              createdAt: 'desc',
            },
          },
        },
        { updatedAt: sort }
      ]
  }
  
  return { where, orderByClause }
}


export const constructFiltersPosts = (filters) => {
  const { search, orderBy, sort, timeRange, showOnly } = filters

  // Build 'where' filter
  const where = {}

  if (search !== '') {
    where.content_text = {
      contains: search,
      //mode: 'insensitive',
    }
  }
  
  if (showOnly !== '') {
    if (showOnly === 'hidden') {
      where.hidden = true
    }
    else if (showOnly === 'locked') {
      where.locked = true
    }
  }
  
  if (timeRange !== '') {
    const date = new Date(timeRange).toISOString()
    where.createdAt = { gt: date }
  }

  // Build orderBy dynamically
  let orderByClause = {}

  switch (orderBy) {
    case 'created':
      orderByClause = { createdAt: sort }
      break
    case 'recent':
      orderByClause = { updatedAt: sort }
      break
    case 'trending':
      orderByClause = [
        { views: { _count: sort } },
        { reactions: { _count: sort } }
      ]
      break
    case 'views':
      orderByClause = { views: { _count: sort } }
      break
    case 'reactions':
      orderByClause = { reactions: { _count: sort } }
      break
    default:
      orderByClause = [
        { createdAt: sort }
      ]
  }
  
  return { where, orderByClause }
}