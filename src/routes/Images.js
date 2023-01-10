import express from "express";
import path from "path"
const __dirname = path.resolve();

const router = express.Router();

router.get("/:image_name", (req, res) => {
    var fileName = path.join(__dirname + `/src/images/${req.params.image_name}`);
    res.sendFile(fileName)
})

export default router;