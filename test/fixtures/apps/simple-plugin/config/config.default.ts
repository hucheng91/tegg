export default {
  port: 8000,
  redis: {
    client: {
      port: 6666,
    },

    clients: {
      c1: {
        port: 6667,
      },
      c2: {
        port: 6668,
      },
    },
  },
};
