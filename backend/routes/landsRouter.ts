import { Router } from "express";
import { addLandContoller } from "../controllers/landsController";
import multer from "multer";
import { viewLandsController } from "../controllers/viewLandsController";
import { landInterestController } from "../controllers/landInterestController";

const landsRouter = Router();

landsRouter.get("/", (req, res) => {
    res.send("HI")
})

const upload = multer({ storage: multer.memoryStorage() }); // keeps file in RAM
landsRouter.post("/add", upload.array("photos", 5), addLandContoller)

landsRouter.get("/view", viewLandsController)
landsRouter.post("/interest", landInterestController)

export default landsRouter;