import multer from "multer";

//cb stands for callback function
// we use multer because we can receive "file" parameter with req, file, cb

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./Public/temp")
    },
    filename: function (req, file, cb) {

        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.originalname)
    }
})

export const upload = multer({ storage: storage })
