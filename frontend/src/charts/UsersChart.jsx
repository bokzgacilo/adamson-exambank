import { Heading, Stack, Text} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";

export default function UsersChart() {
  const [Data, SetData] = useState({ users_by_role: {}, users_by_subject: {}}); // Initialize as an object
  const ByCategoryRef = useRef(null);
  const ByCategoryInstance = useRef(null);

  const BySubjectRef = useRef(null);
  const BySubjectInstance = useRef(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_HOST}StatisticsRoute.php?action=all_users`)
      .then((response) => {
        SetData(response.data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    if (!Data.users_by_role || Object.keys(Data.users_by_role).length === 0) return;

    const ctx = ByCategoryRef.current.getContext("2d");
    const ctx2 = BySubjectRef.current.getContext("2d");

    if (ByCategoryInstance.current) {
      ByCategoryInstance.current.destroy();
    }

    if (BySubjectInstance.current) {
      BySubjectInstance.current.destroy();
    }

    ByCategoryInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: Object.keys(Data.users_by_subject),
        datasets: [
          {
            label: "By Category",
            data: Object.values(Data.users_by_subject),
            backgroundColor: "rgba(32, 92, 222, 0.73)",
            borderColor: "rgba(32, 92, 222, 0.73)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    BySubjectInstance.current = new Chart(ctx2, {
      type: "bar",
      data: {
        labels: Object.keys(Data.users_by_role),
        datasets: [
          {
            label: "By Subject",
            data: Object.values(Data.users_by_role),
            backgroundColor: "rgba(32, 92, 222, 0.73)",
            borderColor: "rgba(32, 92, 222, 0.73)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    return () => {
      if (ByCategoryInstance.current) {
        ByCategoryInstance.current.destroy();
      }
      if (BySubjectInstance.current) {
        BySubjectInstance.current.destroy();
      }
    };
  }, [Data]);

  return (
  <Stack>
    <Heading textAlign="center">{Data.total_users}</Heading>
    <Text  textAlign="center">Total Number</Text>
    <Text fontWeight="semibold"  mt={4}>By Category</Text>
    <canvas ref={ByCategoryRef} />;
    <Text fontWeight="semibold" mt={4}>By Subject</Text>
    <canvas ref={BySubjectRef} />;
  </Stack>
  );
}
