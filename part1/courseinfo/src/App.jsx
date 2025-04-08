/* eslint-disable react/prop-types */
import React from 'react';

const Header = (props) => {
  return <h1>{props.course}</h1>;
};

const Part = (props) => {
  return (
    <p>
      {props.name} {props.exercises}
    </p>
  );
};

const Content = (props) => {
  return (
    <>
      {props.parts.map((part) => {
        return (
          <Part key={part.name} name={part.name} exercises={part.exercises} />
        );
      })}
    </>
  );
};

const Total = (props) => {
  return <p>Number of exercises {props.total}</p>;
};

const App = () => {
  const course = "Half Stack application development";
  const part1 = "Fundamentals of React";
  const exercises1 = 10;
  const part2 = "Using props to pass data";
  const exercises2 = 7;
  const part3 = "State of a component";
  const exercises3 = 14;

  return (
    <>
      <Header course={course} />
      <Content
        parts={[
          {
            name: part1,
            exercises: exercises1,
          },
          {
            name: part2,
            exercises: exercises2,
          },
          {
            name: part3,
            exercises: exercises3,
          },
        ]}
      />
      <Total total={exercises1 + exercises2 + exercises3} />
    </>
  );
};

export default App;
