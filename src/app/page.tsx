"use client";

import { Flex, Text } from '@chakra-ui/react'

import Dropzone from "@/components/dropZone/dropZone"

export default function Home() {
  return (
    <>
      <Flex justify="center" align="center" w="100%" h="100%" direction="column">
          <Dropzone/>
          <Text marginTop="20px" opacity="0.5" width="600px" align="center">Изображения должны соответствовать указанным форматам и не превышать размер в 3мб.</Text>
      </Flex>
    </>
  )
}
