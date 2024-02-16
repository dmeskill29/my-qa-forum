// components/QuestionList.tsx
import Link from "next/link";
import React from "react";
import Question from "./Question";

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
        <div>
          <Link href={`/${question.id}`} key={question.id}>
            <Question questionId={question.id} />
          </Link>
        </div>
      ))}
    </div>
  );
};

export default QuestionList;
