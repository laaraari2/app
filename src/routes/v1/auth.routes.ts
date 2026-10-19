import { Router } from 'express';
import { loginController, refreshTokenController, logoutController, meController } from '../../controllers/auth.controller';
import { validateRequest } from '../../middleware/validation.middleware';
import { authenticate } from '../../middleware/auth.middleware';
import { loginSchema, refreshTokenSchema } from '../../validators/schemas';

const router = Router();

router.post('/login', validateRequest({ body: loginSchema }), loginController);
router.post('/refresh', validateRequest({ body: refreshTokenSchema }), refreshTokenController);
router.post('/logout', authenticate, logoutController);
router.get('/me', authenticate, meController);

export default router;
