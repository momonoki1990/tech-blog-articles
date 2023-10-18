import fs from "fs";
import path from "path";
import fetch, { Response } from "node-fetch";
import { marked } from "marked";

class FilePath {
  filePath: string;
  fileName: string;
  extension: string;

  constructor(filePath: string, fileName: string, extension: string) {
    this.filePath = filePath;
    this.fileName = fileName;
    this.extension = extension;
  }

  public static CreateByFilePath(filePath: string) {
    const extension = path.extname(filePath);
    const fileName = path.basename(filePath, extension);
    return new FilePath(filePath, fileName, extension);
  }

  public CreateByAddingSuffixToFileName(suffix: string) {
    const newFileName = this.fileName + suffix;
    const newFilePath = `${path.dirname(this.filePath)}/${newFileName}${
      this.extension
    }`;
    return new FilePath(newFilePath, newFileName, this.extension);
  }
}

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
  const originalFilePath = FilePath.CreateByFilePath(articleFilePath);
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
  const newFilePath = originalFilePath.CreateByAddingSuffixToFileName(
    `_${articleId}`
  );
  await fs.promises.rename(originalFilePath.filePath, newFilePath.filePath);

  console.log(
    `🎉Successfully created article !\n
  Created article id is ${responseBody.articleId},\n
  File name has been changed to ${newFilePath.fileName}
  `
  );
};

main();
