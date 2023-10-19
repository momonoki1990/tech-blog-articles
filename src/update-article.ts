import fs from "fs";
import path from "path";
import fetch, { Response } from "node-fetch";
import { marked } from "marked";
import { ArticleFilePath } from "./model/ArticleFilePath";

type UpdateArticleBody = {
  title: string;
  content: string;
  categoryId: string;
  tagNames: string[];
  shouldPublish: boolean;
};

const checkArguments = (): ArticleFilePath => {
  const [firstCommand, secondCommand, thirdCommand] = process.argv;
  if (thirdCommand === undefined) {
    throw new Error(`Please provide article file path as third command`);
  }
  if (
    !firstCommand.includes("ts-node") ||
    !secondCommand.includes("update-article.ts") ||
    !thirdCommand.includes(".md")
  ) {
    throw new Error(
      `Unexpected command: ${JSON.stringify({
        firstCommand,
        secondCommand,
        thirdCommand,
      })}`
    );
  }
  return ArticleFilePath.CreateByFilePath(thirdCommand);
};

const updateArticle = async (
  articleId: string,
  body: UpdateArticleBody
): Promise<Response> => {
  const url = `http://localhost:1323/article/${articleId}`;
  const result = await fetch(url, {
    method: "PUT",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
  return result;
};

const main = async () => {
  const articleFilePath = checkArguments();

  if (articleFilePath.articleId === undefined) {
    throw new Error("Article id must be included in file name");
  }
  const content = fs.readFileSync(articleFilePath.filePath);
  const html = marked.parse(content.toString());

  // TODO: 記事に応じて書き換え
  const body: UpdateArticleBody = {
    title: "タイトル3Changed",
    content: html,
    categoryId: "298ba0bf-6a84-11ee-8ed1-0242ac160002",
    tagNames: ["タグ１", "タグ２", "タグ３"],
    shouldPublish: true,
  };

  await updateArticle(articleFilePath.articleId, body);

  console.log(`🎉Successfully updated article !`);
};

main();
