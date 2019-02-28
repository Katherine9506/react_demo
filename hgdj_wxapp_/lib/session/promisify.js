const promisify = api => {
  return (options, ...params) => new Promise((resolve, reject) => {
  	// console.log(params,'0000000000000')
    api({ ...options, success: resolve, fail: reject }, ...params)
  })
}

module.exports = { promisify }