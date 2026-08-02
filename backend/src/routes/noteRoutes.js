const express = require("express");
const noteController = require("../controllers/noteController");
const authenticate = require("../middlewares/authMiddleware");

const router = express.Router();
router.use(authenticate);

router.post("/", noteController.create);
router.get("/", noteController.getAll);
router.get("/:id", noteController.getById);
router.put("/:id", noteController.update);
router.delete("/:id", noteController.remove);

module.exports = router;