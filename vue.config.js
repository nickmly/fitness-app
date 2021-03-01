module.exports = {
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
          @import "@/scss/_colours.scss";
          @import "@/scss/_breakpoints.scss";
        `
      }
    }
  }
};