/**
 * @public
 */
export interface GlobalStat {
  /** Overall download speed (byte/sec). */
  downloadSpeed: string
  /** Overall upload speed(byte/sec). */
  uploadSpeed: string
  /** The number of active downloads. */
  numActive: string
  /** The number of waiting downloads. */
  numWaiting: string
  /** The number of stopped downloads in the current session. This value is capped by the --max-download-result option. */
  numStopped: string
  /** The number of stopped downloads in the current session and not capped by the --max-download-result option. */
  numStoppedTotal?: string
}
