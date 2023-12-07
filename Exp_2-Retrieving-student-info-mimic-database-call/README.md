## Exp_2 - Mimic database call to retrieve student info
<br>

### Objective
- Create a simple python example, in a jupyter notebook, to mimic a database call. The function retrieves student info.
  
### Notes
- Given a student id, when the model did not know the student name it hallucinated a name.
- I passed multiple info on a student to the model as a json string. The model was then able to answer questions on the student without having to make a function call each time. Therefore, it's possible to query a database and pass a batch of data to the model. Then, it's possible to ask the model various questions about the data. 
