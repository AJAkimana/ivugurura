import express, { Router } from 'express';
import userRoutes from './userRoutes';
import topicRoutes from './topicRoutes';
import categoryRoutes from './categoryRoutes';
import albumRoutes from './albumRoutes';
import announceRoutes from './announceRoutes';
import manageRoutes from './manageRoutes';

const apiRoutes = Router();

apiRoutes.use('/user', userRoutes);
apiRoutes.use('/topics', topicRoutes);
apiRoutes.use('/categories', categoryRoutes);
apiRoutes.use('/albums', albumRoutes);
apiRoutes.use('/announcements', announceRoutes);
apiRoutes.use('/manage', manageRoutes);
apiRoutes.use('/songs', express.static('public/songs'));
apiRoutes.use('/images', express.static('public/images'));

export default apiRoutes;
