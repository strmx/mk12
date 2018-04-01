import { toBase70, fromBase70 } from 'base70'

export const dateToMinutes = date => Math.floor(date.getTime() / (1000 * 60))
export const minutesToDate = minutes => new Date(minutes * 1000 * 60)

export default class Post {
  constructor({value, date, description} = {}) {
    this.value = value || 0
    this.date = date || minutesToDate(dateToMinutes(new Date())) // rounded
    this.description = description || ''
  }

  static isPost({value, date, description} = {}) {
    return value !== undefined && date !== undefined && description !== undefined
  }

  serialize() {
    return {
      value: this.value,
      date: this.date.getTime(),
      description: this.description,
    }
  }

  deserialize(raw) {
    this.date = new Date(raw.date)
    this.value = raw.value
    this.description = raw.description
    return this
  }

  toString() {
    const minutes = dateToMinutes(this.date)
    return `${toBase70(minutes)}-${this.value}-${this.description}`
  }

  fromString(value) {
    try {
      const parts = value.split('-')      
      this.date = minutesToDate(fromBase70(parts[0]))
      this.value = parseInt(parts[1], 10)
      this.description = parts.slice(2).join('-')
      return this
    } catch(err) {
      console.error('Post parsing error', value)
      console.error(err)
      throw err
    }
  }

  equals(post) {
    return (
      this.date.getTime() === post.date.getTime()
      && this.value === post.value
      && this.description === post.description
    )
  }
}
