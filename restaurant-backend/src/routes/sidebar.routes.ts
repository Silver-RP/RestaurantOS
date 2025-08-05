import { Router } from 'express';
import { getSidebarData } from '../controller/SidebarController';

const router = Router();

router.get('/', getSidebarData);

export default router;
