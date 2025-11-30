const app = require("./app");
const { init } = require("./db/db");

const PORT = process.env.PORT || 4000;

init()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Owners API (lowdb) running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });
