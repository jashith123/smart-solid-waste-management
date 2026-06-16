import {
  View,
  Text,
  Image,
  ScrollView,
} from "react-native";

import { BASE_URL } from "../config/api";

export default function ReportDetailsScreen({
  route,
}: any) {

  const { report } = route.params;


  return (
    <ScrollView
      contentContainerStyle={{
        padding: 20,
      }}
    >
      <Text
        style={{
          fontSize: 24,
          marginBottom: 15,
        }}
      >
        Report #{report.id}
      </Text>

      <Text>
        Status: {report.status}
      </Text>

      <Text>
        Garbage Count: {report.garbage_count}
      </Text>

      <Text>
        Confidence:
        {" "}
        {(
          report.highest_confidence *
          100
        ).toFixed(1)}
        %
      </Text>

      <Text>
        Latitude:
        {" "}
        {report.latitude}
      </Text>

      <Text>
        Longitude:
        {" "}
        {report.longitude}
      </Text>

      <Text
        style={{
          marginTop: 20,
          marginBottom: 10,
          fontSize: 18,
        }}
      >
        Original Image
      </Text>

      <Image
        source={{
          uri:
            BASE_URL + report.original_image_url,
        }}
        style={{
          width: "100%",
          height: 250,
          borderRadius: 10,
        }}
      />

      <Text
        style={{
          marginTop: 20,
          marginBottom: 10,
          fontSize: 18,
        }}
      >
        Annotated Image
      </Text>

      <Image
        source={{
          uri:
            BASE_URL + report.annotated_image_url,
        }}
        style={{
          width: "100%",
          height: 250,
          borderRadius: 10,
        }}
      />
    </ScrollView>
  );
}