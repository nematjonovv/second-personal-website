import app from "./app";
import { PORT } from "./shared/constants";

app.listen(PORT, () => {
  console.log(`Server http://localhost:${PORT} da ishlayapti`);
});