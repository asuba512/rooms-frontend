export const titleToIdentifier: (title: string) => string = (title) => {
  return title.split(' ').join('_').toLowerCase()
}
