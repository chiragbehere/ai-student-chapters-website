export const PRESET_FOREST = {
 "name": "forest",
 "description": "Cold moonlit dead forest; the portal is a distant red glow.",
 "background": "#0a0510",
 "fog": {
  "type": "FogExp2",
  "color": "#120610",
  "density": 0.018
 },
 "exposure": 0.9,
 "ambient": {
  "color": "#1a1530",
  "intensity": 0.45
 },
 "hemisphere": {
  "sky": "#2a2048",
  "ground": "#1a0508",
  "intensity": 0.35
 },
 "directional": [
  {
   "name": "moon",
   "color": "#6f86d6",
   "intensity": 0.9,
   "position": [
    -14,
    28,
    18
   ],
   "castShadow": true
  }
 ],
 "points": [
  {
   "name": "portal_glow",
   "color": "#ff2a14",
   "intensity": 40,
   "distance": 40,
   "decay": 2,
   "position": [
    0,
    4.9,
    -8
   ]
  },
  {
   "name": "lamp_glow",
   "color": "#ff5a2a",
   "intensity": 6,
   "distance": 9,
   "decay": 2,
   "position": [
    -6.3,
    3.7,
    -5.5
   ],
   "flicker": true
  }
 ],
 "bloom": {
  "strength": 0.8,
  "radius": 0.6,
  "threshold": 0.65
 }
};
export const PRESET_PORTAL = {
 "name": "portal",
 "description": "Portal active: strong red-orange key light, redder fog, dimmer moon.",
 "background": "#12050a",
 "fog": {
  "type": "FogExp2",
  "color": "#2a0810",
  "density": 0.022
 },
 "exposure": 1.0,
 "ambient": {
  "color": "#301020",
  "intensity": 0.5
 },
 "hemisphere": {
  "sky": "#40182a",
  "ground": "#200608",
  "intensity": 0.4
 },
 "directional": [
  {
   "name": "moon",
   "color": "#6f86d6",
   "intensity": 0.45,
   "position": [
    -14,
    28,
    18
   ],
   "castShadow": true
  }
 ],
 "points": [
  {
   "name": "portal_key",
   "color": "#ff3a1a",
   "intensity": 120,
   "distance": 55,
   "decay": 2,
   "position": [
    0,
    4.9,
    -7
   ],
   "pulse": {
    "frequency": 0.4,
    "min": 0.8,
    "max": 1.2
   }
  },
  {
   "name": "portal_rim_low",
   "color": "#ff6a2a",
   "intensity": 30,
   "distance": 18,
   "decay": 2,
   "position": [
    0,
    0.8,
    -6
   ],
   "flicker": true
  }
 ],
 "bloom": {
  "strength": 1.1,
  "radius": 0.7,
  "threshold": 0.55
 }
};
export const PRESET_RED_ALERT = {
 "name": "red_alert",
 "description": "Alarm state for transitions/glitches: pulsing pure-red light, no moon.",
 "background": "#1a0204",
 "fog": {
  "type": "FogExp2",
  "color": "#3a0508",
  "density": 0.026
 },
 "exposure": 1.05,
 "ambient": {
  "color": "#400808",
  "intensity": 0.6
 },
 "hemisphere": {
  "sky": "#601010",
  "ground": "#200404",
  "intensity": 0.5
 },
 "directional": [],
 "points": [
  {
   "name": "alert_main",
   "color": "#ff1010",
   "intensity": 160,
   "distance": 60,
   "decay": 2,
   "position": [
    0,
    6,
    4
   ],
   "pulse": {
    "frequency": 1.2,
    "min": 0.25,
    "max": 1.6
   }
  },
  {
   "name": "alert_back",
   "color": "#ff2a14",
   "intensity": 90,
   "distance": 50,
   "decay": 2,
   "position": [
    0,
    4.9,
    -8
   ],
   "pulse": {
    "frequency": 1.2,
    "min": 0.4,
    "max": 1.4
   }
  }
 ],
 "bloom": {
  "strength": 1.3,
  "radius": 0.8,
  "threshold": 0.5
 }
};
