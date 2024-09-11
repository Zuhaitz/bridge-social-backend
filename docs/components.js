module.exports = {
  components: {
    schemas: {
      user: {
        type: "object",
        properties: {
          _id: {
            type: "objectId",
            description: "user identification number",
            example: "6201064b0028de7866e2b2c4",
          },
          username: {
            type: "string",
            description: "user's name",
            example: "Pedro",
          },
          completed: {
            type: "boolean",
            description: "status of the task",
            example: false,
          },
        },
      },
    },
  },
};
