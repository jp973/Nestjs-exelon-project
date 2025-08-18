export class UsersService {
    createUsers() {
        throw new Error('Method not implemented.');
    }
    users: {id:number,name: string, age: number,gender:string,ismarried:boolean}[] = [
        {id:1,name: 'John', age: 28,gender:'male',ismarried:true},
        {id:2,name: 'Jane', age: 27,gender:'female',ismarried:false},
    ]
    getAllUsers(){
    return this.users;
    }
    getUserById(id: number){
        return this.users.find(user => user.id === id);
    }
    addUser(user: {id:number,name: string, age: number,gender:string,ismarried:boolean}){
        this.users.push(user);
    }
}