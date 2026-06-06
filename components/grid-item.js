import NextLink from 'next/link'
import Image from 'next/image'
import { Box, Text, LinkBox, LinkOverlay } from '@chakra-ui/react'
import { Global } from '@emotion/react'
import classes from "./grid-item.module.css";

export const GridItem = ({ children, href, title, thumbnail }) => (
  <Box w="100%" textAlign="center">
    <LinkBox cursor="pointer">
      <Image
        src={thumbnail}
        alt={title}
        className="grid-item-thumbnail"
        placeholder="blur"
        loading="lazy"
        unoptimized
      />
      <LinkOverlay href={href} target="_blank">
        <Text mt={2}>{title}</Text>
      </LinkOverlay>
      <Text fontSize={14}>{children}</Text>
    </LinkBox>
  </Box>
)

export const WorkGridItem = ({ children, id, title, thumbnail }) => (
  <Box
    w="100%"
    textAlign="center"
  >
    <NextLink href={`/project/${id}`}>
      <LinkBox cursor="pointer" className={classes.linkBox} height={"280px"}>
          <Image
            width={700}
            height={400}
            objectFit="cover"
            src={thumbnail}
            alt={title}
            className={classes.gridItem}
            placeholder="blur"
            borderRadius="12px"
            unoptimized
          />

        <LinkOverlay as={NextLink} href={`/project/${id}`}>
          <Text
            mt={2}
            fontSize={22}
            fontWeight="bold"
            _hover={{ color: "teal" }}
          >
            {title}
          </Text>
        </LinkOverlay>
        <Text fontSize={14} paddingBottom={4}>
          {children}
        </Text>
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
