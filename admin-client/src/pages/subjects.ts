import axios from "axios";
import { SUBJECTS_API_URL } from "../constants/api";

// Import styles
import "../css/styles.css";

// TODO: Add a way to display a warning message if there are no subjects

// HTML Elements and their events
const subjectListDiv = document.getElementById("subject-list");

const subjectRefreshButton = document.getElementById("subject-refresh-btn");
subjectRefreshButton.addEventListener("click", async () => updateSubjectsDom(await getSubjects()));

const subjectSelectAllButton = document.getElementById("subject-select-all-btn");
subjectSelectAllButton.addEventListener("click", () => alterAllSubjectSelectState(true));

const subjectSelectNoneButton = document.getElementById("subject-select-none-btn");
subjectSelectNoneButton.addEventListener("click", () => alterAllSubjectSelectState(false));

const subjectDeleteButton = document.getElementById("subject-delete-btn");
subjectDeleteButton.addEventListener("click", async () => deleteSelectedSubjects());

const subjectFilterButton = document.getElementById("subject-filter-btn");
const subjectFilterTextbox = document.getElementById("subject-filter-textbox") as HTMLInputElement;
subjectFilterButton.addEventListener("click", () => filterSubjects());

const subjectFilterResetButton = document.getElementById("subject-reset-btn");
subjectFilterResetButton.addEventListener("click", () => filterSubjects(""))

/* -------- */

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
    subjectListDiv.innerHTML = "<p>No Subjects from API!</p>";
    return;
  }

  let newHtml = ``;


  subjects.forEach(subject => {
    newHtml += `
    <div subject-id='${subject.id}'>
      <input type="checkbox">
      <span>${subject.name}</span>
      </div>
    `
  })
  subjectListDiv.innerHTML = newHtml;
}

const getSelectedSubjectIds = (): Subject["id"][] => {
  const selectedSubjects = subjectListDiv.querySelectorAll("input[type='checkbox']:checked");
  const ids: string[] = [];
  selectedSubjects.forEach(i => {
    ids.push(i.parentElement.getAttribute("subject-id"));
  });

  return ids;
}

const deleteSelectedSubjects = () => {
  const selectedSubjectIds = getSelectedSubjectIds();

  selectedSubjectIds.forEach(subjectId => {
    axios.delete(SUBJECTS_API_URL, { data: { id: subjectId } })
      .then(() => {
        const element = subjectListDiv.querySelector(`div[subject-id='${subjectId}']`);
        element.remove();
      })
      .catch(err => {
        console.error(err);
      });
  })
}

const alterAllSubjectSelectState = (checked = false) => {
  const checkboxElements = subjectListDiv.querySelectorAll<HTMLInputElement>("input[type='checkbox']");

  checkboxElements.forEach(checkboxElement => {
    checkboxElement.checked = checked;
  })
}

const filterSubjects = (filterKeyword: string = null) => {
  filterKeyword = filterKeyword === null ? subjectFilterTextbox.value : filterKeyword;
  console.log(filterKeyword);

  const subjectElements = subjectListDiv.children;

  for (let i = 0; i < subjectElements.length; i++) {
    const subjectElement = subjectElements[i] as HTMLDivElement;
    console.log(subjectElement);
    const subjectName = subjectElement.querySelector("span").textContent;
    const subjectCheckbox = subjectElement.querySelector<HTMLInputElement>("input");

    if (subjectName.includes(filterKeyword)) {
      subjectElement.style.display = "";
    }
    else {
      subjectElement.style.display = "none";
      subjectCheckbox.checked = false;
    }
  }
}

(async () => {
  updateSubjectsDom(null);
  const subjects = await getSubjects();
  updateSubjectsDom(subjects);

})();
