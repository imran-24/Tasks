#!/usr/bin/env node

const crypto = require("crypto");
const readline = require("readline");
const Table = require("cli-table3"); // Correct import

// Class to handle HMAC generation and key management
class HMACHandler {
  constructor() {
    this.key = crypto.randomBytes(32); // 256 bits
  }

  generateHMAC(message) {
    return crypto
      .createHmac("sha256", this.key)
      .update(message)
      .digest("hex")
      .toUpperCase();
  }

  getKeyHex() {
    return this.key.toString("hex").toUpperCase();
  }
}

// Class to generate computer's move
class MoveGenerator {
  constructor(moves) {
    this.moves = moves;
  }

  generateMove() {
    const index = crypto.randomInt(0, this.moves.length);
    return { move: this.moves[index], index };
  }
}

// Class to determine game rules and outcomes
class RuleEngine {
  constructor(moves) {
    this.moves = moves;
    this.rules = this.generateRules();
  }

  generateRules() {
    const rules = {};
    const n = this.moves.length;
    const half = Math.floor(n / 2);

    this.moves.forEach((move, i) => {
      rules[move] = [];
      for (let j = 1; j <= half; j++) {
        // DefeatedMove is the previous half moves in the list
        const defeatedMove = this.moves[(i - j + n) % n];
        rules[move].push(defeatedMove);
      }
    });

    return rules;
  }

  determineWinner(userMove, computerMove) {
    if (userMove === computerMove) {
      return "Draw";
    } else if (this.rules[userMove].includes(computerMove)) {
      return "You win!";
    } else {
      return "You lose!";
    }
  }
}

// Class to generate and display the help table
class HelpTable {
  constructor(moves, ruleEngine) {
    this.moves = moves;
    this.ruleEngine = ruleEngine;
  }

  generateTable() {
    // Determine the maximum length of move names and result strings
    const moveNames = this.moves;
    const results = ["Win", "Lose", "Draw"];
    const maxMoveLength = Math.max(
      ...moveNames.map((move) => move.length),
      ...results.map((result) => result.length)
    );
    const colWidth = maxMoveLength + 4; // Adding padding

    // Create table headers: Computer's moves
    const headers = ["PC / User"].concat(this.moves);

    // Initialize the table with headers
    const table = new Table({
      head: headers,
      colWidths: [colWidth].concat(this.moves.map(() => colWidth)),
      style: { head: ["green"] },
      wordWrap: true,
    });

    // Populate the table rows: Computer's moves vs User's moves
    this.moves.forEach((computerMove) => {
      const row = [computerMove];
      this.moves.forEach((userMove) => {
        if (userMove === computerMove) {
          row.push("Draw");
        } else if (this.ruleEngine.rules[userMove].includes(computerMove)) {
          row.push("Win");
        } else {
          row.push("Lose");
        }
      });
      table.push(row);
    });

    return table.toString();
  }
}

// Function to validate command-line arguments
function validateMoves(moves) {
  if (moves.length < 3) {
    throw new Error("Error: At least 3 moves are required.");
  }
  if (moves.length % 2 === 0) {
    throw new Error("Error: Number of moves must be odd.");
  }
  const uniqueMoves = new Set(moves);
  if (uniqueMoves.size !== moves.length) {
    throw new Error("Error: All moves must be unique.");
  }
  if (moves.some((move) => move.trim() === "")) {
    throw new Error("Error: Move names cannot be empty.");
  }
}

// Function to display the menu
function displayMenu(moves) {
  console.log("\nAvailable moves:");
  moves.forEach((move, index) => {
    console.log(`${index + 1} - ${move}`);
  });
  console.log("0 - exit");
  console.log("? - help");
}

// Function to handle user input
function getUserInput(prompt) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

// Main function to run the game
async function main() {
  const args = process.argv.slice(2);
  if (args.length < 3) {
    console.error("Error: Not enough arguments.");
    console.error(
      "Usage: node rps_game.js move1 move2 move3 [move4 ... moveN]"
    );
    console.error("Example: node rps_game.js rock paper scissors");
    process.exit(1);
  }

  try {
    validateMoves(args);
  } catch (error) {
    console.error(error.message);
    console.error("Example of correct usage:");
    console.error("node rps_game.js rock paper scissors");
    process.exit(1);
  }

  const moves = args;
  const hmacHandler = new HMACHandler();
  const moveGenerator = new MoveGenerator(moves);
  const ruleEngine = new RuleEngine(moves);
  const helpTable = new HelpTable(moves, ruleEngine);

  const computer = moveGenerator.generateMove();
  const hmac = hmacHandler.generateHMAC(computer.move);
  console.log(`\nHMAC: ${hmac}`);

  while (true) {
    displayMenu(moves);
    const userInput = await getUserInput("\nEnter your move: ");

    if (userInput === "0") {
      console.log("Goodbye!");
      process.exit(0);
    } else if (userInput === "?") {
      console.log("\nHelp Table:");
      console.log(helpTable.generateTable());
      continue;
    } else if (/^\d+$/.test(userInput)) {
      const choice = parseInt(userInput, 10);
      if (choice >= 1 && choice <= moves.length) {
        const userMove = moves[choice - 1];
        const computerMove = computer.move;
        console.log(`\nYour move: ${userMove}`);
        console.log(`Computer move: ${computerMove}`);
        const result = ruleEngine.determineWinner(userMove, computerMove);
        console.log(result);
        console.log(`HMAC key: ${hmacHandler.getKeyHex()}`);
        process.exit(0);
      }
    }

    console.log("\nInvalid input. Please try again.\n");
  }
}

main();
