# ChatGPT Function Calling Experiments
My experiments learning and implementing ChatGPT function calling.

<br>

<img src="https://github.com/vbookshelf/ChatGPT-Function-Calling-Experiments/blob/main/images/robot.jpg" width="450"></img>
<i></i><br>

<br>

- ChatGPT does not call any functions.
- We define a function to do something e.g. add two numbers.
- We tell chatgpt that the function exists, what it does and what inputs it needs.
- When the user asks chatgpt to add two numbers, ChatGPT outputs a message that contains the input that's needed to call the function.
- We take this input and use it to call the function and get the result.
- We then pass the result to chatgpt as a message.
- ChatGPT then creates a new output message that gets shown to the user.

  <br>

## Experiments

- Exp_1 - Create a simple python chatgpt function calling example<br>
https://github.com/vbookshelf/ChatGPT-Function-Calling-Experiments/tree/main/Exp_1-Simple-python-function-calling-example

- Exp_2 - Mimic database call to retrieve student info<br>
https://github.com/vbookshelf/ChatGPT-Function-Calling-Experiments/tree/main/Exp_2-Retrieving-student-info-mimic-database-call

- Exp_3 - Combine ChatGPT and Dalle 3 by using Function Calling<br>
https://github.com/vbookshelf/ChatGPT-Function-Calling-Experiments/tree/main/Exp_3-Combining-chatgpt-and-dalle3-using-function-calling

- Exp_4 - Build a Javascript ChatGPT web app with function calling<br>
https://github.com/vbookshelf/ChatGPT-Function-Calling-Experiments/tree/main/Exp_4-Javascript-web-app-with-function-calling

<br>

## Resources

- OpenAI Function Calling via ChatGPT API Python Tutorial for Developers<br>
(This tutorial shows a simple example of how functions are used with ChatGPT.)
https://www.youtube.com/watch?v=DwbCDBcA2m4

- OpenAI "Create Chat Completion" docs
(Click on "Functions" to see the example chat completion code that includes info on the function.)<br>
https://platform.openai.com/docs/api-reference/chat/create
