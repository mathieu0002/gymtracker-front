import axios from 'axios'
import type {
  SessionDto,
  ExerciseDto,
  ProgressionDto,
  PersonalRecordDto,
  VolumePoint,
  LastSessionSummaryDto,
  SplitType,
  MuscleGroupDto,
} from '../types'

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
})

// ---- Muscle Groups ----
export const getMuscleGroups = () =>
  api.get<MuscleGroupDto[]>('/musclegroups').then(r => r.data)

export const createMuscleGroup = (data: { name: string; split: SplitType }) =>
  api.post<MuscleGroupDto>('/musclegroups', data).then(r => r.data)

export const deleteMuscleGroup = (id: string) =>
  api.delete(`/musclegroups/${id}`)

// ---- Exercises ----
export const getExercises = () =>
  api.get<ExerciseDto[]>('/exercises').then(r => r.data)

export const getExercisesBySplit = (split: SplitType) =>
  api.get<ExerciseDto[]>(`/exercises/by-split/${split}`).then(r => r.data)

export const createCustomExercise = (data: {
  name: string
  muscleGroupId: string
  description?: string
}) => api.post<ExerciseDto>('/exercises', data).then(r => r.data)

export const deleteExercise = (id: string) =>
  api.delete(`/exercises/${id}`)

// ---- Sessions ----
export const getSessions = () =>
  api.get<SessionDto[]>('/sessions').then(r => r.data)

export const getSessionById = (id: string) =>
  api.get<SessionDto>(`/sessions/${id}`).then(r => r.data)

export const createSession = (data: {
  splits: SplitType[]
  sessionDate: string
  notes?: string
}) => api.post<SessionDto>('/sessions', data).then(r => r.data)

export const addExerciseToSession = (
  sessionId: string,
  data: { exerciseId: string; orderIndex: number }
) => api.post(`/sessions/${sessionId}/exercises`, data).then(r => r.data)

export const deleteSession = (id: string) =>
  api.delete(`/sessions/${id}`)

// ---- Sets ----
export const addSet = (
  sessionExerciseId: string,
  data: { setNumber: number; weightKg: number; reps: number }
) => api.post(`/session-exercises/${sessionExerciseId}/sets`, data).then(r => r.data)

export const deleteSet = (sessionExerciseId: string, setId: string) =>
  api.delete(`/session-exercises/${sessionExerciseId}/sets/${setId}`)

// ---- Stats ----
export const getProgression = (exerciseId: string) =>
  api.get<ProgressionDto>(`/stats/progression/${exerciseId}`).then(r => r.data)

export const getPersonalRecords = () =>
  api.get<PersonalRecordDto[]>('/stats/prs').then(r => r.data)

export const getVolumeHistory = (lastN = 10) =>
  api.get<VolumePoint[]>(`/stats/volume?lastN=${lastN}`).then(r => r.data)

export const getLastSessionBySplit = (split: SplitType) =>
  api.get<LastSessionSummaryDto>(`/sessions/last/${split}`).then(r => r.data)