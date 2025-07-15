class CodeSubmission {
    constructor(id=null, language, code, input, problem, user_id) {
        if (id) {
            this.id = id;
        }
        this.language = language;
        this.code = code;
        this.input = input;
        this.problem = problem;
        this.user_id = user_id;

    }
}

export default CodeSubmission;