import {
  Button,
  Stack,
  Select,
  Text,
  Input,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";

import PropTypes from "prop-types";
import useUserStore from "../helper/useUserStore";
import { TbCheck, TbDownload } from "react-icons/tb";

CreateBatchQuestion.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  spinner: PropTypes.func.isRequired,
};

export default function CreateBatchQuestion({ isOpen, onClose, spinner }) {
  const { user } = useUserStore();
  const parsedSubjects = JSON.parse(user.user_assigned_subject) || [];
  const [File, SetFile] = useState(null);

  const reconstructedArray = parsedSubjects.map((name, index) => ({
    id: index + 1,
    name: name,
  }));

  const toast = useToast();
  const [Subjects, SetSubjects] = useState([]);
  const [SelectedSubject, SetSelectedSubject] = useState("");

  const HandeFileChange = (e) => {
    SetFile(e.target.files[0]);
  };

  const HandleCreate = async () => {
    if (!File) {
      alert("Please select a file first.");
      return;
    }
    spinner(true)

    await axios.post("http://localhost/exam-bank/api/ServicesRoute.php?action=ProcessQuestionBatch", {
      subject: SelectedSubject,
      excel_data: File,
      creator: user.fullname
    }, {
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(response => {
        if (response.data.status === "not-found") {
          toast({ title: response.data.message, description: response.data.description, status: "error", duration: 10000, isClosable: true, position: "center" });
        } else {
          toast({ title: "Batch Uploaded!", description: `${response.data.data.length} questions successfully created`, status: "success", duration: 3000, isClosable: true });
        }

        spinner(false)
        onClose()
        SetFile(null)
      })
  };

  useEffect(() => {
    if (
      !Array.isArray(reconstructedArray) || // not an array
      reconstructedArray.length === 0 || // empty array
      !reconstructedArray[0]?.name || // name is undefined, null, or falsy
      reconstructedArray[0].name === "None"
    ) {
      axios
        .get("http://localhost/exam-bank/api/SubjectRoute.php", {
          params: { action: "GetAllSubjects", type: user.usertype },
        })
        .then((response) => {
          SetSubjects(response.data);
          SetSelectedSubject(response.data[0].name)
        })
        .catch((error) => {
          console.error("Error fetching subjects:", error);
        });
    } else {
      SetSubjects(reconstructedArray)
      SetSelectedSubject(reconstructedArray[0].name)
    }
  }, []);

  const handleChangeSelectedSubject = (e) => {
    const subject = e.target.value;
    SetSelectedSubject(subject)
  }

  const RenderSubject = () => {
    return user.type === "Instructor" ? (
      <Select
        value={SelectedSubject}
        onChange={handleChangeSelectedSubject}
        mb={4}
        size="sm"
      >
        {Subjects.map((subject, index) => (
          <option key={index} value={subject}>
            {subject}
          </option>
        ))}
      </Select>
    ) : (
      <Select
        value={SelectedSubject}
        onChange={handleChangeSelectedSubject}
        mb={4}
        size="sm"
      >
        {Subjects.map((subject, index) => (
          <option key={index} value={subject.name}>
            {subject.name}
          </option>
        ))}
      </Select>
    );
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "http://localhost/exam-bank/BATCH_QUESTION.xlsx";
    link.download = "BATCH_QUESTION.xlsx";
    link.click();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay>
          <ModalContent>
            <ModalCloseButton />
            <ModalHeader>
              <Text fontWeight="semibold">UPLOAD CSV or XLSX</Text>
            </ModalHeader>
            <ModalBody>
              <Stack>
                <Text fontWeight="semibold">SUBJECT</Text>
                {RenderSubject()}
                <Text fontWeight="semibold">SELECT FILE TO UPLOAD</Text>
                <Input size="sm" type="file" accept=".csv, .xlsx" onChange={HandeFileChange} />
              </Stack>
            </ModalBody>
            <ModalFooter>
              <Button
                leftIcon={<TbDownload />}
                size="sm"
                mr={2}
                onClick={handleDownload}
              >
                Template
              </Button>
              <Button
                colorScheme="green"
                size="sm"
                leftIcon={<TbCheck />}
                onClick={HandleCreate}
              >
                Upload File
              </Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </>
  );
}
