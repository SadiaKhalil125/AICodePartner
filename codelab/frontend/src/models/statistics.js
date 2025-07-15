class Statistics{
    constructor(username, email, problemsSolved, mediumcount, easycount, difficultcount, accuracy, prominentLanguage = 'CPP')
    {
        this.username = username; // Username of the user
        this.email = email; // Email of the user
        this.problemsSolved = problemsSolved; // Total number of problems solved
        this.mediumcount = mediumcount; // Number of medium difficulty problems solved
        this.easycount = easycount; // Number of easy difficulty problems solved
        this.difficultcount = difficultcount; // Number of difficult problems solved
        this.accuracy = accuracy; // Accuracy percentage of the user
        this.prominentLanguage = prominentLanguage; // Most used programming language
    }
}
export default Statistics;