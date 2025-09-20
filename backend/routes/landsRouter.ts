import { Router } from "express";
import { addLandContoller } from "../controllers/landsController";

const landsRouter = Router();

landsRouter.get("/", (req, res) => {
    res.send("HI")
})

landsRouter.post("/add", addLandContoller)
export default landsRouter;