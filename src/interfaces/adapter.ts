/**
 * Generic Adapter Interface - Base contract for all adapters
 * Ensures consistent implementation across different signal and event sources
 */
export interface IAdapter<T> {
  /**
   * Convert raw data from source to standardized format
   * @param rawData - Data from the source system
   * @returns Standardized data object
   */
  convert(rawData: unknown): T;

  /**
   * Validate that raw data meets minimum requirements
   * @param rawData - Data to validate
   * @returns true if valid, false otherwise
   */
  validate(rawData: unknown): boolean;

  /**
   * Get adapter identifier
   * @returns Unique adapter name/id
   */
  getAdapterId(): string;
}
