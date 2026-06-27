const express = require("express");
const router = express.Router();
const { shortenUrl, getAllLinks, deleteLink, getStats } = require("../controllers/url.controller");

router.post("/shorten", shortenUrl);
router.get("/links", getAllLinks);
router.delete("/links/:code", deleteLink);
router.get("/stats/:code", getStats);

module.exports = router;
