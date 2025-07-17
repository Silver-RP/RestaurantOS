declare module 'cloudinary-react' {
    interface ImageProps {
      cloudName: string;
      publicId: string;
      width?: number | string;
      height?: number | string;
      crop?: string;
      alt?: string;
    }
  
    export const Image: React.FC<ImageProps>;
  }