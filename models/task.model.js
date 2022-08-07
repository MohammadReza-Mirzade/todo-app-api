module.exports = (seqelize, Sequelize) => {
  return seqelize.define('task', {
    title: {
      type: Sequelize.STRING
    },
    body: {
      type: Sequelize.TEXT
    },
    isDone: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    }
  });
}