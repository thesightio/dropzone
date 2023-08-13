"use client";
import React, {useState, useEffect} from 'react';
import { Flex, Grid, Heading, Text, useToast  } from '@chakra-ui/react'
import { IconContext } from "react-icons";
import { PiImagesSquareDuotone } from "react-icons/pi"
import { AxiosProgressEvent } from 'axios'
import cn from "classnames"
import FilePreview from "@/components/filePreview/filePreview"
import styles from "@/styles/dropzone.module.scss"
import upload from "@/services/UploadService";

const PreviewItem = React.memo(FilePreview)

export interface StandardComponentProps {
    maxSize: number,
    availableTypes: string[]
}

interface IItem {
    file: File,
    status: String
}

const DropZone = ({maxSize, availableTypes}: StandardComponentProps): JSX.Element => {
    const toast = useToast()
    const [fileList, setFileList] = useState<IItem[]>()
    const [progress, setProgress] = useState<Number>(0)
    const [dragOver, setDragOver] = useState<Boolean>(false)

    const handleFiles = (e: Event):void => {
        let files = [...e.target?.files]
        fileProcessing(files)
    }

    const handleDrop = (e: DragEvent):void => {
        e.preventDefault();
        let files = [...e.dataTransfer?.files]
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
        if(info.size / (1024*1024) > maxSize) {
            toast({
                title: 'Ошибка',
                description: "Фаил превышает 3мб.",
                status: 'error',
                isClosable: true,
                position: 'bottom-right'
            })
            return false
        }
        if(!availableTypes.includes(info.type)) {
            toast({
                title: 'Ошибка',
                description: "Формат файла не поддерживается",
                status: 'error',
                isClosable: true,
                position: 'bottom-right'
            })
            return false
        }
        return true
    }

    const removeFile = (e: Event, item:IItem) => {
        e.stopPropagation();
        e.preventDefault();

        if(item.status === 'Loaded') {
            setFileList(fileList?.filter((file:IItem) => (file !== item)))

            toast({
                title: 'Успешно',
                description: "Фаил успешно удален",
                status: 'success',
                duration: 9000,
                isClosable: true,
                position: 'bottom-right'
            })
        }
    }

    useEffect(() => {
        if (fileList?.length) {
            uploadFiles(fileList)
        }
    }, [fileList])

    const uploadFiles = async(fileItems: IItem[]) => {
        try {
            for(const item of fileItems) {
                await uploadFile(item);
            }
        } catch (e) {
            console.error(e)
        }
    }

    const uploadFile = (fileItem: IItem) => new Promise((resolve, reject) => {
        if(fileItem.status !== 'Loaded') {
            fileItem.status = 'Started'
            upload(fileItem.file, (e: AxiosProgressEvent):void => {
                if(e.total) {
                    setProgress(Math.round((100 * e.loaded) / e.total))
                }
            }, () =>{
                toast({
                    title: 'Ошибка',
                    description: "К сожалению фаил небыл загружен",
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                    position: 'bottom-right'
                })
                reject(true)
            }, () => {
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

    const preventDrag = (e:Event) => {
        e.preventDefault()
        setDragOver(true)
    }

    const preventLeaveDrag = (e:Event) => {
        e.preventDefault()
        setDragOver(false)
    }

    return (
    <>
        <form action="/" onDrop={(e) => handleDrop(e)} onDragEnter={(e) => preventDrag(e)} onDragOver={(e) => preventDrag(e)} onDragLeave={(e) => preventLeaveDrag(e)}>
            <label htmlFor="fileInput" className={styles.dropzone} className={cn(styles.dropzone, {[styles.dropzone__dragover]: dragOver})}>
                {!fileList?.length && < Flex align="center" justify="center" height="100%" width="100%" direction="column">
                    <IconContext.Provider value={{ color: "#3182ce", size: "5em" }}>
                        <PiImagesSquareDuotone style={{margin: '0 auto 30px'}}/>
                    </IconContext.Provider>
                    <Heading>Загрузка изображений</Heading>
                    <Text opacity="0.5" marginTop="10px">Кликните по области или перетащите в нее файлы формата PNG, JPG, WebP или SVG.</Text>
                </Flex>}

                {(fileList && fileList.length > 0) && <Grid templateColumns='repeat(4, 1fr)' gap={6} position="absolute" top="0" left="0" width="100%" padding="40px" zIndex="1">
                    {fileList?.map((item: IItem) => (
                        <PreviewItem info={item} progress={progress} key={item.file.lastModified} onClick={(e) => removeFile(e, item)}/>
                    ))}
                </Grid>}
            </label>
            <input type="file" id="fileInput" name="file[]" multiple className={styles.dropzone__input} onChange={(e) => handleFiles(e)}/>
        </form>
    </>
  );
};

export default DropZone;