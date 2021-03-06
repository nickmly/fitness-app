module.exports = {
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
          @import "@/scss/_fonts.scss";
          @import "@/scss/_colours.scss";
          @import "@/scss/_breakpoints.scss";
          @import "@/scss/_layout.scss";
          @import "@/scss/_input.scss";
          @import "@/scss/_links.scss";
          @import "@/scss/_lists.scss";
        `
      }
    }
  },
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title = "Demo Fitness Log App";
        return args;
      })
  }
};