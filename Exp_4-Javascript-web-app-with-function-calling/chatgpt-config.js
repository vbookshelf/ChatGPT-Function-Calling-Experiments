
// Config
//-------
// This code uses ChatGPT function calling.


// Your API Key
const apiKey = 'Your-API-Key'; 

const bot_name = 'Assistant';  	// Give the bot a name
const user_name = 'User';	// Set your chat name 




/* 

Notes:

1- Please add your OpenAi API key above.

3- Quote from the docs: OpenAI models are non-deterministic, meaning that identical inputs can yield different outputs. Setting temperature to 0 will make the outputs mostly deterministic, but a small amount of variability may remain.

3- This chatbot has context memory. As a result the API token cost
   will increase quickly. Please monitor your costs carefully.
   
4- I suggest that you keep the console open when using this app. Any errors will
  show up in the console. There could be errors when the OpenAi API 
  is overloaded with requests.
   
*/




const model_type = "gpt-3.5-turbo"; // 4096 tokens
const openai_url = 'https://api.openai.com/v1/chat/completions';

// The max number of tokens to generate in the chat completion.
// I found that if this number is set too high then there will be 
// an undefined response, even if the number is within the model's token limit. 
const max_tokens = 1000; 

// 0 to 2. Higher values like 0.8 will make the output more random, 
// while lower values like 0.2 will make it more focused and deterministic.
// Alter this or top_p but not both.
const temperature = 0.21;

// -2 to 2. Higher values increase the model's likelihood to talk about new topics.
// Reasonable values for the penalty coefficients are around 0.1 to 1.
const presence_penalty = 0; 

// -2 to 2. Higher values decrease the model's likelihood to repeat the same line verbatim.
// Reasonable values for the penalty coefficients are around 0.1 to 1.
const frequency_penalty = 0.5;




// Remove these suffixes. I think removing them makes the chat sound more natural.
// They will sliced off the bot's responses.
// This is done below in the 'Remove suffixes' part of the code.
var suffixes_list = ['How can I help you?', 'How can I assist you today?', 'How can I help you today?', 'Is there anything else you would like to chat about?', 'Is there anything else I can assist you with today?', 'Is there anything I can help you with today?', 'Is there anything else you would like to chat about today?', 'Is there anything else I can assist you with?'];


// The message history is stored in this variable.
// Storing the message history allows the bot to have context memory.

var message_list;





// Option 1: The user does not load a saved chat
//-----------------------------------------------


// This determines how the bot behaves.
//system_setup_message = "Your name is " + bot_name + ". You are a friendly personal assistant.";

var system_setup_message = `
Your name is ${bot_name}. You are a kind and friendly assistant.
`;



// Create a list with the first item being a dict
message_list = [{"role": "system", "content": system_setup_message}];



// Option 2: The user loads a saved chat (csv file)
//--------------------------------------------------

// The previous chat history will be loaded from the csv file.
// The system_setup_mesaage that defines the bot's behaviour is included in the
// saved chat history.
// The message_list variable is assigned inside the loadChatHistoryFromCsv() function.
// The chat continues from where the chat in the csv file stopped.

const fileInput = document.getElementById("csv-file");

fileInput.addEventListener("change", function(event) {
	
  const file = event.target.files[0];
  
  loadChatHistoryFromCsv(file);
});




// OpenAI API - Javascript
//-------------------------

