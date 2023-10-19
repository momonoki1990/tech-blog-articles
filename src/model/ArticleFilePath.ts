import path from "path";
import validate from "uuid-validate";

export class ArticleFilePath {
  private static DEVIDER: string = "_";

  private constructor(
    public filePath: string,
    public fileName: string,
    public extension: string,
    public articleId: string | undefined
  ) {}

  public static CreateByFilePath(filePath: string): ArticleFilePath {
    const extension = path.extname(filePath);
    const fileName = path.basename(filePath, extension);
    const articleId = ArticleFilePath.GetArticleIdFromFileName(fileName);
    return new ArticleFilePath(filePath, fileName, extension, articleId);
  }

  public createWithArticleId(articleId: string): ArticleFilePath {
    if (ArticleFilePath.GetArticleIdFromFileName(this.fileName) !== undefined) {
      throw new Error("Article id is already included in file name");
    }
    const newFileName = `${this.fileName}${ArticleFilePath.DEVIDER}${articleId}`;
    const newFilePath = `${path.dirname(this.filePath)}/${newFileName}${
      this.extension
    }`;
    return new ArticleFilePath(
      newFilePath,
      newFileName,
      this.extension,
      articleId
    );
  }

  public static GetArticleIdFromFileName(fileName: string): string | undefined {
    if (!fileName.includes(ArticleFilePath.DEVIDER)) {
      return undefined;
    }
    const splitted = fileName.split(ArticleFilePath.DEVIDER);
    const articleId = splitted.slice(-1)[0];
    if (!validate(articleId)) {
      return undefined;
    }
    return articleId;
  }
}
