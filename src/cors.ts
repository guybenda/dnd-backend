import cors from "cors";

export default cors({
	origin: process.env.DEV ? "*" : "https://dnd.benda.dev",
});
