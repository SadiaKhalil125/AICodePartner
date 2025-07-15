class User{
    constructor(name, email, password,id=null) {
    
        this.name = name;
        this.email = email;
        this.password = password;
        if (id) this.id = id; // Optional ID for existing users
    }
}
export default User;