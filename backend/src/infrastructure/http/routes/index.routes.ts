import express from "express";
import folderRoutes from "./folder.routes";
import noteRoutes from "./note.routes";
import expertRouter from "./expert.routes";
import calendlyRoutes from "./calendly.routes";
import docRoutes from "./document.routes"
import taskRoutes from "./task.routes";
import tagRoutes from "./tag.routes";


const indexRouter = express.Router();

indexRouter.use("/expert", expertRouter);
indexRouter.use ("/folder",folderRoutes)
indexRouter.use("/note",noteRoutes);
indexRouter.use('/calendly',calendlyRoutes);
indexRouter.use('/doc',docRoutes);
indexRouter.use('/task',taskRoutes);
indexRouter.use('/tag', tagRoutes)

export default indexRouter;