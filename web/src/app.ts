import express, { Request, Response } from "express";
import { GoogleAuth } from "google-auth-library";
import got from "got";
import fs from "fs"
import path from "path"
import multer from "multer"
import FormData from "form-data"

const PORT = process.env.PORT || 3000;
const BACKEND_URL = process.env.BACKEND_URL as string;
const auth = new GoogleAuth();


const upload = multer();
const app = express();
app.use(express.static(path.resolve("dist")));
app.use(express.urlencoded());

let renderedHtml;

let serviceRequestOptions: {
    method: "POST",
    headers: Record<string, string>,
    body: FormData,
    responseType: string
}

const renderHtml = async () => {
    try {
        const html = fs.readFileSync(
            path.resolve("index.html"),
            "utf-8"
        );
        return html
    }
    catch (error) {
        throw Error('Error loading template: ' + error);
    }
}

app.get('/', async (res: Response) => {
    try{
        renderedHtml = await renderHtml();
        res.status(200).send(renderedHtml);
    }
    catch (error) {
        console.error('Error loading webpage: ', error)
        res.status(500).send(error);
    }
})

app.post('/file-upload', upload.single('file'), async (req: Request, res: Response) => {
    // make sure a file exists
    if (!req.file) {
        res.status(400).send("No file uploaded.");
        return;
    }
    // re-create form data to pass on to backend
    const {buffer, originalname, mimetype} = req.file;
    const form = new FormData();
    form.append("file", buffer, {
        filename: originalname,
        contentType: mimetype,
        });
    
    serviceRequestOptions = {
        method: "POST",
        headers: form.getHeaders(),
        body: form,
        responseType: "json",
    };

    // fetch gcp authorization token for backend
    try{
        const client = await auth.getIdTokenClient(BACKEND_URL);
        const clientHeaders = await client.getRequestHeaders();
        serviceRequestOptions.headers["Authorization"] = clientHeaders["Authorization"]
    }
    catch (error) {
        console.error('Could not create header with an identity token:', error);
    }

    // send request to backend and return result
    try {
        const serviceResponse = await got(`${BACKEND_URL}/file-upload`, serviceRequestOptions);
        res.status(200).json(serviceResponse.body);
    }
    catch (error) {
        console.error('Request to prediction service failed: ', error)
        res.status(500).json(error);
    }
});

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
  })