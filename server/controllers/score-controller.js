const Student = require("./../models/student");
const Period = require("./../models/period");
const Score = require("./../models/score");
const Teacher = require("./../models/teacher");

module.exports = {
  async post(ctx) {
    ctx.body = "Scores POST";
  },

  async get(ctx) {
    ctx.body = "Scores GET";
  },

  async put(ctx) {
    ctx.body = "Scores PUT";
  },

  async delete(ctx) {
    ctx.body = "Scores DELETE";
  }
};
