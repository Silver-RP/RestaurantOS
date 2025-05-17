"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const FavoriteController_1 = require("../controller/FavoriteController");
const router = (0, express_1.Router)();
router.get('/getFavorites', FavoriteController_1.FavoriteController.list);
router.post('/add', FavoriteController_1.FavoriteController.add);
router.delete('/item/:id', FavoriteController_1.FavoriteController.remove);
exports.default = router;
