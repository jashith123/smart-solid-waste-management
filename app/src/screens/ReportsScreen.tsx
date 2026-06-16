import { useEffect, useState } from "react";

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Image,
} from "react-native";

import { Report } from "../types/report";

import { getReports } from "../services/reportService";

import { BASE_URL } from "../config/api";

export default function ReportsScreen({ navigation }: any) {
  const [reports, setReports] = useState<Report[]>([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const data = await getReports();

      setReports(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);

    await loadReports();
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (reports.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>No reports found</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={reports}
      keyExtractor={(item) => item.id.toString()}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      renderItem={({ item }) => {
        const statusColor =
          item.status === "RESOLVED"
            ? "green"
            : item.status === "IN_PROGRESS"
              ? "blue"
              : "orange";

        return (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("ReportDetails", {
                report: item,
              })
            }
            style={{
              margin: 10,
              padding: 15,
              backgroundColor: "#fff",
              borderRadius: 10,
              elevation: 3,
            }}
          >
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <Image
                source={{
                  uri: BASE_URL + item.original_image_url,
                }}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 8,
                  marginRight: 15,
                }}
              />

              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                  }}
                >
                  Report #{item.id}
                </Text>

                <Text
                  style={{
                    color: statusColor,
                    marginTop: 5,
                    fontWeight: "600",
                  }}
                >
                  ● {item.status}
                </Text>

                <Text
                  style={{
                    marginTop: 5,
                  }}
                >
                  🗑 Garbage Count: {item.garbage_count}
                </Text>

                <Text
                  style={{
                    marginTop: 5,
                  }}
                >
                  📅 {new Date(item.created_at).toLocaleDateString()}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      }}
    />
  );
}
