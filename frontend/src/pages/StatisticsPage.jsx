import {
  Card,
  CardHeader,
  CardBody,
  SimpleGrid,
} from "@chakra-ui/react";
import QuestionCharts from "../charts/QuestionsChart";
import UsersChart from "../charts/QuestionsChart copy";

export default function StatisticsPage() {

  return (
    <SimpleGrid p={4} columns={3} spacing={4}>
      <Card>
        <CardHeader>
          Questions
        </CardHeader>
        <CardBody>
          <QuestionCharts />
        </CardBody>
      </Card>
      <Card>
      <CardHeader>
          Exam
        </CardHeader>
        <CardBody></CardBody>
      </Card>
      <Card>
      <CardHeader>
          Users
        </CardHeader>
        <CardBody>
          <UsersChart />
        </CardBody>
      </Card>
    </SimpleGrid>
  );
}
