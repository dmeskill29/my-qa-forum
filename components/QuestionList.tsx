// components/QuestionList.tsx
import React from "react";

// const QuestionList = ({ questions = [] }) => {
//   return (
//     <div>
//       {questions.map((question) => (
//         <div key={question.id}>
//           <h2>{question.title}</h2>
//           <p>{question.content}</p>
//         </div>
//       ))}
//     </div>
//   );
// };

const QuestionList = ({ questions }) => {
  // Check if questions is an array before using map
  if (!Array.isArray(questions)) {
    console.error("questions is not an array:", questions);
    return <div>No questions available</div>;
  }
  return (
    <div>
      {questions.map((question) => (
        <div key={question.id}>
          <h2>{question.title}</h2>
          <p>{question.content}</p>
        </div>
      ))}
    </div>
  );
};

export default QuestionList;
