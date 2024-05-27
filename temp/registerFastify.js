function registerFastify(router) {
  const fastify = require("fastify");
  fastify.register(require("@fastify/express")).after(() => {
    fastify.use(router.urlencoded({ extended: false })); // for Postman x-www-form-urlencoded
    fastify.use(router.json());

    fastify.use(router);
  });
  return fastify;
}
