"use client";
import React, {useState, useEffect} from 'react';
import { Flex, Grid, Heading, Text } from '@chakra-ui/react'
import { IconContext } from "react-icons";
import { PiImagesSquareDuotone, PiTrashBold } from "react-icons/pi"
import FilePreview from "@/components/filePreview"
import styles from "@/styles/dropzone.module.scss"

const PreviewItem = React.memo(FilePreview)

interface IItem {
    file: File,
    process: Number
}

const DropZone = (): JSX.Element => {
    const [fileList, setFileList] = useState<IItem[]>()

    const handleFiles = (e: any):void => {
        let files = [...e.target.files]

        if(files?.length) {
            const fileNames = fileList?.map((file: IItem) => file.file.name)
            files = files.filter((file) => !fileNames?.includes(file.name))

            files = files.map((file) => {
                const fileInfo:IItem = {
                    file: file,
                    process: 0
                }
                return fileInfo
            })
        }

        setFileList(fileList !== undefined ? fileList.concat(files) : files)
    }

    useEffect(() => {
        if (fileList?.length) {
            uploadFiles(fileList)
        }
    }, [fileList])

    const uploadFiles = async(fileItems: IItem[]) => {
        try {
            for(const item of fileItems) {
                await uploadFile(item)
            }
        } catch(e) {
            console.error(e)
        }
    }

    const uploadFile = (fileItem: IItem) => new Promise((resolve, reject) => {
        // const fileInfo = fileItem.file
        const formData:FormData = new FormData()
        console.log("Append File", fileItem.file)
        formData.append('file', fileItem.file)
        console.log("UploadFile", formData)
        resolve(true)
    })

    return (
    <>
        <form action="/">
            <label htmlFor="fileInput" className={styles.dropzone} >
                {!fileList?.length && < Flex align="center" justify="center" height="100%" width="100%" direction="column">
                    <IconContext.Provider value={{ color: "blue", size: "5em" }}>
                        <PiImagesSquareDuotone style={{margin: '0 auto 30px'}}/>
                    </IconContext.Provider>
                    <Heading>Загрузка изображений</Heading>
                    <Text opacity="0.5" marginTop="10px">Кликните по области или перетащите в нее файлы формата PNG, JPG, WebP или SVG.</Text>
                </Flex>}

                {fileList?.length && <Grid templateColumns='repeat(4, 1fr)' gap={6} position="absolute" top="0" left="0" width="100%" padding="40px">
                    {fileList?.map((item: IItem) => (
                        <PreviewItem info={item.file} process={item.process} key={item.file.lastModified}/>
                    ))}
                </Grid>}
            </label>
            <input type="file" id="fileInput" name="file[]" multiple className={styles.dropzone__input} onChange={(e) => handleFiles(e)}/>
        </form>
    </>
  );
};

export default DropZone;