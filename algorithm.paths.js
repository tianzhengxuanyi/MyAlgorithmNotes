import fs from 'fs'

export default {
  paths() {
    console.log("算法目录:", './algorithm/category')
    return fs
      .readdirSync('./algorithm/category')
      .map((pkg) => {
        console.log("🚀 ~ pkg:", pkg)
        return { params: { pkg }}
      })
  }
}