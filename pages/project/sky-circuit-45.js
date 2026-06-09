import { Container, Badge, ListItem, List, Button } from '@chakra-ui/react'
import { Title, WorkImage, Meta } from '../../components/work'
import P from '../../components/paragraph'
import Layout from '../../components/layouts/articles'
import Link from 'next/link'

const Work = () => {
  return (
    <Layout title="Sky Circuit 45">
      <Container>
        <Title>
          Sky Circuit 45 <Badge>2026</Badge>
        </Title>
        <P>
          Sky Circuit 45 is a simple JavaScript airplane shooting game with
          arcade-style sky stages, enemy waves, power-ups, and score chasing.
        </P>
        <List ml={4} my={4}>
          <ListItem>
            <Meta>Stack</Meta>
            <span>JavaScript, HTML5 Canvas</span>
          </ListItem>
        </List>

        <Link href="https://arcade-airplane-shooting.netlify.app/" isExternal="true" align="center">
          <div align="center">
            <Button colorScheme="teal" marginTop="10px">
              Play Game
            </Button>
          </div>
        </Link>

        <List ml={4} my={4}></List>
        <Badge colorScheme="teal" mb="3px">
          Gameplay
        </Badge>
        <WorkImage
          src="/images/works/sky-circuit-45/gameplay.jpg"
          alt="Sky Circuit 45 gameplay"
        />
      </Container>
    </Layout>
  )
}

export default Work
