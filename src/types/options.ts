export interface Options {
  theme: 'dark' | 'light'
  language: 'fr' | 'en'
  textSize: 'small' | 'normal' | 'large'
  animations: boolean
  volume: number
  soundEffects: boolean
  music: boolean
}

export type CameraStatus = 'active' | 'reduced' | 'off'
export type AntennaStatus = 'active' | 'reduced' | 'off'
export type PowerMode = 'normal' | 'eco'
