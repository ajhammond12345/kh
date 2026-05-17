<script setup lang="ts">
import type { Palette } from '~/composables/useArtworks'

const props = withDefaults(defineProps<{
  palette: Palette
  layout?: string
  seed?: number
  ratio?: string
}>(), {
  layout: 'open-valley',
  seed: 1,
  ratio: '4 / 5',
})

const uid = useId().replace(/[^a-zA-Z0-9]/g, '')

function seeded(s: number) {
  let v = s * 9301 + 49297
  return () => { v = (v * 9301 + 49297) % 233280; return v / 233280 }
}

const r = seeded(props.seed)
const horizon = 220 + Math.floor(r() * 80)
const sunCx = 80 + Math.floor(r() * 240)
const sunCy = 80 + Math.floor(r() * 100)
const cloudCx = 80 + Math.floor(r() * 240)

const sky1 = computed(() => props.palette.sky[0])
const sky2 = computed(() => props.palette.sky[1])
const land1 = computed(() => props.palette.land[0])
const land2 = computed(() => props.palette.land[1])
const land3 = computed(() => props.palette.land[2])
const accent = computed(() => props.palette.wash)

const wetId = computed(() => `wet${uid}`)
const grainId = computed(() => `grain${uid}`)
const sunGradId = computed(() => `sun${uid}`)
const cloudGradId = computed(() => `cloud${uid}`)
const accentGradId = computed(() => `accent${uid}`)
const vigId = computed(() => `vig${uid}`)

// Crowd figures pre-computed
const figures = Array.from({ length: 28 }).map((_, i) => {
  const x = 20 + (i % 7) * 56 + Math.floor(r() * 18)
  const y = horizon + 30 + Math.floor(i / 7) * 80 + Math.floor(r() * 18)
  const c = i % 4
  return { x, y, c }
})
</script>

