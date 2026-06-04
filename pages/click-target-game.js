import { useEffect, useMemo, useRef, useState } from 'react'
import NextLink from 'next/link'
import { Box, Button, Heading, Text, VStack } from '@chakra-ui/react'
import Section from '../components/layouts/section'

const ROUND_SECONDS = 30

const randomPosition = () => {
  return {
    x: Math.random() * 86,
    y: Math.random() * 86
  }
}

const ClickTargetGame = () => {
  const [isRunning, setIsRunning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS)
  const [score, setScore] = useState(0)
  const [bestScore, setBestScore] = useState(0)
  const [targetPosition, setTargetPosition] = useState(() => randomPosition())
  const intervalRef = useRef(null)

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!isRunning) {
      return
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current)
          setIsRunning(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning])

  useEffect(() => {
    if (!isRunning && score > bestScore) {
      setBestScore(score)
    }
  }, [isRunning, score, bestScore])

  const statusText = useMemo(() => {
    if (isRunning) {
      return 'Hit the red target as many times as possible before time runs out.'
    }

    if (timeLeft === 0) {
      return 'Round finished. Press Start to play again.'
    }

    return 'Press Start, then click only on the red target for 30 seconds.'
  }, [isRunning, timeLeft])

  const startGame = () => {
    setScore(0)
    setTimeLeft(ROUND_SECONDS)
    setTargetPosition(randomPosition())
    setIsRunning(true)
  }

  const onTargetClick = event => {
    event.stopPropagation()

    if (!isRunning) {
      return
    }

    setScore(prev => prev + 1)
    setTargetPosition(randomPosition())
  }

  return (
    <Section delay={0.1}>
      <VStack spacing={5} align="stretch" mt={4}>
        <Heading as="h2" variant="page-title">
          Game - Click Target (30s)
        </Heading>

        <NextLink href="/game" passHref>
          <Button as="a" colorScheme="teal" variant="outline" alignSelf="flex-start">
            Back to Reaction Game
          </Button>
        </NextLink>

        <Text>{statusText}</Text>

        <Box display="flex" gap={4} flexWrap="wrap" fontSize={{ base: 'md', md: 'lg' }} fontWeight="semibold">
          <Text>Time: {timeLeft}s</Text>
          <Text>Score: {score}</Text>
          <Text>Best: {bestScore}</Text>
        </Box>

        <Button colorScheme="teal" onClick={startGame} alignSelf="flex-start">
          {isRunning ? 'Restart' : 'Start'}
        </Button>

        <Box
          position="relative"
          borderRadius="xl"
          borderWidth="2px"
          borderColor="teal.300"
          minH={{ base: '52vh', md: '420px' }}
          w="100%"
          overflow="hidden"
          bg="blue.500"
          boxShadow="lg"
          touchAction="manipulation"
        >
          <Box
            role="button"
            aria-label="Click target"
            onClick={onTargetClick}
            position="absolute"
            left={`${targetPosition.x}%`}
            top={`${targetPosition.y}%`}
            transform="translate(-50%, -50%)"
            w={{ base: '54px', md: '70px' }}
            h={{ base: '54px', md: '70px' }}
            borderRadius="full"
            bg="red.500"
            border="3px solid"
            borderColor="white"
            boxShadow="0 0 0 3px rgba(0,0,0,0.2)"
            cursor={isRunning ? 'pointer' : 'not-allowed'}
            opacity={isRunning ? 1 : 0.55}
            transition="left 0.08s linear, top 0.08s linear"
          />
        </Box>
      </VStack>
    </Section>
  )
}

export default ClickTargetGame