import { Image } from "cloudinary-react";

const DisplayImage = ({ publicId }: { publicId: string }) => {
  return (
    <Image
      cloudName="your_cloud_name"
      publicId={publicId}
      width={300}
      crop="scale"
      alt="Uploaded Image"
    />
  );
};

export default DisplayImage;
