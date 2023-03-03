import NextLink from 'next/link'
import Image from 'next/image'
import { Box, Text, LinkBox, LinkOverlay } from '@chakra-ui/react'
import { Global } from '@emotion/react'

export const GridItem = ({ children, href, title, thumbnail }) => (
  <Box w="100%" textAlign="center">
    <LinkBox cursor="pointer">
      <Image
        src={thumbnail}
        alt={title}
        className="grid-item-thumbnail"
        placeholder="blur"
        loading="lazy"
      />
      <LinkOverlay href={href} target="_blank">
        <Text mt={2}>{title}</Text>
      </LinkOverlay>
      <Text fontSize={14}>{children}</Text>
    </LinkBox>
  </Box>
)

export const WorkGridItem = ({ children, id, title, thumbnail }) => (
  <Box w="100%" borderRadius="5px" textAlign="center" _hover={{
    background: "grey",
    borderRadius: "5px"
}}>
    <NextLink href={`/project/${id}`}>
      <LinkBox cursor="pointer" style= {{borderRadius: '20px'}}>
        <div borderRadius="lg">
          <Image
            borderRadius="lg" 
            w="full"
            src={thumbnail}
            alt={title}
            className="grid-item-thumbnail"
            placeholder="blur"
          />
        </div>
        
        <LinkOverlay href={`pages/works/${id}`}>
          <Text mt={2} fontSize={20} as='u' >
            {title}
          </Text>
        </LinkOverlay>
        <Text fontSize={14}>{children}</Text>
      </LinkBox>
    </NextLink>
  </Box>
)

export const GridItemStyle = () => (
  <Global
    styles={`
      .grid-item-thumbnail {
        border-radius: 12px;
      }
    `}
  />
)
