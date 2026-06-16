export interface Detection {
  confidence: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface DetectionResponse {
  report_id: number;
  garbage_detected: boolean;
  garbage_count: number;
  highest_confidence: number;
  latitude: number;
  longitude: number;
  detections: Detection[];
}