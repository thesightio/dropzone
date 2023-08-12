"use client";
import React, {useState, useEffect} from 'react';
import { Flex, Grid, Heading, Text, useToast  } from '@chakra-ui/react'
import { IconContext } from "react-icons";
import { PiImagesSquareDuotone } from "react-icons/pi"
import axios, { AxiosProgressEvent } from 'axios'
import cn from "classnames"
import FilePreview from "@/components/filePreview"
import styles from "@/styles/dropzone.module.scss"
import upload from "@/services/UploadService";

const PreviewItem = React.memo(FilePreview)

interface IItem {
    file: File,
    status: String
}

const DropZone = (): JSX.Element => {
    const toast = useToast()
    const [fileList, setFileList] = useState<IItem[]>()
    const [progress, setProgress] = useState<Number>(0)
    const [dragOver, setDragOver] = useState<Boolean>(false)

    const availableTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp'
    ]

    const handleFiles = (e: any):void => {
        let files = [...e.target.files]
        fileProcessing(files)
    }

    const handleDrop = (e: any):void => {
        e.preventDefault();
        let files = [...e.dataTransfer.files]
        fileProcessing(files)
    }

    const fileProcessing = (files: File[]) => {
        setDragOver(false)
        
        if(files?.length) {
            const fileNames = fileList?.map((file: IItem) => file.file.name)
            files = files.filter((file) => !fileNames?.includes(file.name))

            files = files.filter((file) => checkFile(file))

            files = files.map((file: File) => {
                const fileInfo:IItem = {
                    file: file,
                    status: 'Pending'
                }
                return fileInfo
            })
        }

        setFileList(fileList !== undefined ? fileList.concat(files) : files)
    }

    const checkFile = (info: File):boolean => {
        console.log('CheckFile', info);
        if(info.size / (1024*1024) > 3) {
            toast({
                title: 'Ошибка',
                description: "Фаил превышает 3мб.",
                status: 'error',
                isClosable: true
            })
            return false
        }
        if(!availableTypes.includes(info.type)) {
            toast({
                title: 'Ошибка',
                description: "Формат файла не поддерживается",
                status: 'error',
                isClosable: true
            })
            return false
        }
        return true
    }

    useEffect(() => {
        if (fileList?.length) {
            uploadFiles(fileList)
        }
    }, [fileList])

    const uploadFiles = async(fileItems: IItem[]):void => {
        try {
            let i:number = 0
            for(const item of fileItems) {
                await uploadFile(item);
                i++;
            }
        } catch (e) {
            console.error(e)
        }
    }

    const uploadFile = (fileItem: IItem) => new Promise((resolve, reject) => {
        if(fileItem.status !== 'Loaded') {
            fileItem.status = 'Started'
            upload(fileItem.file, (e: AxiosProgressEvent):void => {
                setProgress(Math.round((100 * e.loaded) / e.total))
            }, () =>{
                toast({
                    title: 'Ошибка',
                    description: "К сожалению фаил небыл загружен",
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                })
                reject(true)
            }, () => {
                console.log("FINISHED")
                setTimeout(() => {
                    setProgress(0)
                    fileItem.status = 'Loaded'
                    resolve(true)
                }, 0)
            })
        } else {
            resolve(true)
        }
    })

    const preventDrag = (e) => {
        e.preventDefault()
        setDragOver(true)
    }

    const preventLeaveDrag = (e) => {
        e.preventDefault()
        setDragOver(false)
    }

    return (
    <>
        <form action="/" onDrop={(e) => handleDrop(e)} onDragEnter={(e) => preventDrag(e)} onDragOver={(e) => preventDrag(e)} onDragLeave={(e) => preventLeaveDrag(e)}>
            <label htmlFor="fileInput" className={styles.dropzone} className={cn(styles.dropzone, {[styles.dropzone__dragover]: dragOver})}>
                {!fileList?.length && < Flex align="center" justify="center" height="100%" width="100%" direction="column">
                    <IconContext.Provider value={{ color: "blue", size: "5em" }}>
                        <PiImagesSquareDuotone style={{margin: '0 auto 30px'}}/>
                    </IconContext.Provider>
                    <Heading>Загрузка изображений</Heading>
                    <Text opacity="0.5" marginTop="10px">Кликните по области или перетащите в нее файлы формата PNG, JPG, WebP или SVG.</Text>
                </Flex>}

                {fileList?.length && <Grid templateColumns='repeat(4, 1fr)' gap={6} position="absolute" top="0" left="0" width="100%" padding="40px">
                    {fileList?.map((item: IItem) => (
                        <PreviewItem info={item} progress={progress} key={item.file.lastModified}/>
                    ))}
                </Grid>}
            </label>
            <input type="file" id="fileInput" name="file[]" multiple className={styles.dropzone__input} onChange={(e) => handleFiles(e)}/>
        </form>
    </>
  );
};

export default DropZone;