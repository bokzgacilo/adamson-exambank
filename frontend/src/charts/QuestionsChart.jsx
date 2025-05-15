import { Heading, Stack, Text} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";


export default function QuestionCharts() {
  const [Data, SetData] = useState({ questions_by_classification : {} ,questions_by_category: {}, questions_by_subject: {}}); // Initialize as an object
  const ByCategoryRef = useRef(null);
  const ByCategoryInstance = useRef(null);
  const ByClassificationRef = useRef(null);
  const ByClassificationInstance = useRef(null);
  const BySubjectRef = useRef(null);
  const BySubjectInstance = useRef(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_HOST}StatisticsRoute.php?action=all_questions`)
      .then((response) => {
        SetData(response.data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    if (!Data.questions_by_category || Object.keys(Data.questions_by_category).length === 0) return;
    if (!Data.questions_by_subject || Object.keys(Data.questions_by_subject).length === 0) return;
    if (!Data.questions_by_classification || Object.keys(Data.questions_by_classification).length === 0) return;

    const ctx = ByCategoryRef.current.getContext("2d");
    const ctx2 = BySubjectRef.current.getContext("2d");
    const ctx3 = ByClassificationRef.current.getContext("2d");

    if (ByCategoryInstance.current) {
      ByCategoryInstance.current.destroy();
    }

    if (BySubjectInstance.current) {
      BySubjectInstance.current.destroy();
    }

    if (ByClassificationInstance.current) {
      ByClassificationInstance.current.destroy();
    }

    ByCategoryInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: Object.keys(Data.questions_by_category),
        datasets: [
          {
            label: "By Category",
            data: Object.values(Data.questions_by_category),
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

    ByClassificationInstance.current = new Chart(ctx3, {
      type: "bar",
      data: {
        labels: Object.keys(Data.questions_by_classification),
        datasets: [
          {
            label: "By Classification",
            data: Object.values(Data.questions_by_classification),
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
        labels: Object.keys(Data.questions_by_subject),
        datasets: [
          {
            label: "By Subject",
            data: Object.values(Data.questions_by_subject),
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

      if (ByClassificationInstance.current) {
        ByClassificationInstance.current.destroy();
      }
    };
  }, [Data]);

  return (
  <Stack>
    <Heading textAlign="center">{Data.total_questions}</Heading>
    <Text fontWeight="semibold" textAlign="center">TOTAL NUMBER</Text>
    <Text fontWeight="semibold" mt={4}>BY SUBJECT</Text>
    <canvas ref={BySubjectRef} />;
    <Text fontWeight="semibold"  mt={4}>BY CLASSIFICATION</Text>
    <canvas ref={ByClassificationRef} />;
    <Text fontWeight="semibold"  mt={4}>BY CATEGORY</Text>
    <canvas ref={ByCategoryRef} />;
    
  </Stack>
  );
}
