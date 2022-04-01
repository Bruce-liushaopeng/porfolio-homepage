import { Container,Badge,Link,List,ListItem } from "@chakra-ui/react";
import { ExternalLinkIcon } from '@chakra-ui/icons'
import {Title,WorkImage,Meta} from '../../components/work'
import P from '../../components/paragraph'
import Layout from '../../components/layouts/articles'

const Work = () => {
    return (
        <Layout title="riskGame">
            <Container>
                <Title>
                    Risk Game <Badge>2020</Badge>
                </Title>
                <P>
                    A multiplayer world-conquring game with save-load feature, AI player option, maximum 6 player, and multiple maps choice available
                </P>
                <List ml={4} my={4}>
                    <ListItem>
                        <Meta>Stack</Meta>
                        <span>Java, Maven, Swing</span>
                    </ListItem>

                </List>
                <List ml={4} my={4}></List>
            </Container>
        </Layout>
    )
}

export default Work