import api from "./api";

import { Report } from "../types/report";

export async function getReports(): Promise<Report[]> {
  const response = await api.get("/reports");
  return response.data;
}

export async function updateReportStatus(
  reportId: number,
  status: string,
): Promise<Report> {
  const response = await api.patch(`/reports/${reportId}/status`, { status });
  return response.data;
}
