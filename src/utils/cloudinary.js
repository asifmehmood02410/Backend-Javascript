import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { unlinkSync } from 'fs';

//fs stands for File System it is built in node js. it allow us to perform all operations with file read/write/update/delete etc

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {

    try {

        if (!localFilePath) return null;

        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'

        })

        console.log("my images local path is ", localFilePath)

        fs.unlinkSync(localFilePath) // remove the locally saved temporarly file as the upload operation got successfully

        //file has been uploaded successfully.
        console.log("File has been uploaded on cloudinary", response.url)

        return response;

    } catch (error) {

        fs.unlinkSync(localFilePath) // remove the locally saved temporarly file as the upload operation got failed

        return null;

    }


}

// cloudinary.v2.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
//     { public_id: "olympic_flag" },
//     function (error, result) { console.log(result); });

export { uploadOnCloudinary }