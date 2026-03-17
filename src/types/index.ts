export type SplitType = 
  | 'pec' 
  | 'triceps' 
  | 'dos' 
  | 'bras' 
  | 'epaules' 
  | 'jambes' 
  | 'cardio' 
  | 'abdos'

export interface SetDto {
  id: string
  setNumber: number
  weightKg: number
  reps: number
}

export interface SessionExerciseDto {
  id: string
  exerciseId: string
  exerciseName: string
  muscleGroupName: string
  orderIndex: number
  sets: SetDto[]
}

export interface SessionDto {
  id: string
  splits: SplitType[]
  sessionDate: string
  notes?: string
  exercises: SessionExerciseDto[]
}

export interface ExerciseDto {
  id: string
  name: string
  muscleGroupId: string
  muscleGroupName: string
  isCustom: boolean
  description?: string
}

export interface MuscleGroup {
  id: string
  name: string
  split: SplitType
}

export interface ProgressionPoint {
  sessionDate: string
  maxWeightKg: number
  totalReps: number
}

export interface ProgressionDto {
  exerciseId: string
  exerciseName: string
  points: ProgressionPoint[]
}

export interface PersonalRecordDto {
  exerciseId: string
  exerciseName: string
  prWeightKg: number
  repsAtPr: number
  achievedOn: string
}

export interface VolumePoint {
  sessionDate: string
  muscleGroup: string
  totalVolumeKg: number
}

export interface LastSessionSummaryDto {
  sessionId: string
  sessionDate: string
  splits: SplitType[]
  exercises: SessionExerciseDto[]
}

export const SPLIT_LABELS: Record<SplitType, string> = {
  pec: 'Pec',
  triceps: 'Triceps',
  dos: 'Dos',
  bras: 'Bras',
  epaules: 'Épaules',
  jambes: 'Jambes',
  cardio: 'Cardio',
  abdos: 'Abdos'
}

export interface MuscleGroupDto {
  id: string
  name: string
  split: string
  createdAt: string
}