"use client";

import {useState, useEffect} from 'react';
import { Box, GridItem, Image, Spinner, Progress } from '@chakra-ui/react'
import { IconContext } from "react-icons";
import { PiTrashBold } from "react-icons/pi"
import cn from "classnames"
import styles from "@/styles/dropzone.module.scss"

const filePreview = (props: any): JSX.Element => {
    const [preview, setPreview] = useState<String>('data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==')

    const reader:FileReader = new FileReader();
    reader.addEventListener('load', (e) => {
        setPreview(e.target?.result as String)
    })
    reader.readAsDataURL(props.info.file)

    return (
    <>
        <GridItem w='100%' h='91' className={cn(styles.dropzone__file, {[styles.dropzone__file_loading]: props.info.status !== 'Loaded'})}>
            <Image objectFit='cover' position='absolute' left='0' top='0' width='100%' height='100%' src={preview}/>
            <Box className={styles.dropzone__file_remove}>
                <IconContext.Provider value={{ color: "white", size: "2em" }}>
                    <PiTrashBold/>
                </IconContext.Provider>
            </Box>
            {props.info.status !== 'Loaded' && <Spinner color='white' size='md' className={styles.dropzone__file_loader}/>}
            {props.info.status === 'Started' && <Progress value={props.progress} position="absolute" bottom="10px" left="10px" right="10px" height="4px" borderRadius="100px" className={styles.dropzone__file_progress}/>}
        </GridItem>
    </>
  );
};

export default filePreview;