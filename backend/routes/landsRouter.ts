import { Router } from "express";
import { addLandContoller } from "../controllers/landsController";
import multer from "multer";
import { viewLandsController } from "../controllers/viewLandsController";

const landsRouter = Router();

landsRouter.get("/", (req, res) => {
    res.send("HI")
})

const upload = multer({ storage: multer.memoryStorage() }); // keeps file in RAM
landsRouter.post("/add", upload.array("photos", 5), addLandContoller)

landsRouter.get("/view", viewLandsController)

export default landsRouter;