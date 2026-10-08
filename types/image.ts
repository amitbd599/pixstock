export interface ImageType {
  _id: string;
  title: string;
  description?: string;
  alt?: string;
  tags: string[];
  category?: string;
  slug: string;
  previewUrl: string;
  originalUrl: string;
  largeUrl: string;
  mediumUrl: string;
  thumbnailUrl: string;
  width: number;
  height: number;
  size: number;
  format: string;
  views: number;
  downloads: number;
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
}
