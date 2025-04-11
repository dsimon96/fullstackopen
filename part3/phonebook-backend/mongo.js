const mongoose = require("mongoose");

const printUsageAndExit = () => {
  console.log("Usage: node mongo.js <password> [<name> <number>]");
  process.exit(1);
};

if (process.argv.length < 2) {
  printUsageAndExit();
}

const password = process.argv[2];

const url = `mongodb+srv://mongodb4xkj3:${password}@cluster0.kvuesje.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    console.log("phonebook:");
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
} else if (process.argv.length === 5) {
  const name = process.argv[3];
  const number = process.argv[4];

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
