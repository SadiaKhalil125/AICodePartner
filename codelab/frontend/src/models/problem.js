class Problem{
    constructor(id=null,title, description, inputFormat, outputFormat, constraints, examples, difficulty = 'Easy', tags = [], testCases = [], topic = '') {
        if(id)
        {
            this.id = id;
        }
        this.title = title;
        this.description = description;
        this.inputFormat = inputFormat;
        this.outputFormat = outputFormat;
        this.constraints = constraints;
        this.examples = examples;
        this.difficulty = difficulty; // Default to 'Easy'
        this.tags = tags; // Array of tags for categorization
        this.topic = topic; // e.g., array, string, linkedlist, etc.
        this.testCases = testCases; // Array of test cases
    }
}
export default Problem;