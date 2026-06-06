import { Container, Badge, ListItem, List, Button } from '@chakra-ui/react'
import { Title, WorkImage, Meta } from '../../components/work'
import P from '../../components/paragraph'
import Layout from '../../components/layouts/articles'
import Link from 'next/link'

const Work = () => {
  return (
    <Layout title="Pixel Outbreak Survivor">
      <Container>
        <Title>
          Pixel Outbreak Survivor <Badge>2026</Badge>
        </Title>
        <P>
          Pixel Outbreak Survivor is a top-down city survival shooter where you
          survive zombie waves, collect upgrades, and keep rival survivors from
          pinning you down.
        </P>
        <List ml={4} my={4}>
          <ListItem>
            <Meta>Stack</Meta>
            <span>Vite, JavaScript, Canvas</span>
          </ListItem>
        </List>

        <Link href="https://pixel-zombie-shooting.netlify.app/" isExternal="true" align="center">
          <div align="center">
            <Button colorScheme="teal" marginTop="10px">
              Play
            </Button>
          </div>
        </Link>

        <List ml={4} my={4}></List>
        <Badge colorScheme="teal" mb="3px">
          Start Screen
        </Badge>
        <WorkImage
          src="/images/works/zombie-shooting/start-screen.png"
          alt="Pixel Outbreak Survivor start screen"
        />
        <Badge colorScheme="teal" mb="3px">
          Gameplay
        </Badge>
        <WorkImage
          src="/images/works/zombie-shooting/gameplay.png"
          alt="Pixel Outbreak Survivor gameplay"
        />
      </Container>
    </Layout>
  )
}

export default Work
