import Imagekit from "imagekit"
import config from "../config/config.js";
import multer from "multer";
 
const client= new Imagekit({
    publicKey: "public_iKCTwuYr/I/F35OzRTV6XS7TLzo=",
    privateKey: config.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: "https://ik.imagekit.io/5qqb5wnro"
});

export const uploadImage = async ({buffer, fileName, folder="products"}) => {
    try {   
        const result = await client.upload({
            file: buffer,
            fileName: fileName,
            folder: folder,
        });
        return result;
    } catch (error) {
        throw error;
    }
};
export const upload = multer({ storage: multer.memoryStorage() 
    ,limits: { fileSize: 5 * 1024 * 1024 }
});


