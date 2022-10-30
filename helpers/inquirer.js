const inquirer = require("inquirer");
require("colors");

const questions = [
  {
    type: "list",
    name: "option",
    message: "What would you like to do?",
    choices: [
      {
        value: 1,
        name: `${"1.".green} Search city`,
      },
      {
        value: 2,
        name: `${"2.".green} History`,
      },
      {
        value: 0,
        name: `${"0.".green} Exit`,
      },
    ],
  },
];

const inquirerMain = async () => {
  console.clear();
  console.log("======================".green);
  console.log("   Weather App".green);
  console.log("======================\n".green);

  const { option } = await inquirer.prompt(questions);
  return option;
};

const pause = async () => {
  const question = {
    type: "input",
    name: "enter",
    message: `Press ${"ENTER".green} to continue`,
  };
  console.log("\n");
  await inquirer.prompt(question);
};

const readInput = async (message) => {
  const question = [
    {
      type: "input",
      name: "desc",
      message,
      validate(value) {
        if (value.length === 0) return "Enter a value please";
        return true;
      },
    },
  ];

  const { desc } = await inquirer.prompt(question);
  return desc;
};

const listPlacesFound = async (places) => {
  const choices = places.map((place, i) => {
    const idx = `${i + 1}.`.green;
    return {
      value: place.id,
      name: `${idx} ${place.name}`,
    };
  });

  choices.unshift({
    value: 0,
    name: `${"0.".green} Cancel`,
  });

  const list = {
    type: "list",
    name: "id",
    message: "Seleccione a place: ",
    choices,
  };

  const { id } = await inquirer.prompt(list);
  return id;
};

const confirmDelete = async (message) => {
  const question = {
    type: "confirm",
    name: "ok",
    message,
  };

  const { ok } = await inquirer.prompt(question);
  return ok;
};

const listTasksChecklist = async (tasks) => {
  const choices = tasks.map((task, i) => {
    const idx = `${i + 1}.`.green;
    return {
      value: task.id,
      name: `${idx} ${task.description}`,
      checked: task.completedIn ? true : false,
    };
  });

  const listTasks = {
    type: "checkbox",
    name: "idsTask",
    message: "Selection",
    choices,
  };

  const { idsTask } = await inquirer.prompt(listTasks);
  return idsTask;
};

module.exports = {
  inquirerMain,
  pause,
  readInput,
  listPlacesFound,
  confirmDelete,
  listTasksChecklist,
};
