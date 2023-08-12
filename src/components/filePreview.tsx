"use client";

import {useState} from 'react';
import { Box, GridItem, Image, Spinner, Progress } from '@chakra-ui/react'
import { IconContext } from "react-icons";
import { PiTrashBold } from "react-icons/pi"
import cn from "classnames"
import styles from "@/styles/dropzone.module.scss"

const DropZone = (props: any): JSX.Element => {
    console.log('Props', props)

    const [preview, setPreview] = useState<String>('data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==')

    const reader:FileReader = new FileReader();
    reader.addEventListener('load', (e) => {
        setPreview(e.target?.result as String)
    })
    reader.readAsDataURL(props.info)

    return (
    <>
        <GridItem w='100%' h='91' className={cn(styles.dropzone__file, {[styles.dropzone__file_loading]: props.process !== 100})}>
            <Image objectFit='cover' position='absolute' left='0' top='0' width='100%' height='100%' src={preview}/>
            <Box className={styles.dropzone__file_remove}>
                <IconContext.Provider value={{ color: "white", size: "2em" }}>
                    <PiTrashBold/>
                </IconContext.Provider>
            </Box>
            {props.process !== 100 && <Spinner color='white' size='md' className={styles.dropzone__file_loader}/>}
            {props.process !== 100 && <Progress value={props.process} position="absolute" bottom="10px" left="10px" right="10px" height="4px" borderRadius="100px" className={styles.dropzone__file_progress}/>}
        </GridItem>
    </>
  );
};

export default DropZone;