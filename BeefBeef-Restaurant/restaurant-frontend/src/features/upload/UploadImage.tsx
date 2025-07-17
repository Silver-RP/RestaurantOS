import React, { useState } from 'react'
const UploadImage = () => {
    const [imageUrl, setImageUrl] = useState<string>(""); 
    const handleImageUpload = async(event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const fileUrl = URL.createObjectURL(file);
            setImageUrl(fileUrl);
        }
        const formData = new FormData(); 
        formData.append("file", file as Blob);
        formData.append("upload_preset", "FE-Restaurant");
        const response = await fetch("https://api.cloudinary.com/v1_1/dv9lzgkes/image/upload", {
            method: "POST",
            body: formData,
        });
        const data = await response.json();
        setImageUrl(data.secure_url);
    }
    return (
        <div>
            <input type="file" onChange={handleImageUpload}/>
            <img src={imageUrl} alt="upload" />
        
        </div>
    )
}
export default UploadImage; 
