const Student = require("./../models/student");
const Period = require("./../models/period");
const Score = require("./../models/score");
const Teacher = require("./../models/teacher");

// Add student by name

// Delete student by ID
// Delete student by name

// Get student by ID
// Get student by name
// Get student by username

// Get students by gender
// Get students by long term average

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
