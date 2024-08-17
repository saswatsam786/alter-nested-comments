import App from "./app";

const main = async () => {
  const app = new App();
  await app.startServer();
};

main().catch((err) => {
  console.error(err);
});
