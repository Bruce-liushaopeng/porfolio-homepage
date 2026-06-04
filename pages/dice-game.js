import { useEffect, useRef, useState } from 'react'
import NextLink from 'next/link'
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { Box, Button, Heading, Text, VStack } from '@chakra-ui/react'
import Section from '../components/layouts/section'

const DICE_SIZE = 1
const FLOOR_Y = DICE_SIZE / 2
const PIP_SCALE = 0.28

const pipLayouts = {
  1: [[0, 0]],
  2: [[-1, -1], [1, 1]],
  3: [[-1, -1], [0, 0], [1, 1]],
  4: [[-1, -1], [1, -1], [-1, 1], [1, 1]],
  5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]],
  6: [[-1, -1.2], [1, -1.2], [-1, 0], [1, 0], [-1, 1.2], [1, 1.2]]
}

const facePipMap = [
  {
    value: 3,
    normal: new THREE.Vector3(1, 0, 0),
    u: new THREE.Vector3(0, 0, -1),
    v: new THREE.Vector3(0, 1, 0)
  },
  {
    value: 4,
    normal: new THREE.Vector3(-1, 0, 0),
    u: new THREE.Vector3(0, 0, 1),
    v: new THREE.Vector3(0, 1, 0)
  },
  {
    value: 1,
    normal: new THREE.Vector3(0, 1, 0),
    u: new THREE.Vector3(1, 0, 0),
    v: new THREE.Vector3(0, 0, 1)
  },
  {
    value: 6,
    normal: new THREE.Vector3(0, -1, 0),
    u: new THREE.Vector3(1, 0, 0),
    v: new THREE.Vector3(0, 0, -1)
  },
  {
    value: 2,
    normal: new THREE.Vector3(0, 0, 1),
    u: new THREE.Vector3(1, 0, 0),
    v: new THREE.Vector3(0, 1, 0)
  },
  {
    value: 5,
    normal: new THREE.Vector3(0, 0, -1),
    u: new THREE.Vector3(-1, 0, 0),
    v: new THREE.Vector3(0, 1, 0)
  }
]

const buildDiceMesh = () => {
  const diceGeometry = new RoundedBoxGeometry(DICE_SIZE, DICE_SIZE, DICE_SIZE, 5, 0.14)
  const diceMaterial = new THREE.MeshStandardMaterial({ color: '#fafafa', roughness: 0.42, metalness: 0.08 })
  const pipGeometry = new THREE.CylinderGeometry(0.06, 0.06, 0.02, 20)
  const pipMaterial = new THREE.MeshStandardMaterial({ color: '#bf1b2c', roughness: 0.5, metalness: 0.05 })

  const dice = new THREE.Mesh(diceGeometry, diceMaterial)
  dice.castShadow = true
  dice.receiveShadow = false

  const half = DICE_SIZE / 2
  const faceInset = half + 0.008

  facePipMap.forEach(face => {
    const points = pipLayouts[face.value]
    points.forEach(([px, py]) => {
      const pip = new THREE.Mesh(pipGeometry, pipMaterial)
      const local = new THREE.Vector3()
      local
        .copy(face.normal)
        .multiplyScalar(faceInset)
        .add(face.u.clone().multiplyScalar(px * PIP_SCALE))
        .add(face.v.clone().multiplyScalar(py * PIP_SCALE))

      pip.position.copy(local)
      pip.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), face.normal)
      pip.castShadow = true
      pip.receiveShadow = false
      dice.add(pip)
    })
  })

  return {
    dice,
    diceGeometry,
    diceMaterial,
    pipGeometry,
    pipMaterial
  }
}

const getStableQuaternionForFace = value => {
  if (value === 1) return new THREE.Quaternion()
  if (value === 6) return new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI, 0, 0))
  if (value === 2) return new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0))
  if (value === 5) return new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0))
  if (value === 3) return new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, Math.PI / 2))
  return new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, -Math.PI / 2))
}

const getTopFaceValue = quaternion => {
  const faces = [
    { value: 3, normal: new THREE.Vector3(1, 0, 0) },
    { value: 4, normal: new THREE.Vector3(-1, 0, 0) },
    { value: 1, normal: new THREE.Vector3(0, 1, 0) },
    { value: 6, normal: new THREE.Vector3(0, -1, 0) },
    { value: 2, normal: new THREE.Vector3(0, 0, 1) },
    { value: 5, normal: new THREE.Vector3(0, 0, -1) }
  ]

  let best = faces[0]
  let bestY = -Infinity

  for (const face of faces) {
    const worldNormal = face.normal.clone().applyQuaternion(quaternion)
    if (worldNormal.y > bestY) {
      bestY = worldNormal.y
      best = face
    }
  }

  return best.value
}

