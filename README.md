# 1.State Transition
These are the states - 
* idle - initial editable stage
* pending - submission in progress
* retrying - temporary failure, automatic retry
* success - submission done successfully
* error - all retries completed
In the UI status message is displayed and Button is disabled till final submission

# 2. Retry
* Whenever the mockapi sends response with a status of 503 the function is agaiin called with the same payload
* retryCount is incremented
* until max retries is reached this function is called untill a successful submission with status 200

# 3. Preventing Duplicate Submission
* In a real backend system the ids are generated to prevent duplicates
* Here I have used requestId in frontend to keep the same payload for all retries
* The button is disabled using a isSubmitted flag variable so that there are no duplicate submissions

