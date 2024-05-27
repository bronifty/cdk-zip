// ESM
import Fastify from "fastify";

const app = Fastify({
  logger: true,
});

// Declare a route
app.get("/", async (request, reply) => {
  return { hello: "world" };
});

// Run the server!
const start = async () => {
  try {
    await app.listen({ port: 3000, host: "::" });
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};
start();
