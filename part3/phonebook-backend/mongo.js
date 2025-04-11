require("dotenv").config();
const mongoose = require("mongoose");
const Person = require("./models/person");

const printUsageAndExit = () => {
  console.log("Usage: node mongo.js [<name> <number>]");
  process.exit(1);
};

if (process.argv.length === 2) {
  Person.find({}).then((result) => {
    console.log("phonebook:");
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
} else if (process.argv.length === 4) {
  const name = process.argv[2];
  const number = process.argv[3];

  if (!name || !number) {
    printUsageAndExit();
  }

  const person = new Person({ name, number });
  person.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
} else {
  printUsageAndExit();
}
