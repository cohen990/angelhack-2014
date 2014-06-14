function init(_blackCard, _userID){
	// add new session to db
	// get that/last session from db
	mockSession = {
		id:"1",
		blackCard: _blackCard,
		UID: _userID,
		timeout: 20,
		maxResponses: 3
	}

	return mockSession;
}