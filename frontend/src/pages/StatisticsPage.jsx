import {
  Card,
  CardHeader,
  CardBody,
  SimpleGrid,
} from "@chakra-ui/react";
import QuestionCharts from "../charts/QuestionsChart";
import UsersChart from "../charts/UsersChart";
import ExamsChart from "../charts/ExamsChart";

export default function StatisticsPage() {

  return (
    <SimpleGrid p={4} columns={3} spacing={4}>
      <Card>
        <CardHeader fontWeight="bold">
          QUESTIONS
        </CardHeader>
        <CardBody>
          <QuestionCharts />
        </CardBody>
      </Card>

      <Card>
      <CardHeader fontWeight="bold">
          EXAMS
        </CardHeader>
        <CardBody>
          <UsersChart />
        </CardBody>
      </Card>
      <Card>
      <CardHeader fontWeight="bold">
          USERS
        </CardHeader>
        <CardBody>
          <ExamsChart />
        </CardBody>
      </Card>
    </SimpleGrid>
  );
}
