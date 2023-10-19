import { ArticleFilePath } from "./ArticleFilePath";

describe("ArticleFilePath", () => {
  describe("GetArticleIdFromFileName", () => {
    it("should return the articleId when a valid file name is provided", () => {
      const fileName = "sample_article_11111111-1111-1111-1111-111111111111";
      const articleId = ArticleFilePath.GetArticleIdFromFileName(fileName);
      expect(articleId).toBe("11111111-1111-1111-1111-111111111111");
    });

    it("should return undefined when the file name does not contain the divider", () => {
      const fileName = "sampleFileName";
      const articleId = ArticleFilePath.GetArticleIdFromFileName(fileName);
      expect(articleId).toBeUndefined();
    });

    it("should return undefined when an invalid articleId is provided", () => {
      const fileName = "sample_invalidId";
      const articleId = ArticleFilePath.GetArticleIdFromFileName(fileName);
      expect(articleId).toBeUndefined();
    });
  });
});
