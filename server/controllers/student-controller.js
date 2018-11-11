const Student = require("./../models/student");
const Period = require("./../models/period");
const Score = require("./../models/score");
const Teacher = require("./../models/teacher");

module.exports = {
  async post(ctx) {
    ctx.body = "User POST";
  },

  async get(ctx) {
    ctx.body = "User GET";
  },

  async put(ctx) {
    ctx.body = "User PUT";
  },

  async delete(ctx) {
    ctx.body = "User DELETE";
  }
};