async function makeApiRequest(my_message) {
	
		//-----------------------------------
		// Define the tools and the function
		//-----------------------------------
	
		const tools = [
		  {
		    type: "function", // What kind of tool is it
		    function: {
		      name: "getStudentInfo",
		      description: "Given a student id, this function returns a dictionary containing the full name and date of birth of a student.",
		      // What do we want chatgpt to return
		      parameters: {
		        type: "object", // We want an object
		        properties: {
		          student_id: {
		            type: "string",
		            description: "The id of the student.",
		          },
		        }, // close properties
		
		        // Both numbers are required
		        required: ["prompt"],
		      }, // close parameters
		    }, // close function
		  }, // close first curly brace
		  ];
	
		  
		  
		  // This mimics a database that contains student info.
			const jsonData = `
			{
			  "students": [
			    {
			      "full_name": "John Smith",
			      "student_id": "A123456",
			      "date_of_birth": "1998-05-15"
			    },
			    {
			      "full_name": "Emily Johnson",
			      "student_id": "B789012",
			      "date_of_birth": "2000-09-22"
			    },
			    {
			      "full_name": "Michael Davis",
			      "student_id": "C345678",
			      "date_of_birth": "1999-03-08"
			    },
			    {
			      "full_name": "Sophia Garcia",
			      "student_id": "D901234",
			      "date_of_birth": "2001-11-10"
			    },
			    {
			      "full_name": "Ethan Wilson",
			      "student_id": "E567890",
			      "date_of_birth": "1997-07-04"
			    }
			  ]
			}`;
			
			// Parse the JSON data
			const data = JSON.parse(jsonData);
			
			// This function provides info for just one student
			function getStudentInfo(studentId) {
			  for (const student of data.students) {
			    if (student.student_id === studentId) {
			      return student;
			    }
			  }
			  return null; // Return null if the studentId is not found
			}
			
			
			
			
			
		//----------------
		// Run the code
		//----------------
	
		// This scrolls the page up by cicking on a div at the bottom of the page.
		// This shows the user's message.
		// Note that if the click is simlated "on page load" then the cursor 
		// will not autofocus in the form input.
		simulateClick('scroll-page-up');

	  try {
		  
		// Append to message_list. This is the history of chat messages.
		message_list.push({"role": "user", "content": my_message});
		
	    const response = await fetch(openai_url, {
			
	      method: 'POST',
	      headers: {
			Authorization: `Bearer ${apiKey}`,
	        'Content-Type': 'application/json'
	      },
	      body: JSON.stringify({
			 model: model_type,
	        messages: message_list,
	        max_tokens: max_tokens,
			temperature: temperature,
			presence_penalty: presence_penalty,
			frequency_penalty: frequency_penalty,
			tools:tools,
			tool_choice:"auto"
	      })
	    })
		
		
	    const data = await response.json();
		
		
		// Get the response text
		var response_text = data['choices'][0]['message']['content'];
		
		// Get the finish_reason
		// "tool_calls"
		var finish_reason = data['choices'][0]['finish_reason'];
		
		console.log(finish_reason)
		
		
		// If the model did not return function arguments
		if (finish_reason != "tool_calls") {
		
		
			// Replace the suffixes with "":
			// This removes sentences like: How can I help you today?
			// For each suffix in the list...
			 suffixes_list.forEach(suffix => {
		      
				// Replace the suffix with nothing.
		        response_text = response_text.replace(suffix, "");
				
		  	});
			
			
			
			// Format the response so it can be displayed on the web page.
			var paragraph_response = formatResponse(response_text);
				
			
			console.log(response_text)
			
			
			// Append to message_list. This is the history of chat messages.
			message_list.push({"role": "assistant", "content": paragraph_response});
				
			
			var input_message = {
			  sender: bot_name,
		  		text: paragraph_response
			};
			
			
			// Add the message from Maiya to the chat
			addMessageToChat(input_message);
			
			
			// Scroll the page up by cicking on a div at the bottom of the page.
			simulateClick('scroll-page-up');
			
			// Put the cursor in the form input field
			const inputField = document.getElementById("user-input");
			inputField.focus();
			
		
		} else {
		// The model has output function arguments
		
			// Get the function name
			const function_name = data['choices'][0]['message']['tool_calls'][0]['function']['name'];
		
			// Get the function arguments
			var arguments = data['choices'][0]['message']['tool_calls'][0]['function']['arguments'];
			
			console.log(arguments)
			
			//const studentId = arguments['student_id'];
			
			const studentObject = JSON.parse(arguments);
			const studentId = studentObject['student_id'];
			
			// Call the function
			const student_info = getStudentInfo(studentId);
			
			// Convert the object to a JSON-formatted string
			const jsonString = JSON.stringify(student_info);
			
			
			// Append to message_list. This is the history of chat messages.
			message_list.push({"role": "function", "name": function_name, "content": jsonString});
			
			console.log(message_list)
			
			
		// Make an API request to send the output of
		// the function to the model as a message.
		try {
		  
			
			
		    const response = await fetch(openai_url, {
				
		      method: 'POST',
		      headers: {
				Authorization: `Bearer ${apiKey}`,
		        'Content-Type': 'application/json'
		      },
		      body: JSON.stringify({
				 model: model_type,
		        messages: message_list,
		        max_tokens: max_tokens,
				temperature: temperature,
				presence_penalty: presence_penalty,
				frequency_penalty: frequency_penalty,
				tools:tools,
				tool_choice:"auto"
		      })
		    })
			
			
		    const data = await response.json();
			
			
			// Get the response text
			var response_text = data['choices'][0]['message']['content'];
			
			// Get the finish_reason
			// "tool_calls"
			var finish_reason = data['choices'][0]['finish_reason'];
			
			console.log(response_text)
			
			
			// Replace the suffixes with "":
			// This removes sentences like: How can I help you today?
			// For each suffix in the list...
			 suffixes_list.forEach(suffix => {
		      
				// Replace the suffix with nothing.
		        response_text = response_text.replace(suffix, "");
				
		  	});
			
			
			
			// Format the response so it can be displayed on the web page.
			var paragraph_response = formatResponse(response_text);
				
			
			console.log(response_text)
			
			
			// Append to message_list. This is the history of chat messages.
			message_list.push({"role": "assistant", "content": paragraph_response});
				
			
			var input_message = {
			  sender: bot_name,
		  		text: paragraph_response
			};
			
			
			// Add the message from Maiya to the chat
			addMessageToChat(input_message);
			
			
			// Scroll the page up by cicking on a div at the bottom of the page.
			simulateClick('scroll-page-up');
			
			// Put the cursor in the form input field
			const inputField = document.getElementById("user-input");
			inputField.focus();
			
			
		} catch (error) {
		  
	    console.log(error);
		
		}
			
		
				
			
			
		}
		
		
	  } catch (error) {
		  
	    console.log(error);
		
	  }
  
  }