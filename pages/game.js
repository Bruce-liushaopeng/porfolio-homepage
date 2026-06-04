import { useEffect, useMemo, useRef, useState } from 'react'
import NextLink from 'next/link'
import { Box, Button, Heading, Text, VStack } from '@chakra-ui/react'
import Section from '../components/layouts/section'

const MIN_DELAY_MS = 1500
const MAX_DELAY_MS = 4500

const getRandomDelay = () => {
  return Math.floor(Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS + 1)) + MIN_DELAY_MS
}

const Game = () => {
  const [status, setStatus] = useState('idle')
  const [result, setResult] = useState(null)
  const timerRef = useRef(null)
  const startTimeRef = useRef(0)

  const panelColor = useMemo(() => {
    if (status === 'red') return 'red.500'
    return 'blue.500'
  }, [status])

  const panelMessage = useMemo(() => {
    if (status === 'idle') return 'Tap Start, then wait for red.'
    if (status === 'waiting') return 'Wait... do not tap yet.'
    if (status === 'red') return 'Tap now!'
    if (status === 'result') return 'Tap Start to try again.'
    return ''
  }, [status])

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  const startRound = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    setResult(null)
    setStatus('waiting')

    timerRef.current = setTimeout(() => {
      startTimeRef.current = performance.now()
      setStatus('red')
    }, getRandomDelay())
  }

  const onPanelClick = () => {
    if (status === 'red') {
      const reactionMs = Math.round(performance.now() - startTimeRef.current)
      setResult(`${reactionMs} ms`)
      setStatus('result')
      return
    }

    if (status === 'waiting') {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
      setResult('Too early! Wait for red.')
      setStatus('result')
    }
  }

  return (
    <Section delay={0.1}>
      <VStack spacing={5} align="stretch" mt={4}>
        <Heading as="h2" variant="page-title">
          Game - Reaction Test
        </Heading>

        <NextLink href="/click-target-game" passHref>
          <Button as="a" colorScheme="teal" variant="outline" alignSelf="flex-start">
            Try Click Target Game (30s)
          </Button>
        </NextLink>

        <NextLink href="/dice-game" passHref>
          <Button as="a" colorScheme="teal" variant="outline" alignSelf="flex-start">
            Try 3D Dice Game
          </Button>
        </NextLink>

        <Text>
          Reaction Time Test: the panel stays blue, turns red after a random delay, then tap as fast as you can.
        </Text>

        <Box
          role="button"
          aria-label="Reaction time panel"
          tabIndex={0}
          onClick={onPanelClick}
          onKeyDown={event => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              onPanelClick()
            }
          }}
          bg={panelColor}
          color="white"
          borderRadius="xl"
          minH={{ base: '48vh', md: '360px' }}
          px={{ base: 4, md: 8 }}
          py={{ base: 8, md: 10 }}
          display="flex"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          fontSize={{ base: 'xl', md: '2xl' }}
          fontWeight="bold"
          cursor={status === 'waiting' || status === 'red' ? 'pointer' : 'default'}
          userSelect="none"
          boxShadow="lg"
        >
          {panelMessage}
        </Box>

        <Button colorScheme="teal" onClick={startRound} alignSelf="flex-start">
          Start
        </Button>

        {result && (
          <Text fontSize={{ base: 'lg', md: 'xl' }} fontWeight="semibold">
            Result: {result}
          </Text>
        )}
      </VStack>
    </Section>
  )
}

export default Game