export interface Report {
  id: number;
  latitude: number;
  longitude: number;

  original_image_url: string;
  annotated_image_url: string;

  garbage_detected: boolean;
  garbage_count: number;

  highest_confidence: number;

  status: string;

  created_at: string;
}