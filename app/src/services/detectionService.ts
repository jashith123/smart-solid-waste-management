import api from "./api";
import { DetectionResponse } from "../types/detection";

export async function detectGarbage(
  imageUri: string,
  latitude: number,
  longitude: number
): Promise<DetectionResponse> {

  const formData = new FormData();

  formData.append("file", {
    uri: imageUri,
    name: "image.jpg",
    type: "image/jpeg",
  } as any);

  formData.append(
    "latitude",
    latitude.toString()
  );

  formData.append(
    "longitude",
    longitude.toString()
  );

  const response = await api.post(
    "/detect",
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );

  return response.data;
}