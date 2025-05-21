import { Stack, Text, Flex, Select, Button, Icon } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { TbPlus, TbX } from "react-icons/tb";
import axios from "axios"

export default function AssignSubjectSelector({data}) {
  const { user_subjects, set_user_subject } = data;
  const [availableSubjects, setAvailableSubjects] = useState([])
  const [selectedSubject, setSelectedSubject] = useState([])

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_HOST}SubjectRoute.php?action=viewAll`)
      .then((response) => {
        const firstSubjectName = response.data[0]?.name || "";
        setAvailableSubjects(response.data.map(subject => subject.name));
        setSelectedSubject(firstSubjectName)
      })
      .catch((error) => console.error("Error fetching subjects:", error));
  }, []);

  const HandleAddSubject = () => {
    if (selectedSubject && !user_subjects.includes(selectedSubject)) {
      set_user_subject((prev) => [...prev, selectedSubject]);
      setAvailableSubjects((prev) => {
        const filtered = prev.filter((subjectName) => subjectName !== selectedSubject);
        setSelectedSubject(filtered[0] || "");
        return filtered;``
      });
    }
  };

  const HandleRemoveSubject = (item) => {
    set_user_subject((prev) => prev.filter((subject) => subject !== item));
    setSelectedSubject(item)
    setAvailableSubjects((prev) => {
      if (!prev.includes(item)) {
        return [...prev, item];
      }
      return prev;
    });
  };

  return (
    <Stack>
      <Text fontWeight="semibold">Assigned Subject</Text>
      <Flex direction="row" gap={4}>
        {availableSubjects.length > 0 && (
          <>
            <Select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              mb={4}
            >
              {availableSubjects.map((subject, index) => (
                <option index={index} value={subject}>
                  {subject}
                </option>
              ))}
            </Select>
            <Button
              colorScheme="green"
              onClick={HandleAddSubject}
            >
              <Icon as={TbPlus} />
            </Button>
          </>
        )}
      </Flex>
      {user_subjects.length === 0 ? (
        <Text>No Selected Subject</Text>
      ) : (
        <Stack mb={4}>
          {user_subjects.map((subject, index) => (
            <Flex index={index} direction="row" alignItems="center" justifyContent="space-between">
              <Text >
                {index + 1}. {subject}
              </Text>
              <Button onClick={() => HandleRemoveSubject(subject)} size="xs"><Icon as={TbX} /></Button>
            </Flex>

          ))}
        </Stack>
      )}
    </Stack>
  )
}