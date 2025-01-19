import app from "./app";
import { connectDB } from "./repositories";

const port = process.env.PORT || 3000;

const startApp = async () => {
  await connectDB();
  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
};

startApp();
