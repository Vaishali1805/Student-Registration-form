import bcrypt from 'bcrypt';
import { createToken } from "../utils/helper.js";
import { readJsonFile, writeData, getHashedPassword } from "../utils/fileHelpers.js";

export const handleRegister = async (req, res) => {
    try {
        const newUser = req.body;
        const data = await readJsonFile('registeredUsers.json');
        const userExists = Object.values(data).some(user => user.email === newUser.email);
        if (userExists) {
            return res.json({ message: 'User Already Exists', success: false });
        }
        newUser.id = Date.now() + Math.floor(Math.random() * 1000);
        newUser.password = await getHashedPassword(newUser.password);
        data[newUser.id] = newUser;
        await writeData('registeredUsers.json', data);
        res.json({ message: 'User Registered Successfully', success: true });
    } catch (error) {
        console.log("error: ", error)
        res.status(500).json({ message: 'Server Error', success: false });
    }
}

export const handleLogin = async (req, res) => {
    try {
        let { email, password } = req.body;
        const data = await readJsonFile('registeredUsers.json');
        if (!data) return res.json({ message: 'Data not found', success: false });

        const user = Object.values(data).find(user => user.email === email);
        if (!user) {
            return res.json({ message: 'User not Exist Signup first', success: false });
        }
        const match = await bcrypt.compare(password, user.password);
        let token;
        if (match) {
            const payload = {
                id: user.id
            }
            token = await createToken(payload);
        }
        res.json({
            message: match ? 'Login Successfull' : 'Incorrect Password',
            success: match, name: user.name, id: user.id,token: token
        });
    } catch (error) {
        console.log("error: ", error)
        res.status(500).json({ message: 'Server Error', success: false });
    }
}

export const getUserData = async (req, res) => {
    const data = await readJsonFile('registeredUsers.json');
    const userData = Object.values(data).map(({ name, email, id, role }) => ({ name, email, id, role }));
    res.json(userData);
};

export const verifyLogin = async (req,res) => {
    try {
        res.json({message: 'user Logged In',success: true});
    } catch (error) {
        res.json({ message: 'Server Error', success: false });
    }
}