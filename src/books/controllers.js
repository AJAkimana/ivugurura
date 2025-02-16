// import path from "path";
import { createReadStream, existsSync } from "fs";
import { filePathsMap, QueryHelper, serverResponse } from "../helpers";
import { Book, BookCategory } from "../models";

const bookTb = new QueryHelper(Book);
const categoryTb = new QueryHelper(BookCategory);
/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const registerBook = async (req, res) => {
  const { bookFile, bookCover, ...rest } = req.body;

  const book = await bookTb.create({
    url: bookFile,
    coverImage: bookCover,
    ...rest,
  });

  return serverResponse(res, 200, "Success", book);
};

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const getBooks = async (req, res) => {
  const books = await bookTb.findAll();
  return serverResponse(res, 200, "Success", books);
};

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export const getBookCategories = async (req, res) => {
  const { languageId } = req.body;
  const categories = await categoryTb.findAll({ languageId });
  return serverResponse(res, 200, "Success", categories);
};

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const readBook = async (req, res) => {
  const { bookId } = req.params;
  const book = await bookTb.findOne({ id: bookId });

  const filePath = `${filePathsMap.bookFile}/${book?.url}`;

  if (!existsSync(filePath)) {
    return serverResponse(res, 404, "Book not found");
  }

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "inline"); // Forces viewing, not downloading
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate",
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Referrer-Policy", "no-referrer");

  const fileStream = createReadStream(filePath);
  return fileStream.pipe(res);
};
