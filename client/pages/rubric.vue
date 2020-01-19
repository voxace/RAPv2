<template>
  <v-layout>
    <v-flex xs12>
      <h1>RAP Rubric</h1>
      <p>
        Use the rubric to guide your scoring for each student.
        <a href="/RAP-Rubric.pdf">Click here</a> to download a PDF to keep or
        print.
      </p>
      <v-card class="elevation-6 card-table">
        <table class="rap-table">
          <thead>
            <tr>
              <th scope="col" width="5%">Score</th>
              <th scope="col" width="11%"></th>
              <th scope="col" width="28%">Respect</th>
              <th scope="col" width="28%">Responsibility</th>
              <th scope="col" width="28%">Learning</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="rap-score">
                <h1>5</h1>
              </td>
              <td class="rap-descriptor">
                <h4>Always</h4>
              </td>
              <td rowspan="5" class="rap-criteria">
                <strong>Is a respectful student who always:</strong>
                <ul>
                  <li>
                    Wears school uniform to promote a positive image of the
                    school
                  </li>
                  <li>Follows staff instructions</li>
                  <li>Speaks politely and uses manners</li>
                  <li>Maintains a clean and safe environment</li>
                  <li>Listens to the speaker without interrupting</li>
                  <li>Puts their hand up to speak</li>
                </ul>
              </td>
              <td rowspan="5" class="rap-criteria">
                <strong>Is a responsible student who always:</strong>
                <ul>
                  <li>Is in the right place at the right time</li>
                  <li>Has digital devices on silent and in their bag</li>
                  <li>Has a pass to be out of class when necessary</li>
                  <li>
                    Is honest regarding the property of the school and others.
                  </li>
                  <li>Uses equipment for its purpose</li>
                </ul>
              </td>
              <td rowspan="5" class="rap-criteria">
                <strong>Demonstrates learning by always:</strong>
                <ul>
                  <li>Having necessary equipment ready to learn</li>
                  <li>Asking questions if unsure of task</li>
                  <li>Completing all tasks to the standard requested.</li>
                  <li>Letting others work</li>
                  <li>Submitting work on time</li>
                </ul>
              </td>
            </tr>
            <tr class="alternate">
              <td class="rap-score">
                <h1>4</h1>
              </td>
              <td class="rap-descriptor">
                <h4>Frequently</h4>
              </td>
            </tr>
            <tr>
              <td class="rap-score">
                <h1>3</h1>
              </td>
              <td class="rap-descriptor">
                <h4>Sometimes</h4>
              </td>
            </tr>
            <tr class="alternate">
              <td class="rap-score">
                <h1>2</h1>
              </td>
              <td class="rap-descriptor">
                <h4>Developing</h4>
              </td>
            </tr>
            <tr>
              <td class="rap-score">
                <h1>1</h1>
              </td>
              <td class="rap-descriptor">
                <h4>Not Yet</h4>
              </td>
            </tr>
          </tbody>
        </table>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<style scoped>
table,
th,
td {
  border: 1px solid #ddd;
  border-collapse: collapse;
  padding: 10px;
  color: #444;
  table-layout: fixed;
}
thead {
  background-color: rgb(253, 216, 53);
  font-size: 1.2rem;
}
.alternate {
  background-color: rgb(251, 251, 255);
}
.rap-table {
  min-width: 100%;
}
.rap-score {
  text-align: center;
  font-size: 1.5rem;
}
.rap-descriptor {
  text-align: center;
  font-size: 1.2rem;
}
.rap-criteria {
  line-height: 3;
}
.v-content {
  padding-top: 64px !important;
}
@media only screen and (max-device-width: 875px) {
  table,
  th,
  td {
    font-size: 0.5rem;
  }
  .card-table {
    overflow: scroll;
  }
  .rap-score {
    font-size: 0.5rem;
  }
  .rap-descriptor {
    font-size: 0.6rem;
  }
  .rap-criteria {
    line-height: 1.25;
  }
}
</style>
