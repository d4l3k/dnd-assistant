import { createWebpackConfig } from "haul";

export default {
  webpack: createWebpackConfig((options) => {
    console.log('haul config running')
    options.minify = false

    return {
      entry: `./index.js`
    }
  })
};
