# Student Academic Analysis App - Backend

This application contains a simple TypeScript project wth Express.js and MongoDB that showcases the best practices, project structure, and code for the technical assessment of student feedbacks provided by the teacher.

Teachers can input student feedbacks/records, view charts displaying subject averages, and leverage OpenAI's LLM AI model for insightful feedback.

# Features included are:

- Teachers have the ability to add student records/feedback from the home page (/).
- Teachers can access all student records/feedback from the Student Records Page (/student-records).
- Teachers can view students' subject performance percentages on the Subject Score Analysis Page (/subject-score).
- Teachers can generate meaningful AI-generated feedback for students by selecting a student on the Generate Student Analysis Page (/generate-analysis).
- In the context of Student Analysis, I have used the Langchain LLM AI Model, which functions as follows:
  - Local data is provided to LLM through Langchain Node.js.
  - Langchain processes this data by loading documents locally.
  - It operates by taking a substantial source of data, such as 10 feedbacks, and divides it into segments referred to as Vector Store, which serves as a database.
  - Langchain can also process feedback added by teachers using OpenAI or other LLM models.

## Getting Started

These instructions will get project running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/)
- [TypeScript](https://www.typescriptlang.org/) (`npm install -g typescript`)
- [MongoDB](https://www.mongodb.com/)

#### Check Node Version

Check version with this command, `node -v`
Node version should be v18 or v18+

If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.

`npm install npm -g`

### Installation

1. Install dependencies:
   `npm install`

2. Compile TypeScript to JavaScript:
   `tsc`

## Configure app

Add `.env` file at root of the project. Sample values available in `.env.example` file.

## PORT

This app would run on port `8080`

### Running the Project

To run the project:

`npm start`

## Development

This project uses `tslint` for linting.


## Built With

- [TypeScript](https://www.typescriptlang.org/) - Primary language
- [Node.js](https://nodejs.org/) - Runtime
- [MongoDB](https://www.mongodb.com/) - Database
