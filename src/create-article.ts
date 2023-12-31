import fs from "fs";
import fetch, { Response } from "node-fetch";
import { marked } from "marked";
import { ArticleFilePath } from "./model/ArticleFilePath";

type CreateArticleBody = {
  title: string;
  content: string;
  categoryId: string;
  tagNames: string[];
  shouldPublish: boolean;
};

type CreateArticleResponseBody = {
  articleId: string;
};

const checkArguments = (
  firstCommand: string,
  secondCommand: string,
  extension: string
) => {
  if (
    !firstCommand.includes("ts-node") ||
    !secondCommand.includes("create-article.ts") ||
    extension !== ".md"
  ) {
    throw new Error(
      `Unexpected command: ${JSON.stringify({
        firstCommand,
        secondCommand,
        extension: extension,
      })}`
    );
  }
};

const createArticle = async (body: CreateArticleBody): Promise<Response> => {
  const url = "http://localhost:1323/article";
  const result = await fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
  return result;
};

const main = async () => {
  const [firstCommand, secondCommand, articleFilePath] = process.argv;
  const originalFilePath = ArticleFilePath.CreateByFilePath(articleFilePath);
  checkArguments(firstCommand, secondCommand, originalFilePath.extension);

  const content = fs.readFileSync(articleFilePath);
  const html = marked.parse(content.toString());

  // TODO: 記事に応じて書き換え
  const body: CreateArticleBody = {
    title: "タイトル3",
    content: html,
    categoryId: "298ba0bf-6a84-11ee-8ed1-0242ac160002",
    tagNames: ["タグ１", "タグ２"],
    shouldPublish: false,
  };

  const res = await createArticle(body);
  const responseBody = JSON.parse(
    await res.text()
  ) as CreateArticleResponseBody;

  const { articleId } = responseBody;
  const newFilePath = originalFilePath.createWithArticleId(articleId);
  await fs.promises.rename(originalFilePath.filePath, newFilePath.filePath);

  console.log(
    `🎉Successfully created article !\n
  Created article id is ${responseBody.articleId},\n
  File name has been changed to ${newFilePath.fileName}
  `
  );
};

main();
