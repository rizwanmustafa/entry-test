import axios from "axios";
import { SUBJECTS_API_URL } from "../constants/api";

// Import styles
import "../css/styles.css";

const subjectListElement = document.getElementById("subject-list");

const subjectRefreshElement = document.getElementById("subject-refresh-btn");
subjectRefreshElement.addEventListener("click", async () => {
  const subjects = await getSubjects();
  updateSubjectsDom(subjects);
});

const subjectSelectAllElement = document.getElementById("subject-select-all-btn");
subjectSelectAllElement.addEventListener("click", () => alterAllSubjectSelectState(true));

const subjectSelectNoneElement = document.getElementById("subject-select-none-btn");
subjectSelectNoneElement.addEventListener("click", () => alterAllSubjectSelectState(false));

const subjectDeleteElement = document.getElementById("subject-delete-btn");
subjectDeleteElement.addEventListener("click", () => {
  getSelectedSubjectIds();
});

const getSubjects = async (): Promise<Subject[] | null> => {
  try {
    const request = await axios.get(SUBJECTS_API_URL);
    return request.data;
  }
  catch (error) {
    console.error(error.message);
    return null;
  }
}

const updateSubjectsDom = (subjects: Subject[] | null) => {
  if (subjects === null) {
    subjectListElement.innerHTML = "<p>No Subjects from API!</p>";
    return;
  }

  let newHtml = ``;


  subjects.forEach(subject => {
    newHtml += `
    <div>
      <input type="checkbox">
      <span subject-id='${subject.id}'>${subject.name}</span>
      </div>
    `
  })
  subjectListElement.innerHTML = newHtml;
}

const getSelectedSubjectIds = (): Subject["id"][] => {
  const selectedSubjects = subjectListElement.querySelectorAll("input[type='checkbox']:checked");
  selectedSubjects.forEach(i => {
    console.log(i.nextElementSibling.getAttribute("subject-id"));
  });
  return ["0"];
}

const alterAllSubjectSelectState = (checked = false) => {
  const checkboxElements = subjectListElement.querySelectorAll<HTMLInputElement>("input[type='checkbox']");

  checkboxElements.forEach(checkboxElement => {
    checkboxElement.checked = checked;
  })
}

(async () => {
  updateSubjectsDom(null);
  const subjects = await getSubjects();
  updateSubjectsDom(subjects);

})();