const DiceGame = () => {
  const mountRef = useRef(null)
  const rendererRef = useRef(null)
  const diceRef = useRef(null)
  const animationRef = useRef(null)
  const velocityRef = useRef(new THREE.Vector3(0, 0, 0))
  const angularVelocityRef = useRef(new THREE.Vector3(0, 0, 0))
  const rollingRef = useRef(false)
  const settleRef = useRef({
    active: false,
    time: 0,
    target: new THREE.Quaternion(),
    face: 1
  })

  const [result, setResult] = useState('-')
  const [isRolling, setIsRolling] = useState(false)

  const rollDice = swipe => {
    if (!diceRef.current || rollingRef.current) {
      return
    }

    const die = diceRef.current
    die.position.set((Math.random() - 0.5) * 1.2, 1.9 + Math.random() * 0.7, (Math.random() - 0.5) * 1.2)
    die.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI)

    const swipeDx = swipe?.dx || 0
    const swipeDy = swipe?.dy || 0
    const swipeBoostX = THREE.MathUtils.clamp(swipeDx / 95, -3.5, 3.5)
    const swipeBoostZ = THREE.MathUtils.clamp(swipeDy / 95, -3.5, 3.5)

    velocityRef.current.set(
      (Math.random() - 0.5) * 3.6 + swipeBoostX,
      4.8 + Math.random() * 2.4 + Math.min(2, Math.abs(swipeBoostZ) * 0.45),
      (Math.random() - 0.5) * 3.6 + swipeBoostZ
    )
    angularVelocityRef.current.set(
      (Math.random() - 0.5) * 16 + swipeBoostZ * 1.2,
      (Math.random() - 0.5) * 16 + swipeBoostX * 1.2,
      (Math.random() - 0.5) * 16
    )
    settleRef.current.active = false
    settleRef.current.time = 0

    setResult('-')
    rollingRef.current = true
    setIsRolling(true)
  }

  useEffect(() => {
    if (!mountRef.current) {
      return
    }

    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#0f172a')

    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100)
    camera.position.set(0, 3.2, 5.5)
    camera.lookAt(0, 0.8, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    mountRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.55)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(4, 8, 4)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.set(1024, 1024)
    directionalLight.shadow.camera.near = 0.5
    directionalLight.shadow.camera.far = 24
    scene.add(directionalLight)

    const floorGeometry = new THREE.PlaneGeometry(14, 14)
    const floorMaterial = new THREE.MeshStandardMaterial({ color: '#153c74', roughness: 0.9, metalness: 0.1 })
    const floor = new THREE.Mesh(floorGeometry, floorMaterial)
    floor.rotation.x = -Math.PI / 2
    floor.receiveShadow = true
    scene.add(floor)

    const { dice, diceGeometry, diceMaterial, pipGeometry, pipMaterial } = buildDiceMesh()
    dice.position.set(0, FLOOR_Y + 0.01, 0)
    scene.add(dice)
    diceRef.current = dice

    const resize = () => {
      if (!mountRef.current || !rendererRef.current) {
        return
      }

      const width = mountRef.current.clientWidth
      const height = mountRef.current.clientHeight
      rendererRef.current.setSize(width, height)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }

    resize()
    window.addEventListener('resize', resize)

    const raycaster = new THREE.Raycaster()
    const pointerDownState = {
      onDice: false,
      x: 0,
      y: 0
    }

    const getNdcPoint = event => {
      const rect = renderer.domElement.getBoundingClientRect()
      return {
        x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
        y: -((event.clientY - rect.top) / rect.height) * 2 + 1
      }
    }

    const isPointerOnDice = event => {
      if (!diceRef.current) {
        return false
      }
      const point = getNdcPoint(event)
      raycaster.setFromCamera(point, camera)
      const intersections = raycaster.intersectObject(diceRef.current, true)
      return intersections.length > 0
    }

    const onPointerDown = event => {
      pointerDownState.x = event.clientX
      pointerDownState.y = event.clientY
      pointerDownState.onDice = isPointerOnDice(event)
    }

    const onPointerUp = event => {
      if (!pointerDownState.onDice || rollingRef.current) {
        return
      }

      const dx = event.clientX - pointerDownState.x
      const dy = event.clientY - pointerDownState.y
      const distance = Math.hypot(dx, dy)

      if (distance < 10) {
        rollDice()
        return
      }

      if (distance > 18) {
        rollDice({ dx, dy })
      }
    }

    renderer.domElement.style.touchAction = 'none'
    renderer.domElement.addEventListener('pointerdown', onPointerDown)
    renderer.domElement.addEventListener('pointerup', onPointerUp)

    const gravity = -20
    const bounce = 0.32
    const floorFriction = 0.915
    const linearDamping = 0.992
    const angularDamping = 0.986
    const clock = new THREE.Clock()

    const animate = () => {
      const delta = Math.min(clock.getDelta(), 0.033)
      const die = diceRef.current

      if (die) {
        const velocity = velocityRef.current
        const angularVelocity = angularVelocityRef.current

        if (rollingRef.current) {
          velocity.y += gravity * delta
          die.position.addScaledVector(velocity, delta)

          const stepQuat = new THREE.Quaternion().setFromEuler(
            new THREE.Euler(
              angularVelocity.x * delta,
              angularVelocity.y * delta,
              angularVelocity.z * delta,
              'XYZ'
            )
          )
          die.quaternion.multiply(stepQuat)
          die.quaternion.normalize()

          if (die.position.y < FLOOR_Y) {
            die.position.y = FLOOR_Y
            if (Math.abs(velocity.y) > 0.3) {
              velocity.y = -velocity.y * bounce
              velocity.x *= floorFriction
              velocity.z *= floorFriction
              angularVelocity.multiplyScalar(0.93)
              settleRef.current.active = false
            } else {
              velocity.y = 0
              velocity.x *= floorFriction
              velocity.z *= floorFriction
              angularVelocity.multiplyScalar(0.9)
            }
          }

          velocity.multiplyScalar(linearDamping)
          angularVelocity.multiplyScalar(angularDamping)

          const speed = velocity.length()
          const spin = angularVelocity.length()

          const isGrounded = die.position.y <= FLOOR_Y + 0.001
          const needsSettlePhase = isGrounded && speed < 0.2 && spin < 1.2

          if (needsSettlePhase) {
            if (!settleRef.current.active) {
              settleRef.current.active = true
              settleRef.current.time = 0
              settleRef.current.face = getTopFaceValue(die.quaternion)
              settleRef.current.target.copy(getStableQuaternionForFace(settleRef.current.face))
            }

            settleRef.current.time += delta
            die.quaternion.rotateTowards(settleRef.current.target, delta * 1.6)
            angularVelocity.multiplyScalar(0.78)
            velocity.x *= 0.86
            velocity.z *= 0.86

            if (settleRef.current.time > 0.65 && speed < 0.04 && spin < 0.08) {
              die.quaternion.copy(settleRef.current.target)
              rollingRef.current = false
              settleRef.current.active = false
              setIsRolling(false)
              setResult(String(settleRef.current.face))
            }
          } else if (settleRef.current.active) {
            settleRef.current.active = false
          }
        }
      }

      renderer.render(scene, camera)
      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      renderer.domElement.removeEventListener('pointerdown', onPointerDown)
      renderer.domElement.removeEventListener('pointerup', onPointerUp)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      if (rendererRef.current && mountRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement)
      }

      diceGeometry.dispose()
      diceMaterial.dispose()
      pipGeometry.dispose()
      pipMaterial.dispose()
      floorGeometry.dispose()
      floorMaterial.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <Section delay={0.1}>
      <VStack spacing={5} align="stretch" mt={4}>
        <Heading as="h2" variant="page-title">
          Game - 3D Dice Roll
        </Heading>

        <NextLink href="/game" passHref>
          <Button as="a" colorScheme="teal" variant="outline" alignSelf="flex-start">
            Back to Games
          </Button>
        </NextLink>

        <Text>
          Roll by pressing the button, tapping the dice, or swiping on it. The rounded dice now always finishes flat on a face instead of resting on an edge or corner.
        </Text>

        <Box display="flex" gap={3} alignItems="center" flexWrap="wrap">
          <Button colorScheme="teal" onClick={rollDice} isDisabled={isRolling}>
            {isRolling ? 'Rolling...' : 'Roll Dice'}
          </Button>
          <Text fontSize={{ base: 'lg', md: 'xl' }} fontWeight="bold">
            Result: {result}
          </Text>
        </Box>

        <Box
          ref={mountRef}
          w="100%"
          h={{ base: '58vh', md: '460px' }}
          borderRadius="xl"
          overflow="hidden"
          borderWidth="2px"
          borderColor="teal.300"
          boxShadow="lg"
        />
      </VStack>
    </Section>
  )
}

export default DiceGame