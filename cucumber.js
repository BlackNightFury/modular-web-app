module.exports = {
  default: `testing/integration
              src/components/EliasMwaComponents/**/**/**/*.feature
              --require testing/integration/**/*.js
              --require src/components/EliasMwaComponents/**/**/**/*.stepdef.js`,
}
