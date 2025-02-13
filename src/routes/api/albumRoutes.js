import { Router } from "express";
import {
  getAlbums,
  createAlbum,
  getOneAlbum,
  editAlbumInfo,
  deleteAlbum,
  addNewMedia,
  deleteFile,
  getMedia,
  downloadSong,
  updateMedia,
  deleteMedia,
  shareMedia,
  getMediaCounts,
  getPublicResources,
  getAllMedia,
  bulkCreateMedia,
} from "../../controllers/albumController";
import { uploadSingleFile } from "../../helpers";
import {
  isAdmin,
  catchErrors,
  isAlbumValid,
  doesAlbumExist,
  isFileTypeValid,
  isMediaValid,
  doesMediaExist,
  isSuperAdmin,
} from "../../middlewares";

const albumRoutes = Router();
albumRoutes.post("/", isAdmin, isAlbumValid, catchErrors(createAlbum));
albumRoutes.get("/", getAlbums);
albumRoutes.get(
  "/:albumId",
  catchErrors(doesAlbumExist),
  catchErrors(getOneAlbum),
);
albumRoutes.patch(
  "/:albumId",
  isAdmin,
  catchErrors(doesAlbumExist),
  isAlbumValid,
  catchErrors(editAlbumInfo),
);

albumRoutes.delete(
  "/:albumId",
  isAdmin,
  catchErrors(doesAlbumExist),
  catchErrors(deleteAlbum),
);

albumRoutes.post(
  "/upload/:fileType",
  isAdmin,
  // isFileTypeValid,
  catchErrors(uploadSingleFile),
);
albumRoutes.delete(
  "/:fileType/:fileName",
  isFileTypeValid,
  catchErrors(deleteFile),
);
albumRoutes.post("/add", isAdmin, isMediaValid, catchErrors(addNewMedia));
albumRoutes.post("/sync", isSuperAdmin, catchErrors(bulkCreateMedia));
albumRoutes.patch(
  "/media/:mediaId",
  isAdmin,
  isMediaValid,
  catchErrors(doesMediaExist),
  catchErrors(updateMedia),
);
albumRoutes.delete(
  "/media/:mediaId/del",
  isAdmin,
  catchErrors(doesMediaExist),
  catchErrors(deleteMedia),
);
albumRoutes.get("/medias/:mediaType", catchErrors(getMedia));
albumRoutes.get("/medias/all/:mediaType", catchErrors(getAllMedia));
albumRoutes.get(
  "/download/:mediaId",
  catchErrors(doesMediaExist),
  catchErrors(downloadSong),
);
albumRoutes.get(
  "/share/:mediaId",
  catchErrors(doesMediaExist),
  catchErrors(shareMedia),
);
albumRoutes.get("/counts/media", isAdmin, catchErrors(getMediaCounts));
albumRoutes.get("/resources/:resourceType", catchErrors(getPublicResources));

export default albumRoutes;
