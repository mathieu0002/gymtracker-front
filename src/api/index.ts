import axios from 'axios'
import type {
  SessionDto, ExerciseDto, ProgressionDto, PersonalRecordDto,
  VolumePoint, LastSessionSummaryDto, SplitType, MuscleGroupDto, UserDto,
} from '../types'

const api = axios.create({
   baseURL: 'https://gymtracker-api-1kin.onrender.com',
})

// ---- Users ----
export const getUsers = () =>
  api.get<UserDto[]>('/users').then(r => r.data)

export const createUser = (data: { firstName: string; lastName: string }) =>
  api.post<UserDto>('/users', data).then(r => r.data)

export const deleteUser = (id: string) =>
  api.delete(`/users/${id}`)

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

export const createCustomExercise = (data: { name: string; muscleGroupId: string; description?: string }) =>
  api.post<ExerciseDto>('/exercises', data).then(r => r.data)

export const deleteExercise = (id: string) =>
  api.delete(`/exercises/${id}`)

// ---- Sessions ----
export const getSessions = (userId: string) =>
  api.get<SessionDto[]>(`/sessions?userId=${userId}`).then(r => r.data)

export const getSessionById = (id: string) =>
  api.get<SessionDto>(`/sessions/${id}`).then(r => r.data)

export const createSession = (data: { userId: string; splits: SplitType[]; sessionDate: string; notes?: string }) =>
  api.post<SessionDto>('/sessions', data).then(r => r.data)

export const addExerciseToSession = (sessionId: string, data: { exerciseId: string; orderIndex: number }) =>
  api.post(`/sessions/${sessionId}/exercises`, data).then(r => r.data)

export const deleteSession = (id: string) =>
  api.delete(`/sessions/${id}`)

// ---- Sets ----
export const addSet = (sessionExerciseId: string, data: { setNumber: number; weightKg: number; reps: number }) =>
  api.post(`/session-exercises/${sessionExerciseId}/sets`, data).then(r => r.data)

export const deleteSet = (sessionExerciseId: string, setId: string) =>
  api.delete(`/session-exercises/${sessionExerciseId}/sets/${setId}`)

// ---- Stats ----
export const getProgression = (exerciseId: string, userId: string) =>
  api.get<ProgressionDto>(`/stats/progression/${exerciseId}?userId=${userId}`).then(r => r.data)

export const getPersonalRecords = (userId: string) =>
  api.get<PersonalRecordDto[]>(`/stats/prs?userId=${userId}`).then(r => r.data)

export const getVolumeHistory = (userId: string, lastN = 10) =>
  api.get<VolumePoint[]>(`/stats/volume?userId=${userId}&lastN=${lastN}`).then(r => r.data)

export const getLastSessionBySplit = (split: SplitType, userId: string) =>
  api.get<LastSessionSummaryDto>(`/sessions/last/${split}?userId=${userId}`).then(r => r.data)