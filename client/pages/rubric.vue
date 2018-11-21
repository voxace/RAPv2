<template>
  <v-layout>
    <v-flex xs12>
      <h1>RAP Rubric</h1>
      <p>Use the rubric to guide your scoring for each student. <a href="/RAP-Rubric.pdf">Click here</a> to download a PDF to keep or print.</p>
      <v-card class="elevation-6">
        <table>
          <thead>
            <tr>
              <th scope="col">Score</th>
              <th scope="col" />
              <th scope="col">Respect</th>
              <th scope="col">Responsibility</th>
              <th scope="col">Learning</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="rap-score">
                <h1>5</h1>
              </td>
              <td class="rap-descriptor">
                <h4>Outstanding</h4>
              </td>
              <td class="align-top">
                <strong>Is a respectful student who always:</strong>
                <ul>
                  <li>Wears school uniform to promote a positive image of the school</li>
                  <li>Follows staff instructions</li><li>Speaks politely and uses manners</li>
                  <li>Maintains a clean and safe environment</li>
                  <li>Listens to the speaker without interrupting</li>
                  <li>Puts their hand up to speak</li>
                </ul>
              </td>
              <td class="align-top">
                <strong>Is a responsible student who always:</strong>
                <ul>
                  <li>Is in the right place at the right time</li>
                  <li>Has digital devices on silent and in their bag</li>
                  <li>Has a pass to be out of class when necessary</li>
                  <li>Tells the truth and is honest regarding the property of the school and others.</li>
                  <li>Uses equipment for its purpose</li>
                </ul>
              </td>
              <td class="align-top">
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
                <h4>Excellent</h4>
              </td>
              <td class="align-top">
                <strong>Is a respectful student who consistently:</strong>
                <ul>
                  <li>Wears school uniform to promote a positive image of the school</li>
                  <li>Follows staff instructions</li>
                  <li>Speaks politely and uses manners</li>
                  <li>Maintains a clean and safe environment</li>
                  <li>Listens to the speaker without interrupting</li>
                  <li>Puts their hand up to speak</li>
                </ul>
              </td>
              <td class="align-top">
                <strong>Is a responsible student who  consistently:</strong>
                <ul>
                  <li>Is in the right place at the right time</li>
                  <li>Has digital devices on silent and in their bag</li>
                  <li>Has a pass to be out of class when necessary</li>
                  <li>Tells the truth and is honest regarding the property of the school and others.</li>
                  <li>Uses equipment for its purpose</li>
                </ul>
              </td>
              <td class="align-top">
                <strong>Demonstrates learning by consistently:</strong>
                <ul>
                  <li>Having necessary equipment ready to learn</li>
                  <li>Asking questions if unsure of task</li>
                  <li>Completing all tasks to the standard requested</li>
                  <li>Letting others work</li>
                  <li>Submitting work on time</li>
                </ul>
              </td>
            </tr>
            <tr>
              <td class="rap-score">
                <h1>3</h1>
              </td>
              <td class="rap-descriptor">
                <h4>Good</h4>
              </td><td class="align-top">
                <strong>Is a respectful student who satisfactorily:</strong>
                <ul>
                  <li>Wears school uniform to promote a positive image of the school</li>
                  <li>Follows staff instructions</li>
                  <li>Speaks politely and uses manners</li>
                  <li>Maintains a clean and safe environment</li>
                  <li>Listens to the speaker without interrupting</li>
                  <li>Puts their hand up to speak</li>
                </ul>
              </td>
              <td class="align-top">
                <strong>Is a responsible student who satisfactorily:</strong>
                <ul>
                  <li>Is in the right place at the right time</li>
                  <li>Has digital devices on silent and in their bag</li>
                  <li>Has a pass to be out of class when necessary</li>
                  <li>Tells the truth and is honest regarding the property of the school and others.</li>
                  <li>Uses equipment for its purpose</li>
                </ul>
              </td>
              <td class="align-top">
                <strong>Demonstrates learning by satisfactorily:</strong>
                <ul>
                  <li>Having necessary equipment ready to learn</li>
                  <li>Asking questions if unsure of task</li>
                  <li>Completing all tasks to the standard requested</li>
                  <li>Letting others work</li>
                  <li>Submitting work on time</li>
                </ul>
              </td>
            </tr>
            <tr class="alternate">
              <td class="rap-score">
                <h1>2</h1>
              </td>
              <td class="rap-descriptor">
                <h4>Of Concern</h4>
              </td>
              <td class="align-top">
                <strong>Is a student who is at times:</strong>
                <ul>
                  <li>Demonstrating disruptive behaviours such as talking, not listening, calling out and interfering with the rights of other students to learn</li>
                  <li>Interrupts the teacher</li>
                  <li>Needs rule reminders</li>
                  <li>Wears school uniform incorrectly or disregards the dress code</li>
                  <li>Fails to maintain a clean and safe environment</li>
                </ul>
              </td>
              <td class="align-top">
                <strong>Is a student who is at times:</strong>
                <ul>
                  <li>Late for class or truants class</li>
                  <li>Is reminded to put their phone away.</li>
                  <li>Leaves the classroom without permission and no pass</li>
                  <li>Dishonest regarding the property of the school and others</li>
                  <li>Uses equipment inappropriately</li>
                </ul>
              </td>
              <td class="align-top">
                <strong>Is a student who is at times:</strong>
                <ul>
                  <li>Arriving with no equipment ready for the lesson.</li>
                  <li>Does not ask questions if unsure of tasks or asks inappropriate questions</li>
                  <li>Does not complete tasks to the standard requested</li>
                  <li>Does not submit assessment tasks on time</li>
                  <li>Interrupts the learning of others</li>
                </ul>
              </td>
            </tr>
            <tr>
              <td class="rap-score">
                <h1>1</h1>
              </td>
              <td class="rap-descriptor">
                <h4>Unsatisfactory Performance</h4>
              </td>
              <td class="align-top">
                <strong>Is a student who is often:</strong>
                <ul>
                  <li>Demonstrates disruptive behaviours such as talking, not listening, calling out and interfering with the rights of other students to learn</li>
                  <li>Interrupts the teacher</li>
                  <li>Needs rule reminders</li>
                  <li>Wears school uniform incorrectly/disregards the dress code</li>
                  <li>Fails to maintain a clean and safe environment</li>
                  <li>Is referred to the Head Teacher</li>
                </ul>
              </td>
              <td class="align-top">
                <strong>Is a student who is often:</strong>
                <ul>
                  <li>Late for class or truants class</li>
                  <li>Reminded to put their phone away</li>
                  <li>Leaves the classroom without permission and no pass</li>
                  <li>Dishonest regarding the property of the school and others</li>
                  <li>Uses equipment inappropriately</li>
                </ul>
              </td>
              <td class="align-top">
                <strong>Is a student who is often:</strong>
                <ul>
                  <li>Arrives to class with no equipment ready for the lesson</li>
                  <li>Does not ask questions if unsure of tasks or asks inappropriate questions</li>
                  <li>Does not complete tasks to the standard requested</li>
                  <li>Does not submit assessment tasks on time</li>
                  <li>Interrupts the learning of others</li>
                </ul>
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
}
thead {
  background-color: rgb(253, 216, 53);
  font-size: 1.2rem;
}
.alternate {
  background-color: rgb(251, 251, 255);
}
.align-top {
  vertical-align: top;
}
.rap-score {
  text-align: center;
  font-size: 1.5rem;
}
.rap-descriptor {
  text-align: center;
  font-size: 1.2rem;
}
.v-content {
  padding-top: 64px !important;
}
</style>
