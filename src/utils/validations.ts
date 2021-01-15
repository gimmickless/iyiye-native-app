export const getMaxDateFor18OrMoreYearsOld = () => {
  const thisDate = new Date()

  return new Date(
    thisDate.getFullYear() - 18,
    thisDate.getMonth(),
    thisDate.getDate()
  )
}
