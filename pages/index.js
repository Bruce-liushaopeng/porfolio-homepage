import { ChevronRightIcon } from '@chakra-ui/icons'
import NextLink from 'next/link'
import { Button,Container,Icon, Box, Heading, Image, List,Link,ListItem, HStack, Flex} from '@chakra-ui/react'
import Section from '../components/layouts/section'
import Paragraph from '../components/paragraph'
import { BioSection, BioYear } from '../components/bio'
import Layout from '../components/layouts/articles'
import {AiFillGithub} from 'react-icons/ai'
import {AiFillLinkedin} from 'react-icons/ai'
import { FaPython} from 'react-icons/fa'
import {SiJavascript, SiJava, SiHtml5, SiCss3, SiTypescript, SiMongodb, SiSpring, SiAngular, SiReact, SiMysql} from 'react-icons/si'
import { DiNodejs} from 'react-icons/di'
const Page = () =>{
    return (
        <Layout>
        <Container>
        <Box display = {{md:'flex'}}>
            <Box flexGrow={1}>
                <Heading as="h2" variant="page-title">
                    Shaopeng Bruce Liu
                </Heading>
            <p >Software Developer (Open for opportunity)</p>
            <Box flexShrink={0} mt={{base:6,md:3}} ml={{md:6}} align="center">
                <Image borderColor = "whiteAlpha.800" borderWidth={2} borderStyle="solid" maxWidth="130px" display="inline-block" borderRadius="full" src = "images/bruce.jpg" alt="profile image"/>
            </Box>
        </Box>
        </Box>
        <Section delay={0.1}>
            <Heading as="h3" variant="section-title">
                About Me
            </Heading>
            <Paragraph>
            I am a Full-stack developer who loves reading tech blogs and explore all the fun within. Through school and internships I have gained experience in multiple frameworks including React, React Native, and Angular. Additionally, my knowledge of Spring Boot and Node.js enables me to efficiently create API endpoints. In terms of databases, I am skilled in designing data models and proficiently working with both NonSQL and SQL databases. 
            </Paragraph>
        <Box align="center" my={4}>
            <NextLink href="/project">
                <Button rightIcon={<ChevronRightIcon/>} colorScheme="teal">
                   My portfolio
                </Button> 
            </NextLink>
        </Box>
        </Section>
        <Section delay={0.1}>
            <Heading as="h3" variant="section-title">
            Tech Stack
            </Heading>
           <List>
               <Icon ml="9px" as={SiJavascript} boxSize="9" bg="none" color="teal.400"/>
               <Icon ml="9px" as={SiTypescript} boxSize="9" bg="none" color="teal.400"/>
               <Icon ml="9px" as={SiReact} boxSize="9" bg="none" color="teal.400"/>
               <Icon ml="9px" as={SiAngular} boxSize="9" bg="none" color="teal.400"/>
               <Icon ml="9px" as={SiSpring} boxSize="9" bg="none" color="teal.400"/>
               <Icon ml="9px" as={SiHtml5} boxSize="9" bg="none" color="teal.400"/>
               <Icon ml="9px" as={SiCss3} boxSize="9" bg="none" color="teal.400"/>
               <Icon ml="9px" as={SiJava} boxSize="9" bg="none" color="teal.400"/>
               <Icon ml="9px" as={FaPython} boxSize="9" bg="none" color="teal.400"/>
               <Icon ml="9px" as={DiNodejs} boxSize="9" bg="none" color="teal.400"/>
               <Icon ml="9px" as={SiMysql} boxSize="9" bg="none" color="teal.400"/>
               <Icon ml="9px" as={SiMongodb} boxSize="9" bg="none" color="teal.400"/>
           </List>
            
        </Section>
        
        <Section delay={0.2}>
            <Heading as="h3" variant="section-title">
            Bio
            </Heading>
            <BioSection>
                <BioYear>1999</BioYear>
                Born in Guangdong, China.
            </BioSection>
            <BioSection>
                <BioYear>2017</BioYear>
                Start Bachelor degree in Software Engineering at Carleton University
            </BioSection>
            <BioSection>
                <BioYear>2021</BioYear>
                Internship at Environment and Climate Change Canada as Data Scientist.(8 months)
            </BioSection>
            <BioSection>
                <BioYear>2021</BioYear>
                Internship at March Networks as front-end Developer.(4 months)
            </BioSection>
            <BioSection>
                <BioYear>2022</BioYear>
                Internship at Corning as full-stack Developer.(4 months)
            </BioSection>
            <BioSection>
                <BioYear>2023</BioYear>
                Graduated from Carleton University with Software Eningeering Degree
            </BioSection>
            

        </Section>

        <Section delay={0.3}>
            <Heading as="h3" variant="section-title">
            I ♥ 
            </Heading>
            <Paragraph>
            Social Events, Concert, Biking, Gym, Kick-boxing
            </Paragraph>

        </Section>
        <Section delay={0.3}>
            <Heading as="h3" variant="section-title">
                On the web
            </Heading>
            <List>
                <ListItem>
                <Link href="https://github.com/Bruce-liushaopeng" target="_blank">
                    <Button variant="ghost" colorScheme={"teal"} leftIcon={<Icon as={AiFillGithub}/>}>
                        @Bruce-liushaopeng
                    </Button>
                </Link>
                </ListItem>
                <ListItem>
                <Link href="https://www.linkedin.com/in/shaopeng-liu-953982195" target="_blank">
                    <Button variant="ghost" colorScheme={"teal"} leftIcon={<Icon as={AiFillLinkedin}/>}>
                        Linkedin
                    </Button>
                </Link>
                </ListItem>
            </List>
        </Section>

        
        </Container>
        </Layout>
    )
}

export default Page 