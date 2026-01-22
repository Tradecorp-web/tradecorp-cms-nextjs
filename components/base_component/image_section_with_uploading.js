import { Icon, IconButton, InputBase, Link } from "@material-ui/core"
import { useState } from "react";
import { uploadFileApi } from "../../services/api/file.api";
import { CircularProgressCustom } from "./spinner";

export function ImageSectionWithUploading({images, id, path, imagesUpdated}) {
    id = id ?? "uploadFile"
    images = images ?? []

    const [isLoading, setLoading] = useState(false)

    const uploadFileProccess = async (e) => {
        const file = e.target.files[0];
        path = path ?? "general"
        setLoading(true)
        try {
            var response = await uploadFileApi(path, file)
            images.push(response)
            imagesUpdated(images)
        } catch (err) {
            console.log(err)
        }
        setLoading(false)
        document.getElementById(id).value = null
    }
    
    function deleteImage(index) {
        images.splice(index, 1);
        imagesUpdated(images)
    }

    return (<>
        <div className="mt-4 image-wrapper">
            <div 
                src="https://img.jakpost.net/c/2016/09/29/2016_09_29_13000_1475122891._large.jpg" 
                className="image-upload-button me-2 mb-2"
                onClick={() => document.getElementById(id).click()}
                width="80"
                height="80">
                {!isLoading && <Icon style={{color: "#aaa", fontSize: 30}}>cloud_upload</Icon>}
                {isLoading && <CircularProgressCustom />}
            </div>
            {(images ?? [])?.map((img, index) => {
                return <div key={index} style={{width: 80, height: 80}} className="image-item me-2 mb-2">
                    <Link href={img} target="_blank">
                        <img src={img} width="80" height="80"/>
                    </Link>
                    <span
                        className="image-delete-button"
                        onClick={() => deleteImage(index)}
                        size="small">
                        <Icon style={{fontSize: 14}}>close</Icon>
                    </span>
                </div>
            })}
        </div>
        <InputBase
            onChange={uploadFileProccess}
            style={{display: "none"}}
            id={id}
            type="file"
            accept="image/png, image/jpeg"/>
        {/*language=CSS*/}
        <style jsx>{`
            .image-item {
                overflow: hidden;
                position: relative;
            }
            .image-item img {
                border-radius: 8px;
                border: 1px solid #ededed;
            }
            .image-delete-button {
                position: absolute;
                top: 4px;
                right: 4px;
                background: #ffffff3b;
                border-radius: 50px;
                width: 16px;
                height: 16px;
                display: none;
                text-align: center;
                cursor: pointer;
            }
            .image-item:hover .image-delete-button {
                display: block;
            }
            .image-item:hover .image-delete-button:hover {
                background: #ffffff80;
            }
            .image-wrapper {
                display: flex;
                width: 100%;
                flex-wrap: wrap;
            }
            .image-upload-button {
                width: 80px;
                height: 80px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #efefef;
                border-radius: 8px;
                border: 1px solid #ddd;
                cursor: pointer;
            }
            .image-upload-button:hover {
                background: #e5e5e5;
            }
        `}</style>
    </>)
}