"use client";

import {useState, MouseEventHandler} from 'react';
import { Box, GridItem, Image, Spinner, Progress } from '@chakra-ui/react'
import { IconContext } from "react-icons";
import { PiTrashBold } from "react-icons/pi"
import cn from "classnames"
import styles from "@/styles/dropzone.module.scss"

export interface StandardComponentProps {
    info: {
        file: File,
        status: string
    },
    progress: number,
    onClick: MouseEventHandler<HTMLDivElement>
}

const filePreview = ({info, progress, onClick}: StandardComponentProps): JSX.Element => {
    const [preview, setPreview] = useState<string>('data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==')

    const reader:FileReader = new FileReader();
    reader.addEventListener('load', (e) => {
        setPreview(e.target?.result as string)
    })
    reader.readAsDataURL(info.file)

    return (
    <>
        <GridItem w='100%' h='91' className={cn(styles.dropzone__file, {[styles.dropzone__file_loading]: info.status !== 'Loaded'})} onClick={onClick}>
            <Image objectFit='cover' position='absolute' left='0' top='0' width='100%' height='100%' src={preview}/>
            <Box className={styles.dropzone__file_remove}>
                <IconContext.Provider value={{ color: "white", size: "2em" }}>
                    <PiTrashBold/>
                </IconContext.Provider>
            </Box>
            {info.status !== 'Loaded' && <Spinner color='white' size='md' className={styles.dropzone__file_loader}/>}
            {info.status === 'Started' && <Progress value={progress} position="absolute" bottom="10px" left="10px" right="10px" height="4px" borderRadius="100px" className={styles.dropzone__file_progress}/>}
        </GridItem>
    </>
  );
};

export default filePreview;