import {
  Button, Stack, Radio, RadioGroup, Select, Flex, Text, Textarea, Input, useToast, Modal, ModalOverlay,
  ModalContent, ModalHeader, ModalCloseButton, Heading, ModalBody, ModalFooter, CheckboxGroup, Checkbox, HStack
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import useUserStore from "../helper/useUserStore";
import { TbCheck } from "react-icons/tb";
import { getDatabase, ref, set } from "firebase/database";
import app from "../helper/Firebase";

CreateQuestionForm.propTypes = { isOpen: PropTypes.bool.isRequired, onClose: PropTypes.func.isRequired };

export default function CreateQuestionForm({ isOpen, onClose }) {
  const { fullname, user_assigned_subject, usertype } = useUserStore((state) => state.user);
  const parsedSubjects = JSON.parse(user_assigned_subject) || [];
  const firebaseDB = getDatabase(app);
  const toast = useToast();

  const [question, setQuestion] = useState("");
  const [selectedOption, setSelectedOption] = useState("Identification");
  const [multipleChoices, setMultipleChoices] = useState([]);
  const [selectedClassification, setSelectedClassification] = useState("Knowledge");
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTerms, setSelectedTerms] = useState([]);

  const updateMultipleChoices = (type) => {
    const templates = {
      Identification: [{ id: 1, option: "", is_correct: true }],
      "True/False": [
        { id: 1, option: "True", is_correct: false },
        { id: 2, option: "False", is_correct: false }
      ],
      Enumeration: [],
      Multiple: Array.from({ length: 4 }, (_, i) => ({ id: i + 1, option: `Option ${i + 1}`, is_correct: false }))
    };
    setMultipleChoices(templates[type] || []);
  };

  useEffect(() => {
    updateMultipleChoices(selectedOption);
    if (parsedSubjects.includes("None")) {
      axios.get("http://localhost/exam-bank/api/SubjectRoute.php", { params: { action: "GetAllSubjects", type: usertype } })
        .then(({ data }) => { setSubjects(data); setSelectedSubject(data[0]?.name || ""); })
        .catch(console.error);
    } else {
      setSubjects(parsedSubjects);
      setSelectedSubject(parsedSubjects[0]);
    }
  }, []);

  const handleCreate = () => {
    if (!question.trim()) return alert("Please enter your question.");
    
    const data = {
      question,
      options: multipleChoices,
      answer: multipleChoices.filter((item) => item.is_correct),
      category: selectedOption,
      created_by: fullname,
      terms: selectedTerms,
      subject: selectedSubject,
      classification: selectedClassification
    };

    axios.post("http://localhost/exam-bank/api/QuestionRoute.php?action=create", data).then(({ data }) => {
      if (data) {
        toast({ title: "Question Created!", description: `Question: ${question} successfully created`, status: "success", duration: 3000, isClosable: true });
        set(ref(firebaseDB, `logs/${Date.now()}`), { action: "Question Added", timestamp: Date.now(), target: question, actor: fullname });
        
        setSelectedTerms([])
        setQuestion("")
        setMultipleChoices([])
        onClose()
      }
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader><Heading size="md">CREATE QUESTION</Heading></ModalHeader>
        <ModalBody>
          <Stack>
            <Text fontWeight="semibold">SUBJECT</Text>
            <Select size="sm" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
              {subjects.map((subject, index) => (
                <option key={index} value={subject.name || subject}>{subject.name || subject}</option>
              ))}
            </Select>
            <Text fontWeight="semibold">QUESTION</Text>
            <Input size="sm" placeholder="Enter question" value={question} onChange={(e) => setQuestion(e.target.value)} />
            <Text fontWeight="semibold">TERMS</Text>
            <CheckboxGroup colorScheme="blue" value={selectedTerms} onChange={setSelectedTerms}>
              <HStack justifyContent="space-evenly">
                {["Prelims", "Midterms", "Finals"].map(term => <Checkbox key={term} value={term}>{term}</Checkbox>)}
              </HStack>
            </CheckboxGroup>
            <Text fontWeight="semibold">CLASSIFICATION</Text>
            <Select size="sm" value={selectedClassification} onChange={(e) => setSelectedClassification(e.target.value)}>
              {["Knowledge", "Comprehension", "Application", "Analysis", "Synthesis", "Evaluation"].map((val) => (
                <option key={val} value={val}>{val}</option>
              ))}
            </Select>
            <Text fontWeight="semibold">CATEGORY</Text>
            <Select size="sm" value={selectedOption} onChange={(e) => { setSelectedOption(e.target.value); updateMultipleChoices(e.target.value); }}>
              {["Identification", "Enumeration", "True/False", "Multiple"].map(type => <option key={type} value={type}>{type}</option>)}
            </Select>
            <Text fontWeight="semibold">OPTIONS</Text>
            {selectedOption === "Identification" && <Input size="sm" placeholder="Enter answer" onChange={(e) => setMultipleChoices([{ id: 1, option: e.target.value, is_correct: true }])} />}
            {selectedOption === "Enumeration" && <Textarea size="sm" placeholder="Enter answers" onChange={(e) => setMultipleChoices(e.target.value.split("\n").filter(val => val.trim()).map((val, i) => ({ id: i + 1, option: val, is_correct: true })))} />}
            {selectedOption === "True/False" && <RadioGroup onChange={(val) => setMultipleChoices(multipleChoices.map(opt => ({ ...opt, is_correct: opt.option.toLowerCase() === val })))}>
              <Stack>{multipleChoices.map(opt => <Radio key={opt.id} value={opt.option.toLowerCase()}>{opt.option}</Radio>)}</Stack>
            </RadioGroup>}
            {selectedOption === "Multiple" && <Stack>{multipleChoices.map(opt => <Flex key={opt.id} alignItems="center" gap={4}><Checkbox isChecked={opt.is_correct} onChange={() => setMultipleChoices(multipleChoices.map(o => o.id === opt.id ? { ...o, is_correct: !o.is_correct } : o))} /><Input size="sm" value={opt.option} onChange={(e) => setMultipleChoices(multipleChoices.map(o => o.id === opt.id ? { ...o, option: e.target.value } : o))} /></Flex>)}</Stack>}
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="green" rightIcon={<TbCheck />} size="sm" onClick={handleCreate}>CREATE</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}