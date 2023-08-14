"use client";

import {useState, useEffect, MouseEventHandler} from 'react';
import { Box, GridItem, Image, Spinner, Progress } from '@chakra-ui/react'
import { IconContext } from "react-icons";
import { PiTrashBold } from "react-icons/pi"
import { InfoStatus } from "@/services/UploadService";
import cn from "classnames"
import styles from "@/styles/dropzone.module.scss"

export interface StandardComponentProps {
    info: {
        file: File,
        status: InfoStatus
    },
    progress: number,
    onClick: MouseEventHandler<HTMLDivElement>
}

const FilePreview = ({info, progress, onClick}: StandardComponentProps): JSX.Element => {
    const [preview, setPreview] = useState<string>('data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==')

    // TODO
    useEffect(() => {
        const reader:FileReader = new FileReader();
        reader.addEventListener('load', setPreviewB64)
        reader.readAsDataURL(info.file)
    }, [info.file.name])
    
    const setPreviewB64 = (e:ProgressEvent) => {
        setPreview(e.target?.result)
        e.target?.removeEventListener('load', setPreviewB64)
    }

    return (
    <>
        <GridItem w='100%' h='91' className={cn(styles.dropzone__file, {[styles.dropzone__file_loading]: info.status !== InfoStatus.Loaded})} onClick={onClick}>
            <Image objectFit='cover' position='absolute' left='0' top='0' width='100%' height='100%' src={preview}/>
            <Box className={styles.dropzone__file_remove}>
                <IconContext.Provider value={{ color: "white", size: "2em" }}>
                    <PiTrashBold/>
                </IconContext.Provider>
            </Box>
            {info.status !== InfoStatus.Loaded && <Spinner color='white' size='md' className={styles.dropzone__file_loader}/>}
            {info.status === InfoStatus.Started && <Progress value={progress} position="absolute" bottom="10px" left="10px" right="10px" height="4px" borderRadius="100px" className={styles.dropzone__file_progress}/>}
        </GridItem>
    </>
  );
};

export default FilePreview;