<template>
  <svg
    viewBox="0 0 400 500"
    preserveAspectRatio="xMidYMid slice"
    :style="{ display: 'block', width: '100%', height: '100%', aspectRatio: ratio, background: '#EDE4D2' }"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <defs>
      <filter :id="wetId" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" :seed="seed" result="t" />
        <feDisplacementMap in="SourceGraphic" in2="t" scale="6" />
      </filter>
      <filter :id="grainId">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix values="0 0 0 0 0.085  0 0 0 0 0.10  0 0 0 0 0.13  0 0 0 0.06 0" />
      </filter>
      <radialGradient :id="sunGradId" :cx="`${(sunCx / 400) * 100}%`" :cy="`${(sunCy / 500) * 100}%`" r="55%">
        <stop offset="0%" :stop-color="sky1" stop-opacity="0.7" />
        <stop offset="55%" :stop-color="sky1" stop-opacity="0.2" />
        <stop offset="100%" :stop-color="sky1" stop-opacity="0" />
      </radialGradient>
      <radialGradient :id="cloudGradId" :cx="`${(cloudCx / 400) * 100}%`" cy="20%" r="60%">
        <stop offset="0%" :stop-color="sky2" stop-opacity="0.5" />
        <stop offset="55%" :stop-color="sky2" stop-opacity="0.1" />
        <stop offset="100%" :stop-color="sky2" stop-opacity="0" />
      </radialGradient>
      <radialGradient :id="accentGradId" cx="70%" cy="85%" r="50%">
        <stop offset="0%" :stop-color="accent" stop-opacity="0.18" />
        <stop offset="55%" :stop-color="accent" stop-opacity="0.05" />
        <stop offset="100%" :stop-color="accent" stop-opacity="0" />
      </radialGradient>
      <radialGradient :id="vigId" cx="50%" cy="50%" r="80%">
        <stop offset="60%" stop-color="#000" stop-opacity="0" />
        <stop offset="100%" stop-color="#1a1410" stop-opacity="0.16" />
      </radialGradient>
    </defs>

    <rect width="400" height="500" fill="#F1E7D2" />
    <rect width="400" height="500" :fill="`url(#${sunGradId})`" />
    <rect width="400" height="500" :fill="`url(#${cloudGradId})`" />

    <!-- Open valley -->
    <g v-if="layout === 'open-valley'">
      <path :d="`M 0 ${horizon - 10} Q 80 ${horizon - 30} 160 ${horizon - 15} T 320 ${horizon - 25} T 400 ${horizon - 10} L 400 ${horizon + 10} L 0 ${horizon + 10} Z`" :fill="land1" opacity="0.55" :filter="`url(#${wetId})`" />
      <path :d="`M 0 ${horizon + 30} Q 100 ${horizon + 10} 200 ${horizon + 40} T 400 ${horizon + 30} L 400 ${horizon + 90} L 0 ${horizon + 90} Z`" :fill="land2" opacity="0.85" :filter="`url(#${wetId})`" />
      <path :d="`M 0 ${horizon + 90} L 400 ${horizon + 90} L 400 500 L 0 500 Z`" :fill="land3" opacity="0.9" />
      <path :d="`M 200 ${horizon + 90} Q 230 ${horizon + 200} 120 500`" :stroke="sky1" stroke-width="4" stroke-opacity="0.45" fill="none" />
    </g>

    <!-- River bend -->
    <g v-else-if="layout === 'river-bend'">
      <path :d="`M 0 ${horizon - 20} Q 120 ${horizon - 50} 220 ${horizon - 15} T 400 ${horizon - 25} L 400 ${horizon + 20} L 0 ${horizon + 20} Z`" :fill="land1" opacity="0.55" :filter="`url(#${wetId})`" />
      <path :d="`M 0 ${horizon + 30} Q 90 ${horizon + 10} 180 ${horizon + 50} T 400 ${horizon + 30} L 400 500 L 0 500 Z`" :fill="land2" opacity="0.7" :filter="`url(#${wetId})`" />
      <path :d="`M -10 ${horizon + 90} Q 120 ${horizon + 130} 200 ${horizon + 170} Q 280 ${horizon + 210} 410 ${horizon + 260}`" :stroke="sky2" stroke-width="42" stroke-opacity="0.55" fill="none" :filter="`url(#${wetId})`" />
      <path :d="`M -10 ${horizon + 92} Q 120 ${horizon + 132} 200 ${horizon + 172} Q 280 ${horizon + 212} 410 ${horizon + 262}`" :stroke="sky1" stroke-width="20" stroke-opacity="0.7" fill="none" />
    </g>

    <!-- Sea -->
    <g v-else-if="layout === 'sea'">
      <rect x="0" :y="horizon" width="400" :height="500 - horizon" :fill="sky2" opacity="0.55" />
      <rect v-for="i in 6" :key="`s${i}`" x="0" :y="horizon + 20 + (i - 1) * 30" width="400" height="14" :fill="(i - 1) % 2 === 0 ? sky1 : land1" :opacity="0.18 + (i - 1) * 0.05" :filter="`url(#${wetId})`" />
      <path :d="`M 0 480 Q 80 440 160 470 Q 240 500 320 460 Q 380 440 400 470 L 400 500 L 0 500 Z`" :fill="land3" opacity="0.92" />
    </g>

    <!-- Venice canal -->
    <g v-else-if="layout === 'venice-canal'">
      <rect x="0" :y="horizon + 10" width="400" :height="500 - horizon" :fill="sky2" opacity="0.55" />
      <g :filter="`url(#${wetId})`" opacity="0.85">
        <rect x="0" :y="horizon - 80" width="60" height="90" :fill="land1" />
        <rect x="60" :y="horizon - 100" width="80" height="110" :fill="land2" />
        <rect x="140" :y="horizon - 130" width="50" height="140" :fill="land1" />
        <rect x="190" :y="horizon - 110" width="70" height="120" :fill="land2" />
        <rect x="260" :y="horizon - 90" width="60" height="100" :fill="land1" />
        <rect x="320" :y="horizon - 120" width="80" height="130" :fill="land2" />
        <rect x="180" :y="horizon - 200" width="22" height="200" :fill="accent" opacity="0.8" />
        <polygon :points="`180,${horizon - 200} 202,${horizon - 200} 191,${horizon - 230}`" :fill="accent" />
      </g>
      <ellipse cx="120" :cy="horizon + 70" rx="40" ry="6" :fill="land3" opacity="0.85" />
      <ellipse cx="280" :cy="horizon + 120" rx="50" ry="7" :fill="land3" opacity="0.7" />
      <rect x="0" :y="horizon + 10" width="400" height="6" :fill="land1" opacity="0.35" />
    </g>

    <!-- Sunset bay -->
    <g v-else-if="layout === 'sunset-bay'">
      <circle cx="280" :cy="horizon - 30" r="60" :fill="accent" opacity="0.5" :filter="`url(#${wetId})`" />
      <circle cx="280" :cy="horizon - 30" r="32" :fill="accent" opacity="0.7" />
      <path :d="`M 0 ${horizon} Q 100 ${horizon - 25} 200 ${horizon - 5} T 400 ${horizon - 20} L 400 ${horizon + 30} L 0 ${horizon + 30} Z`" :fill="land2" opacity="0.6" :filter="`url(#${wetId})`" />
      <rect x="0" :y="horizon + 30" width="400" :height="500 - horizon - 30" :fill="land3" opacity="0.6" />
      <rect x="260" :y="horizon + 30" width="40" :height="500 - horizon - 30" :fill="accent" opacity="0.18" />
      <path :d="`M 0 ${horizon + 40} Q 80 ${horizon + 25} 160 ${horizon + 40} L 160 500 L 0 500 Z`" :fill="land3" opacity="0.95" />
    </g>

    <!-- Crowd -->
    <g v-else-if="layout === 'crowd'">
      <rect x="0" :y="horizon - 20" width="400" :height="500 - horizon + 20" :fill="land1" opacity="0.4" />
      <g v-for="(f, i) in figures" :key="`f${i}`" opacity="0.78">
        <ellipse :cx="f.x" :cy="f.y" rx="9" ry="14" :fill="[land2, land3, accent, sky2][f.c]" :filter="`url(#${wetId})`" />
        <circle :cx="f.x" :cy="f.y - 14" r="5" :fill="[land2, land3, accent, sky2][f.c]" />
      </g>
    </g>

    <!-- Factory -->
    <g v-else-if="layout === 'factory'">
      <rect x="0" :y="horizon" width="400" :height="500 - horizon" :fill="land2" opacity="0.85" />
      <g :stroke="land3" stroke-width="4" stroke-opacity="0.8" fill="none">
        <line x1="40" :y1="horizon" x2="200" y2="80" />
        <line x1="360" :y1="horizon" x2="200" y2="80" />
        <line x1="120" :y1="horizon - 40" x2="200" y2="100" />
        <line x1="280" :y1="horizon - 40" x2="200" y2="100" />
      </g>
      <rect x="60" :y="horizon - 30" width="60" :height="180" :fill="land3" opacity="0.95" />
      <rect x="140" :y="horizon - 60" width="50" :height="230" :fill="land3" opacity="0.85" />
      <rect x="280" :y="horizon - 50" width="80" :height="220" :fill="land3" opacity="0.95" />
      <circle cx="200" :cy="horizon + 40" r="60" :fill="accent" opacity="0.45" :filter="`url(#${wetId})`" />
      <circle cx="200" :cy="horizon + 40" r="22" :fill="accent" opacity="0.85" />
      <ellipse cx="170" :cy="horizon + 90" rx="6" ry="14" fill="#0c0d10" opacity="0.7" />
      <ellipse cx="240" :cy="horizon + 95" rx="6" ry="14" fill="#0c0d10" opacity="0.7" />
    </g>

    <!-- Quarry -->
    <g v-else-if="layout === 'quarry'">
      <rect x="0" :y="horizon - 100" width="400" :height="500 - horizon + 100" :fill="sky1" opacity="0.6" />
      <rect v-for="i in 4" :key="`q${i}`" x="0" :y="horizon - 60 + (i - 1) * 70" width="400" height="40" :fill="[land1, land2, land1, land3][i - 1]" opacity="0.85" :filter="`url(#${wetId})`" />
      <rect x="60" :y="horizon + 150" width="60" height="40" :fill="sky1" opacity="0.95" />
      <rect x="160" :y="horizon + 170" width="80" height="50" :fill="sky1" opacity="0.85" />
      <rect x="270" :y="horizon + 180" width="70" height="30" :fill="sky1" opacity="0.92" />
    </g>

    <!-- Portrait -->
    <g v-else-if="layout === 'portrait'">
      <rect x="0" y="0" width="400" height="500" :fill="land2" opacity="0.6" />
      <rect x="0" y="0" width="400" height="260" :fill="sky2" opacity="0.55" />
      <ellipse cx="200" cy="180" rx="78" ry="98" :fill="accent" opacity="0.85" :filter="`url(#${wetId})`" />
      <path d="M 122 160 Q 130 80 200 70 Q 270 80 280 165 Q 250 130 200 130 Q 150 130 122 160 Z" :fill="land3" opacity="0.9" :filter="`url(#${wetId})`" />
      <path d="M 80 360 Q 130 280 200 280 Q 270 280 320 360 L 320 500 L 80 500 Z" :fill="land3" opacity="0.95" :filter="`url(#${wetId})`" />
      <ellipse cx="178" cy="160" rx="22" ry="30" :fill="sky1" opacity="0.35" />
    </g>

    <!-- Cottage -->
    <g v-else-if="layout === 'cottage'">
      <rect x="0" :y="horizon" width="400" :height="500 - horizon" :fill="land2" opacity="0.7" />
      <rect x="120" :y="horizon - 80" width="160" height="120" :fill="sky1" opacity="0.95" :filter="`url(#${wetId})`" />
      <polygon :points="`110,${horizon - 80} 290,${horizon - 80} 200,${horizon - 150}`" :fill="accent" opacity="0.9" />
      <rect x="180" :y="horizon - 30" width="30" height="70" :fill="land3" opacity="0.92" />
      <rect x="140" :y="horizon - 60" width="22" height="22" :fill="land3" opacity="0.85" />
      <rect x="240" :y="horizon - 60" width="22" height="22" :fill="land3" opacity="0.85" />
      <ellipse cx="60" :cy="horizon - 30" rx="50" ry="70" :fill="land1" opacity="0.85" :filter="`url(#${wetId})`" />
      <rect x="56" :y="horizon + 20" width="8" height="40" :fill="land3" />
      <rect x="0" :y="horizon + 60" width="400" :height="500 - horizon - 60" :fill="land3" opacity="0.85" />
    </g>

    <!-- Mountain -->
    <g v-else-if="layout === 'mountain'">
      <polygon :points="`0,${horizon + 60} 100,${horizon - 80} 180,${horizon + 10} 260,${horizon - 120} 360,${horizon - 30} 400,${horizon + 50} 400,${horizon + 80} 0,${horizon + 80}`" :fill="land2" opacity="0.85" :filter="`url(#${wetId})`" />
      <polygon :points="`0,${horizon + 90} 80,${horizon + 30} 160,${horizon + 80} 240,${horizon + 10} 320,${horizon + 70} 400,${horizon + 30} 400,${horizon + 110} 0,${horizon + 110}`" :fill="land1" opacity="0.7" :filter="`url(#${wetId})`" />
      <rect x="0" :y="horizon + 110" width="400" :height="500 - horizon - 110" :fill="land3" opacity="0.9" />
      <polygon :points="`100,${horizon - 80} 120,${horizon - 50} 80,${horizon - 50}`" :fill="sky1" opacity="0.85" />
      <polygon :points="`260,${horizon - 120} 285,${horizon - 80} 235,${horizon - 80}`" :fill="sky1" opacity="0.85" />
    </g>

    <!-- Default fall-through: open-valley -->
    <g v-else>
      <path :d="`M 0 ${horizon - 10} Q 80 ${horizon - 30} 160 ${horizon - 15} T 320 ${horizon - 25} T 400 ${horizon - 10} L 400 ${horizon + 10} L 0 ${horizon + 10} Z`" :fill="land1" opacity="0.55" :filter="`url(#${wetId})`" />
      <path :d="`M 0 ${horizon + 30} Q 100 ${horizon + 10} 200 ${horizon + 40} T 400 ${horizon + 30} L 400 ${horizon + 90} L 0 ${horizon + 90} Z`" :fill="land2" opacity="0.85" :filter="`url(#${wetId})`" />
      <path :d="`M 0 ${horizon + 90} L 400 ${horizon + 90} L 400 500 L 0 500 Z`" :fill="land3" opacity="0.9" />
    </g>

    <rect width="400" height="500" :fill="`url(#${accentGradId})`" />
    <rect width="400" height="500" :filter="`url(#${grainId})`" opacity="0.5" />
    <rect width="400" height="500" :fill="`url(#${vigId})`" />
  </svg>
</template>
