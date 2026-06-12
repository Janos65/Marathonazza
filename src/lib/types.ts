export interface Pair {
  id: string
  name: string
  player1_name: string
  player2_name: string
  handicap: number
  starting_hole: number
  access_code: string
  photo_url: string | null
  display_order: number | null
}

export interface Hole {
  hole_number: number
  par: number | null
  map_image_url: string | null
}

export interface HoleScore {
  id: string
  pair_id: string
  round_number: number
  hole_number: number
  strokes: number | null
}

export interface Round {
  id: string
  pair_id: string
  round_number: number
  is_submitted: boolean
  raw_strokes: number | null
  net_strokes: number | null
  submitted_at: string | null
}

export interface NearestToPin {
  id: string
  player_name: string
  pair_id: string
  round_number: number
  distance_cm: number
}

export type CompetitionType = 'closest_to_line' | 'drive_in_contest'

export interface SpecialWinner {
  id: string
  competition_type: CompetitionType
  winning_pair_id: string | null
}

/** Per-hole strokes map keyed by hole number (1..9). */
export type ScoreMap = Record<number, number | null>

/** A leaderboard row computed from pairs + rounds. */
export interface LeaderboardRow {
  pair: Pair
  rounds: Record<number, number | null> // round_number -> net or null
  totalNet: number
  submittedCount: number
  hasInProgress: boolean
}
