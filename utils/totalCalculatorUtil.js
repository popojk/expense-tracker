module.exports = function (mappedExpenses) {
  return mappedExpenses.reduce(
    (acc, cur) => acc + cur.amount, 0
  )
}
