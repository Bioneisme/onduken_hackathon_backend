import {Router} from "express";
import {getCurrentUser, login, register, validate, logout} from "../controllers/userController";
import protectedRoute from "../middleware/authMiddleware";

const router: Router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);

router.get("/getMe", protectedRoute, getCurrentUser);
router.post("/validate", validate);

export default router;