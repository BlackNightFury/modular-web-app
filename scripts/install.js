#!/usr/bin/env node

const { argv } = require('yargs')

const { execSync } = require('child_process')

console.log(argv)

let options = {
  stdio: 'inherit',
  // env: _.extend(process.env, {
  // 	KEY: value
  // })
}

// console.log(process.env)

// if (command === 'init') {
// 	var result = execSync(`rm -rf ${dataDir}`, options)
// 	console.log(result)

// }

// process.exit()

console.log('Installing base projects dependencies')
let result = execSync(`npm install`, options)
console.log(result)

options = {
  stdio: 'inherit',
  cwd: './infrastructure/serverless',
  // env: _.extend(process.env, {
  // 	KEY: value
  // })
}

console.log('Installing serverless dependencies')
result = execSync(`npm install`, options)
console.log(result)


options = {
  stdio: 'inherit',
  cwd: './cypress',
  // env: _.extend(process.env, {
  //   KEY: value
  // })
}

console.log('Installing cypress dependencies')
result = execSync(`npm install`, options)
console.log(result)


options = {
  stdio: 'inherit',
  cwd: './infrastructure/acceptance_tests',
  // env: _.extend(process.env, {
  //   KEY: value
  // })
}

console.log('Installing acceptance_tests dependencies')
result = execSync(`npm install`, options)
console.log(result)